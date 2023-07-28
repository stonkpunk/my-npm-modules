const {min} = require("mathjs");

function convertToNums(c){
    return c.map(function(n,i){
        return i==0 ? n : parseFloat(n);
    });
}

function filterCandlesByTime(candles) { //make sure candles are about 1min apart [original data has some 30 candles]
    let filteredCandles = [candles[0]]; // Keep the first candle.

    for (let i = 1; i < candles.length; i++) {
        let currentDate = new Date(candles[i][0]);  // Get the date of the current candle.
        let prevDate = new Date(filteredCandles[filteredCandles.length - 1][0]);  // Get the date of the last candle in the filtered array.

        // Check if the current candle is at least 58 seconds later than the previous one.
        let diffSeconds = (currentDate - prevDate) / 1000;
        if (diffSeconds >= 58) {
            filteredCandles.push(candles[i]);
        }
    }

    return filteredCandles;
}

var prev = null;
var minutes =require('fs').readFileSync('./AAPL-minutes.csv','utf8').split('\n').map(function(row){
    var [date, open, high, low, close, bid, ask, volumeTotal ] = row.split(',');
    var volume = prev ? volumeTotal - prev[7] : 0;
    if(volume<0){volume = volumeTotal;} //prevent negatives along day boundaries
    prev = [date, open, high, low, close, bid, ask, volumeTotal ];
    return [date, open, high, low, close, bid, ask, volume ]
}).slice(1).map(convertToNums)
    .filter(function(c){
        var [date, open, high, low, close, bid, ask, volume ] = c;
        var isValid = open && high && low && close && volume && bid && ask
        if(!isValid){console.log(c)}
        return isValid;
    }); //remove zero volume candles
minutes = filterCandlesByTime(minutes);

console.log(minutes.length)

require('jsonfile-compressed-brotli').writeFileSync('./AAPL-minutes.json', minutes);