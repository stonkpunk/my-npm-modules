# trend-remover

remove trends from OHLC candles and 1D data series using a rolling window or start/end prices.

## Installation

```sh
npm i trend-remover
```

## Usage 

```javascript
//note - for rolling window size N, first N values get "truncated" / clamped to first value

// var candles = [{open, high, low, close}...]
// candles = tr.removeTrendCandlesRolling(candles, days=14) //show changes relative to 14 unit rolling window
// candles = tr.removeTrendCandles(candles, multiplierDown=1) //linearly skew to remove trend so the first and last closing price are the same 
// [if multiplierDown > 1 then slope is negative]

// var data = [1,2,3,4...]
// data = tr.removeTrend(data, multiplierDown=1) 
// data = tr.removeTrendRolling(data, days=14)
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



