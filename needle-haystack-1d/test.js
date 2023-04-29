var {getNeedleScaleShift, getMSE, getNeedleHaystackData} = require('./index.js');

var needle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var haystack = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0,0,0,0,0,0,0,0,0,0,0];

haystack = haystack.map(f=>f*10+5); //scale+shift the haystack

var doRemoveOverlaps = true;
var res = getNeedleHaystackData(needle, haystack, doRemoveOverlaps);
console.log(res);

//doRemoveOverlaps=true
// {
//     indicesWithCorrelations: [
//         [ 21, 2.251800553427485 ],
//         [ 10, -0.5281486364024173 ],
//         [ 31, -0.6447271508146415 ]
//     ]
// }

//doRemoveOverlaps=false
// {
//     indicesWithCorrelations: [  // [hitIndex, normalized correlation] sorted by correlation
//         [ 21, 2.251800553427485 ],
//         [ 20, 2.2069626632689396 ],
//         [ 22, 2.1621247731103908 ],
//         ...
// }

//note - correlations are normalized by npm `ndarray-normalize` to have mean zero and std 1

//extract the top "hit" from the haystack
var futurePeriods = 0;
var [topHitIndex, topCorrelation] = res.indicesWithCorrelations[0];
var shifted = getNeedleScaleShift(needle, haystack, topHitIndex, futurePeriods);
console.log(shifted);

// {
//     slope: 10,
//     yIntercept: -5,
//     extractedHaystackSection: [
//          5, 15, 25, 35, 45,
//          55, 65, 75, 85, 95
//     ],
//     extractedHaystackSectionRescaled: [
//         1, 2, 3, 4,  5,
//         6, 7, 8, 9, 10
//     ]
// }

//now we get the mean squared error [MSE] between
// the original needle and the extracted, scaled+shifted needle
var mse = getMSE(needle, shifted.extractedHaystackSectionRescaled);
console.log({mse})

// { mse: 0 }


//double check -- confirm that npm phase-align gives same answer for top result [21]
// const ndarray = require('ndarray');
// const needleND = ndarray(needle, [needle.length]);
// const haystackND = ndarray(haystack, [haystack.length]);
// var position = require("phase-align")(needleND, haystackND)
// console.log(position) //[21]


