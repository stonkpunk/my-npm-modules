# highs-and-lows

Extract indices of high/low points in a 1D array with a moving window

Experimental, use at your own risk 

## Installation

```sh
npm i highs-and-lows
```

## Usage 

```javascript
var hl = require('highs-and-lows');
var prices = [0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,4,4,3,2,1,0,1,2,3,4,5]

var windowSize = 5;
var doFilterRuns = true; //remove runs -- keep the highest highs and lowest lows in each run

//highsAndLows(values, numRowsToLook = 30, doFilterRuns= true, doEnhance=false, candleMode=false)
var doEnhance = true; //if true, add extra value at the end indicating "higher/lower/equal high", etc
var candleMode = false; //if true, assume it's a list of ohlcv candles like [{open high low close volume},...] and use the high/low values for the high/low calculations
var res = hl.highsAndLows(prices, windowSize, doFilterRuns, doEnhance, candleMode);
console.log(res);

// format [ 
//    [ index, high|low, (higher|lower|equal)? high|low ], 
// ...]

//[
//  [ 5, 'high', 'high' ], //first high+low is not marked as lower/higher/equal
//  [ 10, 'low', 'low' ],
//  [ 14, 'high', 'lower high' ],
//  [ 20, 'low', 'equal low' ],
//  [ 25, 'high', 'higher high' ]
//]


var bidAskSpread = 0.01; //1% spread
var profits = hl.buySellProfitsForWindowSize(prices, windowSize, bidAskSpread);

console.log(profits);

// {
//     profit: 9.95,
//     maxMoney: 9.95,
//     minMoney: 0,
//     minMoneyAfterSell: 4.975,
//     riskReward: Infinity // rr = totalGains / totalLosses
// }

//get highs and lows for window size, then 
// [with "buys" at lows and "sells" at highs],
//  calculate "profit" for the given series of prices
//   -buys first low "for free" then sells first high
//   -always filters out runs  
//   -always starts with buy and ends with sell
//   -discards start/end indices otherwise
//   -bidAskSpread is expressed as fraction of price, 0...1 
//   -buys get prices increased by spread/2, sells get price decreased by spread/2
//.buySellProfitsForWindowSize(prices, windowSize, bidAskSpread=0)

//like above but takes raw list of buys/sells produced by buysAndSells function
//.buySellProfitsForIndices(buySellIndices,pricesList,bidAskSpread=0)

//get candle-by-candle "score" for if this candle is a local high or low [high/low oracle indicator for training etc], candle format [time, o, h, l, c, v]
//.calculateBuySellMaskOracleIndicator(candles, windowSize, doNormalize=true) //doNormalize reduces everything to 0...1 where 1 corresponds to windowSize
// // suppose the "buy" indices are [1,3] and the "sells" are [0,1]
// {
//     buyMask,  //[0,1,0,1,0]
//     sellMask, //[1,1,0,0,0]
//     buyMaskDistToNextOne, //[1,0,1,windowSize].map(r=>r/windowSize)
//     sellMaskDistToNextOne //[0,0,windowSize,windowSize,windowSize].map(r=>r/windowSize)
// }
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



