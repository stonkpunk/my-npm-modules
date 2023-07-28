var hl = require('./index.js');
var prices = [0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,4,4,3,2,1,0,1,2,3,4,5]

var windowSize = 5;
var doFilterRuns = true; //remove runs -- keep the highest highs and lowest lows in each run

//highsAndLows(values, numRowsToLook = 30, doFilterRuns= true, doEnhance=false, candleMode=false)
var doEnhance = true; //if true, add extra value at the end indicating "higher/lower/equal high", etc
var candleMode = false; //if true, assume it's a list of ohlcv candles like [{open high low close volume},...] and use the high/low values for the high/low calculations
var res = hl.highsAndLows(prices, windowSize, doFilterRuns, doEnhance, candleMode);
console.log(res);

// [
//     [ 5, 'high', 'high' ],
//     [ 10, 'low', 'low' ],
//     [ 15, 'high', 'equal high' ],
//     [ 20, 'low', 'equal low' ],
//     [ 25, 'high', 'equal high' ]
// ]

var bidAskSpread = 0.01; //1% spread
var profits = hl.buySellProfitsForWindowSize(prices, windowSize, bidAskSpread);

console.log(profits);

// {
//     profit: 9.95,
//     maxMoney: 9.95,
//     minMoney: 0,
//     minMoneyAfterSell: 4.975,
//     riskReward: Infinity
// }
