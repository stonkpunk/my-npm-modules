
function createVolumeProfile(candles, numBars = 20) {
    // Compute the range of the candles.
    let low = Math.min(...candles.map(c => c.low));
    let high = Math.max(...candles.map(c => c.high));
    let range = high - low;

    // Create the histogram.
    let histogram = new Array(numBars).fill(0);
    for (let candle of candles) {
        // Find the index of the bar that this candle's volume should be added to.
        let index = Math.floor((candle.close - low) / range * numBars);
        index = Math.min(index, numBars - 1); // Ensure the index is within the array bounds.
        histogram[index] += candle.volume;
    }

    // Create the volume profile.
    let volumeProfile = histogram.map((volume, index) => {
        let priceLow = index / numBars * range + low;
        let priceHigh = (index + 1) / numBars * range + low;
        return {
            volume,
            priceRange: [priceLow, priceHigh]
        };
    });

    return volumeProfile;
}

function mergeCandles(candles){
    if(candles.length==0){
        return null;
    }
    var candle = {
        open:candles[0].open,
        high:Math.max(...candles.map(c=>c.high)),
        low:Math.min(...candles.map(c=>c.low)),
        close:candles[candles.length-1].close,
        volume:candles.reduce(function(sum,num){return sum+num.volume;},0),
        srcCandles: candles.length,
    }
    return candle;
}

var getMinutesIntoMarketDay = require('stock-market-minutes').getMinutesIntoMarketDay;

function getValueArea(candles, percentile = 0.7, numBarsVolumeProfile = 20) {
    // Create the volume profile.
    let volumeProfile = createVolumeProfile(candles, numBarsVolumeProfile);

    // Find the index of the VPOC bar.
    let vpocIndex = volumeProfile.reduce(
        (maxIndex, bar, index) => bar.volume > volumeProfile[maxIndex].volume ? index : maxIndex,
        0
    );

    var candleYest = mergeCandles(candles);
    var c = candleYest;

    var pivotData = null;

    if(candleYest){
        //basic support / resistance / pivot
        var pivot = (c.high + c.low + c.close) / 3; //typical price pivot
        var resistance1 = 2 * pivot - c.low;
        var support1 = 2 * pivot - c.high;
        var resistance2 = (pivot-support1)+resistance1;
        var support2 = pivot-(resistance1-support1);

        //demark's projections
        //if yest close < open
        //today high = (h+c+2L)/2-L
        //today low = (h+c+2L)/2-H

        //if yest close > open
        //today high = (2h+c+L)/2-L
        //today low = (2h+c+L)/2-H

        //if yest close == open
        //today high = (h+2c+L)/2-L
        //today low = (h+2c+L)/2-H

        var deMarks = {
            down: {
                high: (c.high+c.close+2*c.low)/2.0-c.low,
                low: (c.high+c.close+2*c.low)/2.0-c.high
            },
            up: {
                high: (2.0*c.high+c.close+c.low)/2.0-c.low,
                low: (2.0*c.high+c.close+c.low)/2.0-c.high
            },
            equal: {
                high: (c.high+c.close*2.0+c.low)/2.0-c.low,
                low: (c.high+c.close*2.0+c.low)/2.0-c.high
            }
        }

        deMarks.today =  c.close > c.open ? deMarks.up : deMarks.down;
        if(c.close==c.open){deMarks.today = deMarks.equal;}

        pivotData = {
            candleYest,
            basic: { pivot, resistance1, support1, resistance2,  support2 },
            deMarks
        }

        //todo add 'did break through within first hour' criteria ...
    }

    // Initialize the value area with the VPOC.
    let valueAreaIndices = [vpocIndex];
    let valueVolume = volumeProfile[vpocIndex].volume;

    // Compute the total volume.
    let totalVolume = volumeProfile.reduce((sum, bar) => sum + bar.volume, 0);

    // Expand the value area by adding the adjacent bar with the largest volume at each step.
    while (valueVolume < totalVolume * percentile) {
        // Find the indices of the bars that are adjacent to the value area.
        let adjacentIndices = valueAreaIndices.flatMap(
            index => [index - 1, index + 1].filter(i => i >= 0 && i < numBarsVolumeProfile && !valueAreaIndices.includes(i))
        );

        // Find the adjacent bar with the highest volume.
        let maxIndex = adjacentIndices.reduce(
            (maxIndex, index) => volumeProfile[index].volume > volumeProfile[maxIndex].volume ? index : maxIndex,
            adjacentIndices[0]
        );

        // Add the bar to the value area and update the total volume.
        valueAreaIndices.push(maxIndex);
        valueVolume += volumeProfile[maxIndex].volume;
    }

    // Find the high and low of the value area.
    let valueAreaHigh = Math.max(...valueAreaIndices.map(index => volumeProfile[index].priceRange[1]));
    let valueAreaLow = Math.min(...valueAreaIndices.map(index => volumeProfile[index].priceRange[0]));

    var candlesHigh = Math.max(...candles.map(c=>c.high));
    var candlesLow = Math.min(...candles.map(c=>c.low));

    let vpocBar = volumeProfile[vpocIndex];
    let vpocPrice = (vpocBar.priceRange[0] + vpocBar.priceRange[1]) / 2;

    return { valueAreaHigh, valueAreaLow, candlesHigh, candlesLow, vpocPrice, pivotData };
}

