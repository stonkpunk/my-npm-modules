# ohlc-candles-rolling

constant-memory rolling data structure for OHLCV candles

## Installation

```sh
npm i ohlc-candles-rolling
```

## Usage 

```javascript
var MAX_PERIODS = 20000; //maximum number of candles to track. 20000 by default.
//note -- requests for candles older than MAX_PERIODS periods will "roll over" to the beginning!

//create a new tracker
var CandlesTracker = require('ohlc-candles-rolling');
var myCandlesTracker = new CandlesTracker(MAX_PERIODS);

//candle data
var c = {
    o: 1.0,
    h: 2.0,
    l: 0.5,
    c: 2.0,
    v: 2000
}

//submitCandle(o,h,l,c,v,bid,ask,timeDeltaInt,timeStampInt64) -- everything defaults to zero
myCandlesTracker.submitCandle(c.o, c.h, c.l, c.c, c.v);

//get old candle -- up to MAX_PERIODS ago [rolls over to beginning afterwards]
var nPeriodsAgo = 1;
console.log(myCandlesTracker.getCandle(nPeriodsAgo));
//{ o: 1, h: 2, l: 0.5, c: 2, v: 2000, b: 0, a: 0, td: 0, ts: 0n }
```

## See Also

- [vwap-fast](https://www.npmjs.com/package/vwap-fast)



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



