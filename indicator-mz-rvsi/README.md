# indicator-mz-rvsi

Simplified js port of MightyZinger's [MZ-RVSI](https://www.tradingview.com/script/75kQ1ySs-Relative-Volume-Strength-Index-MZ-RVSI/) TradingView indicator, using the OBV oscillator.

Does not yet include the other oscillators, nor the logic for colouring the result. 

I am not sure if the results are exactly equivalent to the original -- in particular we do not know how TradingView handles zero-padding necessary to calculate Hamming Moving Average.

In our function, you can optionally add zero-padding to the left side of all results so that the result is the same length as the number of candles input. 

Experimental, use at your own risk!

`calculateRVSI(candles, rvsiLen=14, doZeroPad = true)`

Algorithm rundown:

```
// Convert candles to Heikin Ashi
var heikinAshiCandles = toHeikinAshi(candles);

// hull moving average of on-balance volume
var volMA = hma(obv(heikinAshiCandles), rvsiLen);

// RSI of above
var rsiVol = rsi(volMA, rvsiLen);

// Calculate RVSI
var rvsi = hma(rsiVol, rvsiLen);
```

## Installation

```sh
npm i indicator-mz-rvsi
```

## Usage 

Example chart with `ohlc-chart-simple`

```javascript
var candles = require('candles-sample-aapl').loadNMinuteCandles(60).slice(50); 

var mzRvsi = require('indicator-mz-rvsi').calculateRVSI(candles);

console.log(mzRvsi);

//{
//    'rsiVol':            [...],
//    'rvsi':              [...],
//    'volMA':             [...],
//    'heikinAshiCandles': [...],
//    'zeroPaddingAmount': {rsiVol, rvsi, volMA} //amount of zero padding added to left of each array to make output same length as candles input
// }

//quickly chart the result by adding the indicator
// to the price of the first candle in the chart

var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');

candles = candles.map(function(candle,index){
    //add shifted signal to the graph as an indicator
    var signalS = candles[0].close + mzRvsi.rvsi[index]/50.0;
    candle.indicators = {
        "S_LINE": signalS,
        "S_LINE_color": [0,0,255],
        "S_LINE_thickness": 0
    }
    return candle;
});

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
    filename: "./candlestick-chart.png",
}

saveChartForCandles(candles, config);
```

Result. Note the zero-values on the left. 

![chart](https://i.imgur.com/JGqerDZ.png)