let cache = {};

var intlFormat = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'America/New_York',
});

// var timeOps = { timeZone: 'America/New_York' };
// var usTime = 'en-US';
function getEstDate(isoString) {
    // Create a Date object from the ISO string.
    let date = new Date(isoString);
    // Convert the date to a string in the 'en-US' locale, with time zone set to 'America/New_York'.
    let estString = intlFormat.format(date);//.toLocaleString(usTime, timeOps);
    // Split the string on the comma and return the first part.
    return estString.split(',')[0];//.split('/').join('-');
}

function clearCache(){
    cache={};
}

function addYesterdayValueArea(candles, percentile = 0.7, numBarsVolumeProfile=20, doCache = false, doCalcFirstHour=false) {

    candles = candles.map(function(c,i){
        c.estDate = getEstDate(c.date);
        c.index = i;
        if(doCalcFirstHour){
            c.minutesIntoMarketDay = getMinutesIntoMarketDay(c.date);
        }
        return c;
    })

    var candlesPerDay = {};

    candles.forEach(function(c,i){
        candlesPerDay[c.estDate] = candlesPerDay[c.estDate] || [];
        candlesPerDay[c.estDate].push(c);
    })

    // var firstHourCandlesPerDay = {};
    var estDatePrev= null;
    var prevDateIso = null;

    for (let i = 0; i < candles.length; i++) { //console.log(i, candles.length)
        let estDate = candles[i].estDate;//getEstDate(candles[i].date);
        if(estDate!=estDatePrev){
            prevDateIso = estDatePrev;
            estDatePrev = estDate;
        }

        let valueAreaHigh;
        let valueAreaLow;
        let candlesHigh;
        let candlesLow;
        var vpocPrice;
        // var valueAreaCandles = [];
        var prevCandles = [];
        // var valueAreaVolume = 0;

        prevCandles = candlesPerDay[estDate] || []; //candles.filter(candle => candle.estDate === prevDateIso);
        var prevCandlesToday = prevCandles.filter((candle,_i) => candle.index<i /*&& candle.estDate === estDate*/ );
        var firstHourCandle=null;
        if(doCalcFirstHour){
            var prevCandlesFirstHour = prevCandlesToday.filter(function(c){
                var m = c.minutesIntoMarketDay;//getMinutesIntoMarketDay(c.date) ; //console.log(m)
                //c.minutesIntoMarketDay = m;
                return m <= 60 && m >= 0;
            });
            firstHourCandle = mergeCandles(prevCandlesFirstHour);
        }

        var todayCandle = mergeCandles(prevCandlesToday);
        //

        if (doCache && cache[prevDateIso]) {
            ({ valueAreaHigh, valueAreaLow , candlesHigh, candlesLow, vpocPrice} = cache[prevDateIso]);
        } else {
            prevCandles = candles.filter(candle => candle.estDate === prevDateIso);

            ({ valueAreaHigh, valueAreaLow, candlesHigh, candlesLow , vpocPrice, pivotData} = getValueArea(prevCandles, percentile, numBarsVolumeProfile));

            if (doCache) {
                cache[prevDateIso] = { valueAreaHigh, valueAreaLow, candlesHigh, candlesLow, vpocPrice, pivotData};
            }
        }

        // candles[i].valueAreaVolume=valueAreaVolume;
        candles[i].prevDate = prevDateIso;
        // candles[i].cansYest = prevCandles.length;
        // candles[i].cansVA = valueAreaCandles.length;
        candles[i].vahYest = valueAreaHigh;
        candles[i].valYest = valueAreaLow;
        candles[i].highYest = candlesHigh;
        candles[i].lowYest = candlesLow;
        candles[i].vpocPrice = vpocPrice;
        candles[i].pivotData = pivotData;
        candles[i].todayCandle = todayCandle;

        if(firstHourCandle){
            candles[i].firstHourCandle=firstHourCandle;
            if(todayCandle){
                var openedUnderValue = todayCandle.open < valueAreaLow;
                var openedAboveValue = todayCandle.open > valueAreaHigh;
                var gotIntoValueAreaWithin1Hour_Up = firstHourCandle.high > valueAreaLow;
                var gotIntoValueAreaWithin1Hour_Down = firstHourCandle.low < valueAreaHigh;
                candles[i].todayOpenedUnderValue = openedUnderValue;
                candles[i].todayOpenedAboveValue = openedAboveValue;
                candles[i].eightyPercentRuleUp = openedUnderValue && gotIntoValueAreaWithin1Hour_Up;
                candles[i].eightyPercentRuleDown = openedAboveValue && gotIntoValueAreaWithin1Hour_Down;
            }
        }

    }

    return candles;
}

module.exports = {
    getValueArea,
    getEstDate,
    addYesterdayValueArea,
    clearCache,
    createVolumeProfile
}