const path = require("path");

function loadDataRaw(){
    return require('jsonfile-compressed-brotli').readFileSync(path.resolve(__dirname, 'VIX-2022-09-21~2022-12-02.json'));
}

var cc = require('candles-convert');
function loadNMinuteCandles(n){
    return cc.convertToNMinuteIntervalsFromDate(loadDataRaw(), n)
}

module.exports = {
    loadNMinuteCandles,
    loadMinutes: loadDataRaw
}