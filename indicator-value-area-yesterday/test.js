var candles = require('candles-sample-aapl').loadNMinuteCandles(15).slice(-1000);
//in this example we use 1-min candles [{date, open, high, low, close, bid, ask, volume}, ...]
//where "date" is an iso string date [important to determine which candles where "yesterday"!]

var vah = require('./index.js');

var valueAreaPercentile = 0.7; //percent of volume to capture in value area. default 0.7
var nBarsVolumeProfile = 20; //number of bars to put in volume profile while calculating VA. default 20.
var doCache = false; //default false. if true, cache the value area calculations, per-day
var doCalcFirstHourCandle = true; //slow!

//this function will add the fields estDate, prevDate, vahYest, valYest, highYest, lowYest to each candle
var alteredCandles = vah.addYesterdayValueArea(candles, valueAreaPercentile, nBarsVolumeProfile, doCache, doCalcFirstHourCandle);

console.log(alteredCandles.slice(-1)[0])

//more functions:

//generic value area function for any set of candles
//vah.getValueArea(candles, percentile = 0.7, numBarsVolumeProfile = 20) => { valueAreaHigh, valueAreaLow, candlesHigh, candlesLow, vpocPrice }

//create volume profile...
//vah.createVolumeProfile(candles, numBars = 20) => [{volume,priceRange: [priceLow, priceHigh]}]

//vah.clearCache() //clears the cache
//vah.getEstDate(isoString) //convert iso string to EST date M/D/YYYY

//example of bad data:
// console.log(alteredCandles.slice(0,10));

// [
//   {
//     date: '2022-11-18T18:34:09.263Z',
//     open: 151.0699,
//     high: 151.0699,
//     low: 151.0699,
//     close: 151.0699,
//     bid: 151.06,
//     ask: 151.07,
//     volume: 73457,
//     estDate: '11/18/2022',
//     prevDate: null,
//     vahYest: NaN, //notice that candles that dont have a "prevDate" before them, get NaNs and Infinities
//     valYest: NaN,
//     highYest: -Infinity,
//     lowYest: Infinity,
//     vpocPrice: NaN
//   },

//example of good data:
// console.log(alteredCandles.slice(390));

//with 1 more day of data [390 candles], we can calculate the indicator properly...

// [
//   {
//     date: '2022-11-21T18:34:38.429Z',
//     open: 148.5899,
//     high: 148.5899,
//     low: 148.5899,
//     close: 148.5899,
//     bid: 148.57,
//     ask: 148.58,
//     volume: 52336,
//     estDate: '11/21/2022',
//     prevDate: '11/18/2022',
//     vahYest: 151.4652,
//     valYest: 150.81,
//     highYest: 151.85,
//     lowYest: 141.58875
//   }, ...]
