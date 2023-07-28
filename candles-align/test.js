var {alignCandlesFlat, alignCandlesObjsTime, alignCandlesObjsDate, alignCandlesMultiDate, alignCandlesMultiTime} = require('./index.js');

var candlesA = [
  { date: "2023-05-28T09:58:00.000Z", open: 10, high: 12, low: 9, close: 11, volume: 100 },
  { date: "2023-05-28T10:01:00.000Z", open: 11, high: 13, low: 10, close: 12, volume: 150 },
  { date: "2023-05-28T10:03:00.000Z", open: 12, high: 14, low: 11, close: 13, volume: 120 },
  { date: "2023-05-28T10:08:00.000Z", open: 13, high: 15, low: 12, close: 14, volume: 180 },
  { date: "2023-05-28T10:14:00.000Z", open: 14, high: 16, low: 13, close: 15, volume: 200 },
];

var candlesB = [
  { date: "2023-05-28T10:01:00.000Z", open: 11, high: 13, low: 10, close: 12, volume: 150 },
  { date: "2023-05-28T10:03:00.000Z", open: 12, high: 14, low: 11, close: 13, volume: 120 },
  { date: "2023-05-28T10:08:00.000Z", open: 13, high: 15, low: 12, close: 14, volume: 180 },
  { date: "2023-05-28T10:14:00.000Z", open: 14, high: 16, low: 13, close: 15, volume: 200 },
  { date: "2023-05-28T10:17:00.000Z", open: 15, high: 17, low: 14, close: 16, volume: 140 }
];

//alignCandlesObjsDate(candlesA, candlesB, roundToMinute = true)
var doRoundToMinute = true;
var candlesAligned = alignCandlesObjsDate(candlesA, candlesB, doRoundToMinute);

console.log(candlesAligned);

// {
//   alignedCandles: { //2 arrays of candles where a[i] is parallel with b[i]
//     a: [ [Object], [Object], [Object], [Object] ],
//     b: [ [Object], [Object], [Object], [Object] ]
//   },
//   alignedCandlePairs: [ //"collated" version
//     [ [Object], [Object] ],
//     [ [Object], [Object] ],
//     [ [Object], [Object] ],
//     [ [Object], [Object] ]
//   ]
// }

//alignCandlesObjsTime has same inputs but expects candles like this
// { time: 1622217720, open: 11, high: 13, low: 10, close: 12, volume: 150 }

//alignCandlesFlat same but expects each candle to be a flat array like this
// [1622217720, open, high, low, close, volume ],
var alignedMulti = alignCandlesMultiDate({AAPL: candlesA, TSLA: candlesA});
console.log(  alignedMulti);//, alignedMulti.alignedCandles.AAPL[2].date, alignedMulti.alignedCandles.TSLA[2].date);
// {
//   validDates: [
//     '2023-05-28T09:58:00.000Z',
//     '2023-05-28T10:01:00.000Z',
//     '2023-05-28T10:03:00.000Z',
//     '2023-05-28T10:08:00.000Z',
//     '2023-05-28T10:14:00.000Z'
//   ],
//       alignedCandles: {
//         AAPL: [ [Object], [Object], [Object], [Object], [Object] ],
//         TSLA: [ [Object], [Object], [Object], [Object], [Object] ]
//       }
// }


//alignCandlesMultiTime
