var ydf = require('./index.js');

// using model.zip is identical to online example
// https://achoum.github.io/yggdrasil_decision_forests_js_example/example.html
// https://achoum.github.io/yggdrasil_decision_forests_js_example/model.zip

ydf.quickServer('./model', 1335, 1000);
ydf.loadModel("http://localhost:1335/model.zip", function(model, _ydf){

    var examples = {
        "age":[39,40,40,35],
        "workclass":["State-gov","Private","Private","Federal-gov"],
        "fnlwgt":[77516,121772,193524,76845],
        "education":["Bachelors","Assoc-voc","Doctorate","9th"],
        "education_num":["13","11","16","5"],
        "marital_status":["Never-married","Married-civ-spouse","Married-civ-spouse","Married-civ-spouse"],
        "occupation":["Adm-clerical","Craft-repair","Prof-specialty","Farming-fishing"],
        "relationship":["Not-in-family","Husband","Husband","Husband"],
        "race":["White","Asian-Pac-Islander","White","Black"],
        "sex":["Male","Male","Male","Male"],
        "capital_gain":[2174,0,0,0],
        "capital_loss":[0,0,0,0],
        "hours_per_week":[40,40,60,40],
        "native_country":["United-States","","United-States","United-States"]
    }  ;

    let predictions = model.predict(examples);

    console.log("predictions",predictions);

    // predictions [
    //     0.012130673043429852,
    //         0.3310021460056305,
    //         0.7801117300987244,
    //         0.11152036488056183
    //     ]

    console.log("input features", model.getInputFeatures())

    // input features [
    //     { name: 'age', type: 'NUMERICAL', internalIdx: 0 },
    //         { name: 'workclass', type: 'CATEGORICAL', internalIdx: 1 },
    //         { name: 'fnlwgt', type: 'NUMERICAL', internalIdx: 2 },
    //         { name: 'education', type: 'CATEGORICAL', internalIdx: 3 },
    //         { name: 'education_num', type: 'CATEGORICAL', internalIdx: 4 },
    //         { name: 'marital_status', type: 'CATEGORICAL', internalIdx: 5 },
    //         { name: 'occupation', type: 'CATEGORICAL', internalIdx: 6 },
    //         { name: 'relationship', type: 'CATEGORICAL', internalIdx: 7 },
    //         { name: 'race', type: 'CATEGORICAL', internalIdx: 8 },
    //         { name: 'sex', type: 'CATEGORICAL', internalIdx: 9 },
    //         { name: 'capital_gain', type: 'NUMERICAL', internalIdx: 10 },
    //         { name: 'capital_loss', type: 'NUMERICAL', internalIdx: 11 },
    //         { name: 'hours_per_week', type: 'NUMERICAL', internalIdx: 12 },
    //         { name: 'native_country', type: 'CATEGORICAL', internalIdx: 13 }
    //     ]

    // after we are done w the model...
    model.unload();
    model = null;
}/*, _existingYdf*/)