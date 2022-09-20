function removeTrendCandles(data, multiplierDown=1){
    var firstLast = [data[0].close,data[data.length-1].close]
    var deltaStartEnd = firstLast[1]-firstLast[0];

    data = data.map(function(r,i){
        var t = i/data.length;
        r.origI=i;
        r.open = r.open-deltaStartEnd*t*multiplierDown;
        r.close = r.close-deltaStartEnd*t*multiplierDown;
        r.high = r.high-deltaStartEnd*t*multiplierDown;
        r.low = r.low-deltaStartEnd*t*multiplierDown;
        //volume stays the same
        return r;
    });

    return data;
}

function removeTrend(data, multiplierDown=1){
    var firstLast = [data[0],data[data.length-1]]
    var deltaStartEnd = firstLast[1]-firstLast[0];
    data = data.map(function(r,i){
        var t = i/data.length;
        r = r-deltaStartEnd*t*multiplierDown;
        return r;
    });

    return data;
}

function removeTrendCandlesRolling(data, days=14){
    var dataOrig = data.map(function(r){
        r._close = r.close+0;
        return r;
    });
    return data.map(function(r,i){
        if(i>=days){
            var closeDaysAgo = dataOrig[i-days]._close - dataOrig[0]._close;
            r.origI=i;
            r.open = r.open-closeDaysAgo;
            r.close = r.close-closeDaysAgo;
            r.high = r.high-closeDaysAgo;
            r.low = r.low-closeDaysAgo;
            //volume stays the same
            return r;
        }else{
            r.origI=i;
            r.open = r.open;
            r.close = r.close;
            r.high = r.high;
            r.low = r.low;
            //volume stays the same
            return r;
        }
        return r;
    })
}

function removeTrendRolling(data, days=14){
    var dataOrig = data.map(function(r){
        return r+0;
    });
    return data.map(function(r,i){
        if(i>=days){
            var closeDaysAgo = dataOrig[i-days] - dataOrig[0];
            r = r-closeDaysAgo;
            return r;
        }else{
            return r;
        }
        return r;
    })
}

module.exports = {removeTrendCandles, removeTrendCandlesRolling, removeTrend, removeTrendRolling};
