const path = require("path");

function loadDataRaw(){
    return require('jsonfile-compressed-brotli').readFileSync(path.resolve(__dirname, 'AAPL-minutes.json'));
}

function loadDataInflated(floodClosePrice=true){
    return loadDataRaw().map(function(c){
        var [date, open, high, low, close, bid, ask, volume ] = c;
        return {date,
            open:floodClosePrice?close:open,
            high:floodClosePrice?close:high,
            low:floodClosePrice?close:low,
            close:floodClosePrice?close:close,
            bid,
            ask,
            volume};
    })
}

var cc = require('candles-convert');
function loadNMinuteCandles(n){
    return cc.convertToNMinuteIntervalsFromDate(loadDataInflated(true), n)
}

module.exports = {
    loadNMinuteCandles,
    loadMinutesRaw: loadDataRaw,
    loadMinutes: loadDataInflated
}