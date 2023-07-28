var aaplMinSample = require('./index.js').loadMinutes();
//return objs like [{date, open, high, low, close, bid, ask, volume}, ...]
//where date is isoString
//use loadMinutesRaw to get flat array like [[date, open, high, low, close, bid, ask, volume], ...]
console.log(aaplMinSample, aaplMinSample.length);

var aapl15MinSample = require('./index.js').loadNMinuteCandles(15);

console.log(aapl15MinSample, aapl15MinSample.length);