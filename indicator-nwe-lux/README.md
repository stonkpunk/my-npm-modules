# indicator-nwe-lux

Nadaraya–Watson envelope derived from [the indicator from LuxAlgo](https://www.tradingview.com/script/Iko0E2kL-Nadaraya-Watson-Envelope-LuxAlgo/) with some changes

This version has a 'slow' calculation [which is slow] which is equivalent to running the 'fast' calculation once for every candle in the input [but it only uses prior-data per-candle]. The 'fast' version calculates the value for `lookBackLen` candles [fast] but 'historic values' change with new data and so the values derived from the fast version may not be appropriate for backtests. They also look a bit different.

Experimental, different than the original, use at your own risk

CC-SA-NC license as per [the original](https://www.tradingview.com/script/Iko0E2kL-Nadaraya-Watson-Envelope-LuxAlgo/). note this module is not supported by/affiliated with LuxAlgo.  

## Installation

```sh
npm i indicator-nwe-lux
```

## Usage 

```javascript
var candles = require('candles-sample-aapl').loadNMinuteCandles(5).slice(-1500);//.slice(50);
var {computeForSingleCandle, computeForAllCandlesFast, computeForAllCandlesSlow} = require('./index.js');

// var h = 14; //orig 8
// var mult = 3; //orig 3
// var lookBackLen = 499;
// var doLog = true; //log iteration count as it runs
// computeForAllCandlesSlow(candles, lookBackLen, h, mult, doLog) //all candles affected - in-place! only uses back-data -- very slow!

//or, if you only care about the last candle ...
// var lastCandleIndex = candles.length-1;
// computeForSingleCandle(candles, lastCandleIndex,  499, h, mult);
// console.log(candles[candles.length-1]);

var h = 14; //orig 8
var mult = 3; //orig 3
var lookBackLen = 499;
//much faster; smoother curve; but 'history may change' with new data. not good for backtesting
candles = computeForAllCandlesFast(candles,  lookBackLen, h, mult); //note -- only the last 499 (lookBackLen) candles are affected

// candles now each have fields {NWEtop:price, NWEbottom:price, buy:bool, sell:bool}
// "buy"/"sell" bools set if price cross below/above curve

var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');

candles = candles.map(function(candle,index){
    //add shifted signal to the graph as an indicator
    var signalS = candle.NWEbottom;
    var signalT = candle.NWEtop;
    candle.indicators = {
        "T_LINE": signalT,
        "S_LINE": signalS,
        "S_LINE_color": [0,0,0],
        "S_LINE_thickness": 0,
        "T_LINE_color": [0,0,0],
        "T_LINE_thickness": 0
    }
    return candle;
}).slice(-500);

var config = {
    w: Math.floor(1024/2),
    h: Math.floor(700/2),
    profileBucketsTotal: 64,
    profileBucketsWidth: 16,
    volumeBarsHeight: 64,
    bgColor: [255,255,255],

    //alternative to volume profile: arbitrary kernel density histogram
    kdePrices: candles.map(c=>[c.low, 1]), //[value, weight]
    // kdeBandwidthDollars: 0.01,
    kdeBandwidthPercent: 1.00,
    kdeIsGaussian: true, //false == kernel is triangular
    kdeColor: [0,0,255],

    skipDrawOhlcBars: false,
    skipDrawIndicators: false,
    skipDrawLegend: false,
    expandLegendText: false,
    expandTitle: false,
    expandPrice: false,
    skipDrawDate: true,
    skipDrawPrice: false,
    skipDrawPriceBars: false,
    title: "AAPL",
    filename: "./candlestick-chart-fast.png",
}

saveChartForCandles(candles, config);
```

![slow](https://i.imgur.com/hrx9wVs.png)

fast version ^


![fast](https://i.imgur.com/IWUkcC2.png)

slow version ^



