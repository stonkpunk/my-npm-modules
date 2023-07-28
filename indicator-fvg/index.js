function markLargeCandles(candles, windowSize, stdThresh=2) {
    let sizes = [];
    for (let i = 0; i < candles.length; i++) {
        sizes.push(candles[i]['high'] - candles[i]['low']);
        if (i >= windowSize) sizes.shift(); // Maintain the list size as N
        if (i < windowSize - 1) continue; // Skip the first N-1 candles
        const currentSize = candles[i]['high'] - candles[i]['low'];
        const avgSize = sizes.reduce((sum, val) => sum + val, 0) / sizes.length;
        const sdSize = calculateSD(sizes);
        if (currentSize > avgSize + stdThresh * sdSize) {
            candles[i]['isLarge'] = true;
        } else {
            candles[i]['isLarge'] = false;
        }
    }
    return candles;
}

function calculateSD(arr) {
    const avg = arr.reduce((sum, val) => sum + val, 0) / arr.length;
    const squareDiffs = arr.map(val => Math.pow(val - avg, 2));
    const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff);
}
function getCandlesGaps(candles, stdSizeThresh= 0, stdWindowSize=100, minGapSizeBeforeClose=0.0){
    if(stdSizeThresh>0){
        markLargeCandles(candles,stdWindowSize, stdSizeThresh); //mark "large" candles -- candles more than 2std bigger than average over a rolling window
    }else{
        candles = candles.map(function(c){
            c.isLarge = true;
            return c;
        });
    }
    var candlesThatStartGaps = labelGapStarts(candles, minGapSizeBeforeClose);//candlesSD*2);//candlesSD*2);
    candlesThatStartGaps.forEach(function(candleThatStartsGap){
        projectGapForward(candles, candleThatStartsGap.gapStart)
    });
    return candles;
}

function labelGapStarts(candles, thresh=0.0){
    var candlesStartingGaps = [];
    for (let i = 1; i < candles.length-1; i++) {
        var prevCandle = candles[i - 1];
        var candle = candles[i];
        var nextCandle = candles[i + 1];
        // var candleSize = candle.high-candle.low;
        if(candle.isLarge){
            if (nextCandle['low'] > prevCandle['high']+thresh) { // gap up [green, bullish]
                var theGap = {startIndex: i, lowPrice: prevCandle['high'], highPrice: nextCandle['low'], color: "green"}
                candle.gapStart = theGap;
                candlesStartingGaps.push(candle);
            } else if (nextCandle['high'] < prevCandle['low']-thresh) { // gap down [red, bearish]
                var theGap = {startIndex: i, lowPrice: nextCandle['high'] , highPrice: prevCandle['low'], color: "red"}
                candle.gapStart = theGap;
                candlesStartingGaps.push(candle);
            }
        }
    }
    return candlesStartingGaps;
}

function projectGapForward(candles, theGap){
    var gapClone = {...theGap};
    for(var i=theGap.startIndex+1;i<candles.length;i++){
        //var theGap = {startIndex: i, lowPrice, highPrice, color: "red"}
        var candle = candles[i];
        gapClone = decimateGapWithCandle(gapClone, candle, i);
        if(gapClone.closed){
            break;
        }else{
            candle.gaps = candle.gaps || {}
            candle.gaps[gapClone.startIndex] = {...gapClone}
        }
    }
}

var closedMap = {};
function decimateGapWithCandle(theGap, newCandle, candleIndex, minimumGapThresh = 0.01) {
    // Return gap(s) with section covered by newCandle removed
    var updatedGap = { ...theGap };

    if (theGap.color === 'red') {
        // For green gaps, if the newCandle is entirely within theGap, treat it as if it started from above the gap.
        if (newCandle.low > theGap.lowPrice && newCandle.high < theGap.highPrice) {
            updatedGap.lowPrice = newCandle.high;
        }
        // If the newCandle partially covers theGap from below or completely covers the gap, adjust theGap's lowPrice.
        else if (newCandle.high > theGap.lowPrice) {
            updatedGap.lowPrice = Math.min(updatedGap.highPrice, newCandle.high);
        }
    } else if (theGap.color === 'green') {
        // For red gaps, if the newCandle is entirely within theGap, treat it as if it started from below the gap.
        if (newCandle.low > theGap.lowPrice && newCandle.high < theGap.highPrice) {
            updatedGap.highPrice = newCandle.low;
        }
        // If the newCandle partially covers theGap from above or completely covers the gap, adjust theGap's highPrice.
        else if (newCandle.low < theGap.highPrice) {
            updatedGap.highPrice = Math.max(updatedGap.lowPrice, newCandle.low);
        }
    }

    // If the gap is completely covered, mark it as closed.
    if (Math.abs(updatedGap.highPrice - updatedGap.lowPrice) < minimumGapThresh) {
        updatedGap.closed = true;
        closedMap[updatedGap.startIndex] = {...updatedGap};
    }

    updatedGap.indexLastUpdate = candleIndex+0;
    // console.log('UPDATED',updatedGap);
    return updatedGap;
}

function allRectsForGaps(candles, red=[255,0,0], green=[0,255,0], filled=true, thickness=0.0){ //list of pixel-like rectangles that can be used to visualize gaps w ohlc-chart-simple
    var rects = [];
    candles.forEach(function(c,i){
        if(c.gaps){
            for(var index in c.gaps) {
                rects.push({
                    minPrice: c.gaps[index].lowPrice,
                    maxPrice: c.gaps[index].highPrice,
                    startIndex: i,
                    endIndex: i+1,
                    color:  c.gaps[index].color == "green" ? green:red,
                    filled: filled,
                    thickness: thickness
                })
            }
        }
    });
    return rects;
}

module.exports = {getCandlesGaps, allRectsForGaps}