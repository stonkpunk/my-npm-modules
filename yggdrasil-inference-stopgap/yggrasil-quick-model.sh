#!/bin/bash

#see https://chat.openai.com/share/817471f1-1953-43ec-af23-df9dbd04dab9

# Initialize our own variables
filename=""
column=""
test_filename=""
output="model.zip"
learner="RANDOM_FOREST"
nForests=1000

# Process the options
while getopts ":f:c:t:o:l:n:" opt; do
  case $opt in
    f) filename="$OPTARG"
    ;;
    c) column="$OPTARG"
    ;;
    t) test_filename="$OPTARG"
    ;;
    o) output="$OPTARG"
    ;;
    l) learner="$OPTARG"
    ;;
    n) nForests="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

# Check if mandatory parameters provided
if [ -z "$filename" ]; then
    echo "Error: Filename is required. Use -f to specify the filename."
    echo "Usage: $0 -f filename.csv -c column_name [-t test_filename.csv] [-o output_name] [-l learner] [-n nForests]"
    exit 1
fi

if [ -z "$column" ]; then
    echo "Error: Column name is required. Use -c to specify the column name."
    echo "Usage: $0 -f filename.csv -c column_name [-t test_filename.csv] [-o output_name] [-l learner] [-n nForests]"
    exit 1
fi

# Validate learner
if [ "$learner" != "RANDOM_FOREST" ] && [ "$learner" != "GRADIENT_BOOSTED_TREES" ]; then
    echo "Learner must be either RANDOM_FOREST or GRADIENT_BOOSTED_TREES"
    exit 1
fi

echo "Script parameters:"
echo "Training file: $filename"
echo "Column: $column"
echo "Test file: ${test_filename:-N/A}"
echo "Output: $output"
echo "Learner: $learner"
echo "Number of Forests: $nForests"

# Check if yggdrasil-linux-cli directory exists
if [ ! -d "yggdrasil-linux-cli" ]; then
    echo "yggdrasil-linux-cli directory does not exist, downloading now..."
    wget https://github.com/google/yggdrasil-decision-forests/releases/download/1.0.0/cli_linux.zip
    unzip cli_linux.zip -d yggdrasil-linux-cli
fi

echo "Creating dataspec..."

# Create the dataspec
./yggdrasil-linux-cli/infer_dataspec --dataset=csv:$filename --output=dataspec.pbtxt

# Display the dataspec
./yggdrasil-linux-cli/show_dataspec --dataspec=dataspec.pbtxt

echo "Training model..."

# Train the model
./yggdrasil-linux-cli/train ... --output=model

# Remove the meta-data from the model (makes the model smaller)
./yggdrasil-linux-cli/edit_model --input=model --output=model_pure --pure_serving=true

echo "Creating training configuration file..."

# Create a training configuration file
cat <<EOF > train_config.pbtxt
task: CLASSIFICATION
label: "$column"
learner: "$learner"
EOF

# Add learner-specific hyperparameters
if [ "$learner" == "GRADIENT_BOOSTED_TREES" ]; then
cat <<EOF >> train_config.pbtxt
# Change learner-specific hyperparameters.
[yggdrasil_decision_forests.model.gradient_boosted_trees.proto.gradient_boosted_trees_config] {
  num_trees: $nForests
}
EOF
else
cat <<EOF >> train_config.pbtxt
# Change learner-specific hyperparameters.
[yggdrasil_decision_forests.model.random_forest.proto.random_forest_config] {
  num_trees: $nForests
}
EOF
fi

# Train the model
./yggdrasil-linux-cli/train \
  --dataset=csv:$filename \
  --dataspec=dataspec.pbtxt \
  --config=train_config.pbtxt \
  --output=model

# Show information about the model.
./yggdrasil-linux-cli/show_model --model=model

# Check if a test dataset filename is provided and the file exists
if [ -n "$test_filename" ] && [ -f "$test_filename" ]; then
  echo "Evaluating model on test dataset..."
  # Evaluate the model and print the result in the console.
  ./yggdrasil-linux-cli/evaluate --dataset=csv:$test_filename --model=model
fi

echo "Zipping the model..."

# Zip the model.
zip -j $output model_pure/*

echo "Done. Model saved as $output."
