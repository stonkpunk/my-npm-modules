var candlesFull = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json');
candlesFull=candlesFull.slice(-100);

var {fitSlow/*,  fitFast*/, fitStochastic, fitStochastic2, encodeIntoNearestLevels, DEFAULT_FIB_LEVELS} = require('./index.js');

//fitFast is actually slow...

//fitSlow(prices, _fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1], minLengthStartToEnd = 10)
// ^^^ slow, brute force, find best range based on all prices in the list

//fitStochastic(prices, attempts = prices.length, _fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1])
// ^^^ stochastic, choose randomly x[attempts] times and take the best result

//both return objects of the same format:
// {
// start,           //price at the lowest fibonacci level
// end,             //price at the highest fibonacci level
// mse,             //mean squared error of price vs nearest fibonacci level
// fibonacciLevels, // the list of fibonacci levels that we input
// priceLevels      //the list of prices at each fibonacci level
// }

var prices = candlesFull.map(c=>c.close);


var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');

var iters=10;
var t0=Date.now();

var _fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
var minLen=10;

for(var i=0;i<iters;i++){
    var res = fitSlow(prices, _fibLevels, minLen)
}
console.log((Date.now()-t0)/iters, "per iter"); //3.5ms

var config = {
    lines:
        fitSlow(prices).priceLevels.map(function(price){
            return {startPrice: price, endPrice: price, startIndex:1, endIndex: 100, color: [0,0,255], thickness:0}
        }),
    w: 512,
    h: 350,
    profileBucketsWidth: 0,
    volumeBarsHeight: 16,
    bgColor: [255,255,255],
    title: "AAPL",
    filename: `./candlestick-chart.png`,
}

saveChartForCandles(candlesFull, config);

//test with longer dataset rather than just 100 elems...

var candlesFull2 = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json');
// candlesFull2=candlesFull2.slice(-100);
var prices2 = candlesFull2.map(c=>c.close);

console.log(encodeIntoNearestLevels(prices2, true, 50, 5));

//aacgdgggggfggfebcaaggggbcdcgggfeffeefggcdaacaeagagfggggfggfggfgfeeddbcecgggeceffggggfggeecagfbaafeaa

console.log(encodeIntoNearestLevels(prices2, false, 50, 5));
//
// var windowSize = 10; //default 10, try higher values
// var minFitWidthFib = 1; //default 1, faster but less reliable for higher values
// var doReturnString = true;
// console.log(encodeIntoNearestLevels(prices, doReturnString, windowSize, minFitWidthFib));
//
// //aacgdgggggfggfebcaaggggbcdcgggfeffeefggcdaacaeagagfggggfggfggfgfeeddbcecgggeceffggggfggeecagfbaafeaa
//
// doReturnString = false;
// console.log(encodeIntoNearestLevels(prices, doReturnString, windowSize, minFitWidthFib));


// [
//     0, 0, 2, 6, 3, 6, 6, 6, 6, 6, 5, 6,
//     6, 5, 4, 1, 2, 0, 0, 6, 6, 6, 6, 1, ...