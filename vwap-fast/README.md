# vwap-fast

Quickly calculate moving volume-weighted average prices [aka VWAP or MVWAP] from a stream of OHLCV candles. Uses [prefix sums](https://en.wikipedia.org/wiki/Prefix_sum) in static "rolling" arrays for efficiency.

I haven't tested this much so use at your own risk.

## Installation

```sh
npm i vwap-fast
```

## Usage 

```javascript
//example candle -- can use {o h l c v} or {open high low close volume} 
// var candle = {
//     o: 1,
//     h: 1,
//     l: 1,
//     c: 1,
//     v: 1000
// };

var Vwap = require('vwap-fast');
var maximumPeriods = 20000; //default 20000
var vwap = new Vwap(maximumPeriods); //note - 'new' keyword is optional, works either way

//first we generate 1,000,000 candles
for(var i=0;i<1000000;i++){
    var candle = vwap.generateFakeCandle(); //generate random candle around price $150 {o h l c v}
    //submitCandle(candle, useTypicalPrice=true, doAutoShift=true) 
    // -- typical price is (l+h+c)/3 -- otherwise use closing price
    // -- doAutoShift resets the zero-th prefix sum to zero every 
    // time the array "rolls over" to increase numeric stability 
    // [for very large runs where the prefix sums may overflow or lose precision]
    vwap.submitCandle(candle);
}

//or submit bulk with vwap.submitCandles(candles)

//get mvwap for 1000 periods
var vwap1k = vwap.getVwap(1000) //getVwap(nPeriods >= 1)

//see also getVwapNPeriodsAgo(nPeriodsInVwap, nPeriodsAgo) 
//see also lastPriceIsBelowVwaps(listOfPeriods) ==> true if most recent price below all vwap periods in input 
//see also submitAndTestCandles = function(_candles, listOfPeriods, useTypicalPrice=true, doAutoShift=true){
// _this.submitCandles(_candles, useTypicalPrice, doAutoShift);
// return lastPriceIsBelowVwaps(listOfPeriods);
// }

console.log(vwap1k);
//150.01489792240628

//more fields:
//vwap.totalCandles //total number of candles ever submitted to this vwap [including any that have been purged etc]
//vwap.prefixSums_PriceTimesVolume //rolling array of prefix sums for price x volume
//vwap.prefixSums_Volume //rolling array of prefix sums for volume
//vwap.currentArrayIndex //current index for "rolling" arrays. loops from 0...maximumPeriods
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



