# candles-sample-vix

Small dataset of historic candles for testing. 

Contains 20,749 ~1-minute OHLCV candles for VVIX from late 2022 

Covers dates [2022-09-21 ... 2022-12-02]

Data may have errors, use at your own risk. 

## Installation

```sh
npm i candles-sample-vix
```

## Usage 

```javascript
var vixMinSample = require('candles-sample-vix').loadMinutes();
//return objs like [{date, open, high, low, close, volume}, ...]
//where date is isoString
//use loadMinutesRaw to get flat array like [[date, open, high, low, close, volume], ...]

//note that volume is always zero

console.log(vixMinSample, vixMinSample.length);

var vix15MinSample = require('candles-sample-vix').loadNMinuteCandles(15);

console.log(vix15MinSample, vix15MinSample.length);
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



