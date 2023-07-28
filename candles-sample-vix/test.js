var vixMinSample = require('./index.js').loadMinutes();
//return objs like [{date, open, high, low, close, volume}, ...]
//where date is isoString
//use loadMinutesRaw to get flat array like [[date, open, high, low, close, volume], ...]

//note that volume is always zero

console.log(vixMinSample, vixMinSample.length);

var vix15MinSample = require('./index.js').loadNMinuteCandles(15);

console.log(vix15MinSample, vix15MinSample.length);

