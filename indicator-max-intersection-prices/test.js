var candlesFull = require('jsonfile-compressed-brotli').readFileSync('./AAPL.json');
// candlesFull=candlesFull.slice(-100);

//candles format
// [
//     {
//         close: 144.889892578125,
//         open: 144.99000549316406,
//         high: 145.1300048828125,
//         low: 144.86000061035156,
//         volume: 185934,
//     }, ...
// ]

var isVolWeighted = true;
var maxLines = require('./index.js').maxIntersectionLines(candlesFull, isVolWeighted).slice(0,15);
//maxIntersectionLines(candles, isVolumeWeighted=false, priceStep=0.01, priceDigits=2)

// [
//   { price: 145.46, ints: 59 },
//   { price: 146.18, ints: 48 },
//   { price: 144.99, ints: 39 },
//   { price: 146.82, ints: 34 },
//   { price: 145.86, ints: 33 }
// ]

var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');
var config = {
    lines:
    maxLines.map(function(row,i){
        var thickness = Math.floor(( row.ints)/(isVolWeighted?1000000:20)); //thickness proportional to number of intersections
        // var thickness = 0;
        return {startPrice: row.price, endPrice: row.price, startIndex:1, endIndex: 1000, color: [0,0,255], thickness:thickness}
    }),
    w: 512,
    h: 350,
    profileBucketsWidth: 0,
    volumeBarsHeight: 16,
    bgColor: [255,255,255],
    title: "AAPL",
    filename: `./candlestick-chart-top15B.png`,
}

saveChartForCandles(candlesFull, config);
