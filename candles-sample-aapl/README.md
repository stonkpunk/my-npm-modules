# candles-sample-aapl

Small dataset of historic candles for testing. 

Contains 16,428 ~1-minute OHLCV candles for AAPL from late 2022. 

[note -- the 1-minute O/H/L values can be based on the overall market day, or just copies of the close [last] values minute-by-minute. this dataset does not contain sub-minute O/H/L's. see `floodClosePrice` below]

Also includes minute-by-minute bid/ask prices. 

Data may have errors, use at your own risk. 

## Installation

```sh
npm i candles-sample-aapl
```

## Usage 

```javascript
var floodClosePrice = true; //default true, if true, open high low close are all the same, close values minute-by-minute 
                            //otherwise, the open high low values are for the DAY not minute-by-minute 
var aaplMinSample = require('candles-sample-aapl').loadMinutes(floodClosePrice);
//return objs like [{date, open, high, low, close, bid, ask, volume}, ...]

var aapl15MinSample = require('candles-sample-aapl').loadNMinuteCandles(15);

console.log(aaplMinSample);

//1 min candles, note how ohlc prices are the same
// [
//   {
//     date: '2022-09-21T13:30:56.332Z',
//     open: 157.85,
//     high: 157.85,
//     low: 157.85,
//     close: 157.85,
//     bid: 157.86,
//     ask: 157.87,
//     volume: 286213
//   },

console.log(aapl15MinSample);

//15 min candles, from merged 1min candles 
// [
//   {
//     date: '2022-09-21T13:30:00.000Z',
//     open: 157.85,
//     high: 158.23,
//     low: 156.9601,
//     close: 156.9601,
//     bid: 157.86,
//     ask: 157.87,
//     volume: 2851173,
//     nSrcCandles: 15
//   }, ... ]
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



