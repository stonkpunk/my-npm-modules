var convertToNMinuteIntervals = require('stock-market-clock').convertToNMinuteIntervals;//(candles, n)

var candles = require('candles-sample-aapl').loadMinutes(true);//.slice(0,3000);
//in this example we use 1-min candles [{date, open, high, low, close, bid, ask, volume}, ...]
//where "date" is an iso string date [important to determine which candles where "yesterday"!]

var vah = require('./index.js');

var valueAreaPercentile = 0.7; //percent of volume to capture in value area. default 0.7
var nBarsVolumeProfile = 20; //number of bars to put in volume profile while calculating VA. default 20.
var doCache = false; //default false. if true, cache the value area calculations, per-day

candles = convertToNMinuteIntervals(candles, 15); //convert candles to 5-min intervals

//this function will add the fields estDate, prevDate, vahYest, valYest, highYest, lowYest to each candle
candles = vah.addYesterdayValueArea(candles, valueAreaPercentile, nBarsVolumeProfile, doCache);

candles = candles.slice(100,200); //take candles from the middle ...

var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');

candles = candles.map(function(candle,index){
    if(candle.prevDate && candle.pivotData){
        var vah = candle.vahYest;
        var val = candle.valYest;
        var vpoc = candle.vpocPrice;

        var pivot = candle.pivotData.basic.pivot;
        var r1 = candle.pivotData.basic.resistance1;
        var s1 = candle.pivotData.basic.support1;
        var r2 = candle.pivotData.basic.resistance2;
        var s2 = candle.pivotData.basic.support2;

        var demarkHigh = candle.pivotData.deMarks.today.high;
        var demarkLow = candle.pivotData.deMarks.today.low;

        candle.indicators = {

            // "p1": pivot,
            // "p1_color": [200,200,255],
            // "p1_thickness": 0,
            //
            // "r1": r1,
            // "r1_color": [200,200,255],
            // "r1_thickness": 0,
            //
            // "s1": s1,
            // "s1_color": [200,200,255],
            // "s1_thickness": 0,
            //
            // "r2": r2,
            // "r2_color": [200,200,255],
            // "r2_thickness": 0,
            //
            // "s2": s2,
            // "s2_color": [200,200,255],
            // "s2_thickness": 0,

            "DMH": demarkHigh,
            "DMH_color": [200,200,255],
            "DMH_thickness": 0,

            "DML": demarkLow,
            "DML_color": [200,200,255],
            "DML_thickness": 0,

            "VAH": vah,
            "VAH_color": [0,0,255],
            "VAH_thickness": 0,
            "VAL": val,
            "VAL_color": [255,0,0],
            "VAL_thickness": 0,
            "VPOC": vpoc,
            "VPOC_color": [0,0,0],
            "VPOC_thickness": 0,
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

