//example candle
// var candle = {
//     o: 1,
//     h: 1,
//     l: 1,
//     c: 1,
//     v: 1000
// };

var Vwap = require('./index.js');
var maximumPeriods = 20000; //default 20000
var vwap = new Vwap(maximumPeriods); //note - 'new' keyword is optional, works either way

//first we generate 1,000,000 candles
for(var i=0;i<1000000;i++){
    var candle = vwap.generateFakeCandle(); //generate random candle around price $150
    vwap.submitCandle(candle); //submitCandle(candle, useTypicalPrice=true) //typical price is (l+h+c)/3 -- otherwise use closing price
}

//get mvwap for 1000 periods
var vwap1k = vwap.getVwap(1000) //getVwap(nPeriods >= 1)
console.log(vwap1k);
//150.01489792240628

//more fields:
//vwap.totalCandles //total number of candles ever submitted to this vwap [including any that have been purged etc]
//vwap.prefixSums_PriceTimesVolume //rolling array of prefix sums for price x volume
//vwap.prefixSums_Volume //rolling array of prefix sums for volume
//vwap.currentArrayIndex //current index for "rolling" arrays. loops from 0...maximumPeriods

