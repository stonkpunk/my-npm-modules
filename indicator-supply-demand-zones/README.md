# indicator-supply-demand-zones

Supply/Demand zones indicator, based on the [TradingView indicator by frozon](https://www.tradingview.com/script/V5WpHJdy-Supply-Demand/)

This is almost a direct JS port of the TradingView code, but with the added modification that the rectangles are extended to the right until they "hit the price" [or, extends off to the right another 100 periods]. By default we have also changed the 5-period buffer on the left, to zero.

## Installation

```sh
npm i indicator-supply-demand-zones
```

## Usage 

Minimal test:

```javascript
let candles = generateFakeCandles(1000); //[{high, low}, ... ]

// Settings for finding pivot highs and lows
let timePadding = 0;
let pivotHighSettings = { leftLen: 2, rightLen: 1 };
let pivotLowSettings = { leftLen: 2, rightLen: 1 };

// Use the function
let zones = require('indicator-supply-demand-zones').supplyAndDemand(candles, pivotHighSettings, pivotLowSettings, timePadding);

// Log the results
console.log("Demand Zones:", zones.demandZones);
console.log("Supply Zones:", zones.supplyZones);

// Demand Zones: [
//   {
//     left: 86, //units = candle index
//     top: 0.7282760110660691, //units = price
//     right: 101,
//     bottom: -0.326668655917951
//   },
//   {
//     left: 136,
//     top: 0.04575073534033857,
//     right: 151,
//     bottom: -0.3950954198293477
//   },
//   ...
// ]
// Supply Zones: [
//   {
//     left: 14,
//     top: 77.21751270416024,
//     right: 29,
//     bottom: 81.17430799649048
//   },
//   {
//     left: 410,
//     top: 1.792492492359312,
//     right: 425,
//     bottom: 2.7756838024305597
//   }
// ]
```

Example with chart: 

```javascript
var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');
var candles = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json').slice(128);
//candles format [{open, high, low, close, volume}]

var sdData = require('indicator-supply-demand-zones').supplyAndDemand(candles);

var RECTS = []; //{minPrice,maxPrice,startIndex,endIndex,color,filled,thickness}

sdData.demandZones.map(function(dz){
    RECTS.push({
        minPrice: dz.bottom,
        maxPrice: dz.top,
        startIndex: dz.left,
        endIndex: dz.right,
        color: [0,255,0],
        filled: false,
        thickness:1
    });
});

sdData.supplyZones.map(function(sz){
    RECTS.push({
        minPrice: sz.bottom,
        maxPrice: sz.top,
        startIndex: sz.left,
        endIndex: sz.right,
        color: [255,0,0],
        filled: false,
        thickness:1
    });
});

var config = {
    w: Math.floor(1024/2),
    h: Math.floor(700/2),
    profileBucketsTotal: 64,
    profileBucketsWidth: 16,
    volumeBarsHeight: 64,
    bgColor: [255,255,255],

    rects: RECTS,

    kdePrices: candles.map(c=>[c.low, 1]), //[value, weight]
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

Result

![chart](https://i.imgur.com/l9QrmAl.png)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



