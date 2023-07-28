var {
    convertToNMinuteIntervalsFromDate,
    convertToNMinuteIntervalsFromTime,
    convertToNPeriodIntervals} = require('./index.js');

var timeRoundingFunction = Math.round; //round to nearest time boundary. 11:59 merges into candle for 12:00. makes for a cleaner example here.
// var timeRoundingFunction = Math.floor; //default -- round down. 11:59 merges into candle for 11:00 [assuming 1hr interval]

//candles with time in unix epoch seconds, and an arbitrary extra field "some_extraParam"
const candlesWithTime = [
  { time: 1685267880, open: 10, high: 12, low: 9,  close: 11, volume: 100, some_extraParam: 1},
  { time: 1685268060, open: 11, high: 13, low: 10, close: 12, volume: 150, some_extraParam: 2},
  { time: 1685268180, open: 12, high: 14, low: 11, close: 13, volume: 120, some_extraParam: 3},
  { time: 1685268480, open: 13, high: 15, low: 12, close: 14, volume: 180, some_extraParam: 4},
  { time: 1685268840, open: 14, high: 16, low: 13, close: 15, volume: 200, some_extraParam: 5},
  { time: 1685269020, open: 15, high: 17, low: 14, close: 16, volume: 140, some_extraParam: 6}
];

const convertedCandles = convertToNMinuteIntervalsFromTime(candlesWithTime, 15, timeRoundingFunction);
console.log(convertedCandles);

//notice how any 'extra params' are absorbed into the result form the first candle in each merged set
// [
//   { "time": 1685268000, "open": 10, "high": 14, "low": 9, "close": 13, "volume": 370, "nSrcCandles": 3, "some_extraParam": 1 },
//   { "time": 1685268900, "open": 13, "high": 17, "low": 12, "close": 16, "volume": 520, "nSrcCandles": 3, "some_extraParam": 4 }
// ]

//candles with date as iso string
const candlesWithDateStrings = [
  { date: "2023-05-28T09:58:00.000Z", open: 10, high: 12, low: 9, close: 11, volume: 100 },
  { date: "2023-05-28T10:01:00.000Z", open: 11, high: 13, low: 10, close: 12, volume: 150 },
  { date: "2023-05-28T10:03:00.000Z", open: 12, high: 14, low: 11, close: 13, volume: 120 },
  { date: "2023-05-28T10:08:00.000Z", open: 13, high: 15, low: 12, close: 14, volume: 180 },
  { date: "2023-05-28T10:14:00.000Z", open: 14, high: 16, low: 13, close: 15, volume: 200 },
  { date: "2023-05-28T10:17:00.000Z", open: 15, high: 17, low: 14, close: 16, volume: 140 }
];

const convertedCandles2 = convertToNMinuteIntervalsFromDate(candlesWithDateStrings, 15, timeRoundingFunction);
console.log(convertedCandles2);

// [
//   { "date": "2023-05-28T10:00:00.000Z", "open": 10, "high": 14, "low": 9, "close": 13, "volume": 370, "nSrcCandles": 3 },
//   { "date": "2023-05-28T10:15:00.000Z", "open": 13, "high": 17, "low": 12, "close": 16, "volume": 520, "nSrcCandles": 3 }
// ]

//naively merge candles as chunks of length n
const convertedCandles3 = convertToNPeriodIntervals(candlesWithDateStrings, 3);
console.log(convertedCandles3);

// [
//   { "date": "2023-05-28T09:58:00.000Z", "open": 10, "high": 14, "low": 9, "close": 13, "volume": 370, "nSrcCandles": 3 },
//   { "date": "2023-05-28T10:08:00.000Z", "open": 13, "high": 17, "low": 12, "close": 16, "volume": 520, "nSrcCandles": 3 }
// ]

