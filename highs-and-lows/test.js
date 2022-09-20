var hl = require('./index.js');
var prices = [0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,5]

var windowSize = 5;
var doFilterRuns = true; //remove runs -- keep the highest highs and lowest lows in each run

//highsAndLows(values, windowSize=5, doFilterRuns=true);
var res = hl.highsAndLows(prices, windowSize, doFilterRuns);
console.log(res);

// [
//     [ 5, 'high' ], //sell
//     [ 10, 'low' ], //buy
//     [ 15, 'high' ], //sell
//     [ 20, 'low' ], //sell
//     [ 25, 'high' ] //buy
// ]
