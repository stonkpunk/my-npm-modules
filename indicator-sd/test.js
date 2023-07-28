var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');
var candles = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json');
//candles format [{open, high, low, close, volume}]

var sdData = require('./index.js').indicator(candles);

// returns
// {
//     //indicator values for smart, dumb, pvi, nvi, ema(pvi), ema(nvi)...
//     smart: [],
//     dumb: [],
//     pvi: [],
//     nvi: [],
//     pviEMA: [],
//     nviEMA: [],
//     //ranges of indicator outputs
//     smartRange: [min, max],
//     dumbRange: [min, max]
// }

candles = candles.map(function(candle,index){
    //add scaled-shifted signal to the graph as an indicator
    var signalS = candles[0].close-1.0 + sdData.smart[index]/sdData.smartRange[1];
    var signalD = candles[0].close-1.0 + sdData.dumb[index]/sdData.smartRange[1];
    candle.indicators = {
        "S_LINE": signalS,
        "S_LINE_color": [0,0,255],
        "S_LINE_thickness": 0,
        "D_LINE": signalD,
        "D_LINE_color": [255,0,0],
        "D_LINE_thickness": 0,
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

