var {drawChartForCandles,saveChartForCandles} = require('./index.js');
var t0 = Date.now();
var candles = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json').slice(1,1+64);
console.log('took',Date.now()-t0);
//format of candles [
// {
//     open: 1.0,
//     high: 1.0,
//     low: 1.0,
//     close: 1.0,
//     date: "anything"
// } ...
// ]




var moment = require('moment');
candles = candles.map(function(candle){

    //candle.date is arbitrary string used to label current date in upper right corner
    candle.date = moment.unix(candle.time).format("YYYY-MM-DD HH:mm");

    //setting candle.title overwrites the graph title. nice for animations.
    //candle.title = "hey";

    //additional lines for indicators can be added by adding .indicators["NAME"], .indicators["NAME_color"], .indicators["NAME_thickness"]
    //in this example we add a thick blue line for candle midPts, and a thin pink line of candle lows-0.1%
    candle.indicators = {
        midPt: (candle.low+candle.high)/2.0,
        midPt_color: [0,0,255], //fields ending with "_color" specific color [default red]
        midPt_thickness: 1, //fields ending with "_thickness" specific line 'radius' [default 2]

        "0.1% lower": candle.low*0.999,
        "0.1% lower_color": [255,0,255], //pink
        "0.1% lower_thickness": 0 //0 gives single-pixel line
    }
    return candle;
});

//config optional; default params shown
var config = {
    w: Math.floor(1024/4),
    h: Math.floor(700/4),
    profileBucketsTotal: 64,
    profileBucketsWidth: 16,
    volumeBarsHeight: 16,
    bgColor: [255,255,255],
    skipDrawOhlcBars: false,
    skipDrawIndicators: false,
    skipDrawLegend: false,
    expandLegendText: false,
    expandTitle: false,
    expandPrice: false,
    skipDrawDate: true,
    skipDrawPrice: false,
    skipDrawPriceBars: true,
    title: "AAPL",
    filename: "./candlestick-chart.png",
}

saveChartForCandles(candles, config);

//var canvas = drawChartForCandles(candles, config); //get pixel canvas with image data from require('pixel-draw')


