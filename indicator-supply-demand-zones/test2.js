var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');
var candles = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json').slice(128);
//candles format [{open, high, low, close, volume}]

var sdData = require('./index.js').supplyAndDemand(candles);

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

