var candles = require('candles-sample-aapl').loadNMinuteCandles(60).slice(50);

var mzRvsi = require('./index.js').calculateRVSI(candles);

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

