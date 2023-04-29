# needle-haystack-1d

fuzzy-matching between a 1-d "needle" time series and a "haystack" time series. find scaled+shifted copies of the "needle" within the "haystack".

similar to `phase-align` but with multiple fuzzy results [and limited to 1-d data].

## Installation

```sh
npm i needle-haystack-1d
```

## Usage 

```javascript
var {getNeedleScaleShift, getMSE, getNeedleHaystackData, removeOverlaps} = require('needle-haystack-1d');

var needle = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var haystack = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0,0,0,0,0,0,0,0,0,0,0];

haystack = haystack.map(f=>f*10+5); //scale+shift the haystack

var doRemoveOverlaps = false; //default false
var res = getNeedleHaystackData(needle, haystack, doRemoveOverlaps);
console.log(res);

//doRemoveOverlaps = false
// {
//     indicesWithCorrelations: [  // [hitIndex, normalized correlation] sorted by correlation
//         [ 21, 2.251800553427485 ],
//         [ 20, 2.2069626632689396 ],
//         [ 22, 2.1621247731103908 ],
//         ...
// }

//doRemoveOverlaps = true
// {
//     indicesWithCorrelations: [
//         [ 21, 2.251800553427485 ],
//         [ 10, -0.5281486364024173 ],
//         [ 31, -0.6447271508146415 ]
//     ]
// }

//note - correlations are normalized by npm `ndarray-normalize` to have mean zero and std 1 

//extract the top "hit" from the haystack
var futurePeriods = 0; //add extra 'future' periods to the results?
var [topHitIndex, topCorrelation] = res.indicesWithCorrelations[0];
var shifted = getNeedleScaleShift(needle, haystack, topHitIndex, futurePeriods);
console.log(shifted);

// {
//     slope: 10,
//     yIntercept: -5,
//     extractedHaystackSection: [ //original data from haystack
//          5, 15, 25, 35, 45,
//          55, 65, 75, 85, 95
//     ],
//     extractedHaystackSectionRescaled: [ //data scaled and shifted to resemble needle
//         1, 2, 3, 4,  5,
//         6, 7, 8, 9, 10
//     ]
// }

//now we get the mean squared error [MSE] between
// the original needle and the extracted, scaled+shifted needle
var mse = getMSE(needle, shifted.extractedHaystackSectionRescaled);
console.log({mse})

// { mse: 0 }

//remove overlaps in existing results: 
//var windowSize = needle.length;
//res = removeOverlaps(res, windowSize); 
```

## See Also

- [phase-align](https://www.npmjs.com/package/phase-align)
- [ndarray-convolve](https://www.npmjs.com/package/ndarray-convolve) - the `correlate` function does most of the work here for us


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



