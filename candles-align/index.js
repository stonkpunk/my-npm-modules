function roundTimestampToMinute(ts){
    const timestampInSeconds = ts;
    const timestampInMilliseconds = Math.floor(timestampInSeconds) * 1000;
    const roundedTimestampInMinutes = Math.round(timestampInMilliseconds / (60 * 1000)) * (60 * 1000);
    const roundedTimestampInSeconds = roundedTimestampInMinutes / 1000;

    // console.log(roundedTimestampInSeconds);
    return roundedTimestampInSeconds;
}

function roundDateToMinute(dateString) {
    const date = new Date(dateString);
    const timestampInMilliseconds = date.getTime();
    const roundedTimestampInMinutes = Math.round(timestampInMilliseconds / (60 * 1000)) * (60 * 1000);
    const roundedDate = new Date(roundedTimestampInMinutes);
    const roundedISOString = roundedDate.toISOString();

    // console.log(roundedISOString);
    return roundedISOString;
}

function alignCandlesFlat(candlesA, candlesB, roundToMinute= true){ //candle = [ts o h l c v]

    var abCandleMap={};

    if(roundToMinute){
        candlesA.forEach(function(c){
          c[0] = roundTimestampToMinute(c[0]);
        });
        candlesB.forEach(function(c){
          c[0] = roundTimestampToMinute(c[0]);
        });
    }

    candlesA.forEach(function(c){
        abCandleMap[c[0]] = abCandleMap[c[0]] || {};
        abCandleMap[c[0]].a = c;
    });
    candlesB.forEach(function(c){
        abCandleMap[c[0]] = abCandleMap[c[0]] || {};
        abCandleMap[c[0]].b = c;
    });

    var times = Object.keys(abCandleMap).sort();
    var alignedCandlePairs = times.map(function(time){
        if(abCandleMap[time].a && abCandleMap[time].b){
            return [abCandleMap[time].a , abCandleMap[time].b]
        }else{
            return null;
        }
    }).filter(n=>n); //result like [[cA,cB],[cA,cB],[cA,cB]...]

    var alignedCandles = {
        a: alignedCandlePairs.map(r=>r[0]),
        b: alignedCandlePairs.map(r=>r[1])
    }

    return {
        alignedCandles, alignedCandlePairs
    }
}

function alignCandlesObjsTime(candlesA, candlesB, roundToMinute= true){ //candle = {time open low close high volume} -- time is Unix epoch seconds

    var abCandleMap={};

    if(roundToMinute){
        candlesA.forEach(function(c){
          c.time = roundTimestampToMinute(c.time);
        });
        candlesB.forEach(function(c){
          c.time = roundTimestampToMinute(c.time);
        });
    }

    candlesA.forEach(function(c){
        abCandleMap[c.time] = abCandleMap[c.time] || {};
        abCandleMap[c.time].a = c;
        // console.log(c.time,"A")
    });
    candlesB.forEach(function(c){
        abCandleMap[c.time] = abCandleMap[c.time] || {};
        abCandleMap[c.time].b = c;// console.log(c.time,"B") //1678975500
    });

    // console.log(abCandleMap)

    var times = Object.keys(abCandleMap).sort();
    var alignedCandlePairs = times.map(function(time){
        if(abCandleMap[time].a && abCandleMap[time].b){
            return [abCandleMap[time].a , abCandleMap[time].b]
        }else{
            return null;
        }
    }).filter(n=>n); //result like [[cA,cB],[cA,cB],[cA,cB]...]

    var alignedCandles = {
        a: alignedCandlePairs.map(r=>r[0]),
        b: alignedCandlePairs.map(r=>r[1])
    }

    return {
        alignedCandles, alignedCandlePairs
    }
}

function alignCandlesObjsDate(candlesA, candlesB, roundToMinute= true){ //candle = {date open low close high volume} -- date is iso string

    var abCandleMap={};

    if(roundToMinute){
        candlesA.forEach(function(c){
          c.date = roundDateToMinute(c.date);
        });
        candlesB.forEach(function(c){
          c.date = roundDateToMinute(c.date);
        });
    }

    candlesA.forEach(function(c){
        abCandleMap[c.date] = abCandleMap[c.date] || {};
        abCandleMap[c.date].a = c;
        // console.log(c.time,"A")
    });
    candlesB.forEach(function(c){
        abCandleMap[c.date] = abCandleMap[c.date] || {};
        abCandleMap[c.date].b = c;// console.log(c.time,"B") //1678975500
    });

    // console.log(abCandleMap)

    var times = Object.keys(abCandleMap).sort();
    var alignedCandlePairs = times.map(function(date){
        if(abCandleMap[date].a && abCandleMap[date].b){
            return [abCandleMap[date].a , abCandleMap[date].b]
        }else{
            return null;
        }
    }).filter(n=>n); //result like [[cA,cB],[cA,cB],[cA,cB]...]

    var alignedCandles = {
        a: alignedCandlePairs.map(r=>r[0]),
        b: alignedCandlePairs.map(r=>r[1])
    }

    return {
        alignedCandles, alignedCandlePairs
    }
}

function alignCandlesMultiDate(candlesObj, roundToMinute=true){
    var candleDateMap = {};
    var candleByDateCount = {};
    var syms = Object.keys(candlesObj);
    for(var sym in candlesObj){
        var candles = candlesObj[sym];
        candleDateMap[sym] = candleDateMap[sym] || {};
        candles.forEach(function(candle){
            var date = roundToMinute ? roundDateToMinute(candle.date) : candle.date;
            candleDateMap[sym][date] = candle;
            candleByDateCount[date] = candleByDateCount[date] || 0;
            candleByDateCount[date]++;
        })
    }

    var validDates = Object.keys(candleByDateCount).filter(function(date){return candleByDateCount[date]==syms.length; });
    const dateObjectsArray = validDates.map((isoString) => new Date(isoString));
    dateObjectsArray.sort((a, b) => a - b);
    validDates = dateObjectsArray.map((date) => date.toISOString());

    var res = {};
    for(var sym in candlesObj){
        res[sym] = [];
        validDates.forEach(function(date){
            res[sym].push(candleDateMap[sym][date]);
        })
    }

    return {
        validDates,
        alignedCandles: res
    };;
}

function alignCandlesMultiTime(candlesObj, roundToMinute=true){
    var candleDateMap = {};
    var candleByTimeCount = {};
    var syms = Object.keys(candlesObj);
    for(var sym in candlesObj){
        var candles = candlesObj[sym];
        candleDateMap[sym] = candleDateMap[sym] || {};
        candles.forEach(function(candle){
            var time = roundToMinute ? roundTimestampToMinute(candle.time) : candle.time;
            time+="";
            candleDateMap[sym][time] = candle;
            candleByTimeCount[time] = candleByTimeCount[time] || 0;
            candleByTimeCount[time]++;
        })
    }
    var validTimes = Object.keys(candleByTimeCount).filter(function(time){return candleByTimeCount[time]==syms.length; }).map(time=>parseInt(time));
    validTimes.sort();

    var res = {};
    for(var sym in candlesObj){
        res[sym] = [];
        validTimes.forEach(function(time){
            res[sym].push(candleDateMap[sym][time+""]);
        })
    }

    return {
        validTimes,
        alignedCandles: res
    };
}


module.exports = {alignCandlesFlat, alignCandlesObjsTime, alignCandlesObjsDate, alignCandlesMultiDate, alignCandlesMultiTime};