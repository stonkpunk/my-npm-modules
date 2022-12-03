var Vwap = require('./index.js');
var vwap = new Vwap(10000);

setInterval(function(){
    for(var i=0;i<1000000;i++){
        var candle = vwap.generateFakeCandle(); //generate random candle around price $150
        vwap.submitCandle(candle);
    }
    var vwap10k = vwap.getVwap(10000)
    //note how currentArrayIndex is always zero here because we add multiple of 10k candles above [if we make it 1000001 instead, itll appear to increment here instead]
    console.log(vwap10k, vwap.currentArrayIndex, vwap.totalCandles, vwap.prefixSums_PriceTimesVolume[vwap.prefixSums_PriceTimesVolume.length-1]);
},0)



