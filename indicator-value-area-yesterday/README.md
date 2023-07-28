# indicator-value-area-yesterday

Get the value area low/high/VPOC for a set of OHLCV candles. 

Given a set of candles with iso-string `date` fields, get yesterday's VAH/VAL/VPOC tacked onto today's candles.

Experimental, use at your own risk. 

## Installation

```sh
npm i indicator-value-area-yesterday
```

## Usage 

```javascript
var candles = require('candles-sample-aapl').loadMinutes(true).slice(-1000);
//in this example we use 1-min candles [{date, open, high, low, close, bid, ask, volume}, ...]
//where "date" is an iso string date [important to determine which candles where "yesterday"!]

var vah = require('indicator-value-area-yesterday');

var valueAreaPercentile = 0.7; //percent of volume to capture in value area. default 0.7
var nBarsVolumeProfile = 20; //number of bars to put in volume profile while calculating VA. default 20.
var doCache = false; //default false. if true, cache the value area calculations, per-day

//this function will add the fields estDate, prevDate, vahYest, valYest, highYest, lowYest to each candle
var alteredCandles = vah.addYesterdayValueArea(candles, valueAreaPercentile, nBarsVolumeProfile, doCache /* , doCalcFirstHourCandle=false */);

//doCalcFirstHourCandle = true to calculate "80%" rule metric [see below]

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

//see also extra data about demarks indicators, supports, pivots [see test-graph.js]
// var pivot = candle.pivotData.basic.pivot;
// var r1 = candle.pivotData.basic.resistance1;
// var s1 = candle.pivotData.basic.support1;
// var r2 = candle.pivotData.basic.resistance2;
// var s2 = candle.pivotData.basic.support2;
//
//DeMark's projections: 
// var demarkHigh = candle.pivotData.deMarks.today.high;
// var demarkLow = candle.pivotData.deMarks.today.low;

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
//     //if doCalcFirstHourCandle = true... 
//     //eightyPercentRuleUp: openedUnderValueAreaLowToday && gotIntoValueAreaWithin1Hour
//     //eightyPercentRuleDown: openedOverValueAreaHighToday && gotIntoValueAreaWithin1Hour
//   }, ...]
```

Chart with VAH/VAL/VPOC as blue/red/black lines on top of some AAPL 15-min candles. Notice the discontinuities at the daily boundaries. 

![graph](https://i.imgur.com/zJNIkum.png)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



