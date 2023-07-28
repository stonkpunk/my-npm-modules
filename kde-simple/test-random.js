//extract random number using the KDE as a probability distribution -- using rejection sampling

var generateRandomFromKDE = require('./index.js').generateRandomFromKDE
var calculateBandwidth_silverman = require('./index.js').calculateBandwidth_silverman
var getPeakValue = require('./index.js').getPeakValue

var samplesForKDE = [];

for(var i=0;i<1000;i++){
    samplesForKDE.push(
         {weight: 1, x:Math.random()/1}
    );
}

var results = []

var sigma = calculateBandwidth_silverman(samplesForKDE) / 2.0;
for(var i=0;i<1000;i++){
    results.push(generateRandomFromKDE(samplesForKDE,sigma));
}


console.log(require('histogram-simple')(results, 20).toString(80),sigma);

console.log(getPeakValue(samplesForKDE, sigma));

// 0.8000: ##
// 0.8400: #####
// 0.8800: ########
// 0.9200: ###########
// 0.9600: ############
// 1.0000: ############
// 1.0400: ###########
// 1.0800: ########
// 1.1200: #####
// 1.1600: ##
