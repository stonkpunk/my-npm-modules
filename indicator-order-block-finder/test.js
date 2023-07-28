//first get some sample candles...

var candles = require('candles-sample-aapl').loadNMinuteCandles(30).slice(100,285);

//candles format [{open high low close volume}]

//now apply recent order blocks indicator

candles = require('./index.js').applyRecentOrderBlocks(candles);
//applyRecentOrderBlocks(candles, periods=5, threshold=0.0, usewicks=false)

//each candle now may have fields .mostRecentBullBlock + .mostRecentBearBlock [unless none exist yet]
//format:
//     mostRecentBearBlock: {
//       candleStart: candle, //candle at start of block
//       indexStart: 169, //index of starting candle in the array
//       avg: 145.5025,
//       high: 145.79,
//       low: 145.215
//     }

var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');

candles = candles.map(function(candle,index){
    //add shifted signal to the graph as an indicator

    candle.indicators = {};
    if(candle.mostRecentBullBlock){
        candle.indicators = {
            ...candle.indicators,
            "BULL_LINE_LOW": candle.mostRecentBullBlock.low,
            "BULL_LINE_LOW_color": [128,128,255],
            "BULL_LINE_LOW_thickness": 0,
            "BULL_LINE_AVG": candle.mostRecentBullBlock.avg,
            "BULL_LINE_AVG_color": [0,0,255],
            "BULL_LINE_AVG_thickness": 0,
            "BULL_LINE_HIGH": candle.mostRecentBullBlock.high,
            "BULL_LINE_HIGH_color": [128,128,255],
            "BULL_LINE_HIGH_thickness": 0
        }
    }
    if(candle.mostRecentBearBlock){
        candle.indicators = {
            ...candle.indicators,
            "BEAR_LINE_LOW": candle.mostRecentBearBlock.low,
            "BEAR_LINE_LOW_color": [255,128,128],
            "BEAR_LINE_LOW_thickness": 0,
            "BEAR_LINE_AVG": candle.mostRecentBearBlock.avg,
            "BEAR_LINE_AVG_color": [255,0,0],
            "BEAR_LINE_AVG_thickness": 0,
            "BEAR_LINE_HIGH": candle.mostRecentBearBlock.high,
            "BEAR_LINE_HIGH_color": [255,128,128],
            "BEAR_LINE_HIGH_thickness": 0
        }
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

