var fincal = require("fincal");
var calendar = fincal.new_york;

var holidays = require('@date/holidays-us').bank();
var moment = require('moment-business-days');
moment.updateLocale('us');

function timeStrAddTime(dateStr, unitsLater= 1, increment='minutes'){
    var startMoment = moment(dateStr);
    return moment(startMoment).add(unitsLater,increment).toISOString();
}

var minutesPerDay = 1440;
var millisPerDay = minutesPerDay*60*1000;

function getNextMarketOpenTime(dateStr){
    var maxTries = minutesPerDay; //kinda arbitrary but just to avoid any unexpected inf loops...
    var nextTimeStr = dateStr+"";
    var marketIsOpenNextTime = false;
    var tries = 0;

    var inOneMinStr = timeStrAddTime(dateStr, 1, 'minutes');
    if(calendar.areMarketsOpenAt(new Date(inOneMinStr), false)){
        return inOneMinStr;
    }

    while(!marketIsOpenNextTime && tries<maxTries){ //add hours until market is open
        tries++;
        nextTimeStr = timeStrAddTime(nextTimeStr, 1, 'hours');
        marketIsOpenNextTime = calendar.areMarketsOpenAt(new Date(nextTimeStr), false);
    }

    while(marketIsOpenNextTime && tries<maxTries){ //subtract minutes until it's closed again...
        tries++;
        nextTimeStr = timeStrAddTime(nextTimeStr, -1, 'minutes');
        marketIsOpenNextTime = calendar.areMarketsOpenAt(new Date(nextTimeStr), false);
    }

    nextTimeStr = timeStrAddTime(nextTimeStr, 1, 'minutes'); //... then add back 1 minute

    if(tries>=maxTries){ //end of the world?
        throw 'err finding market time';
    }

    return nextTimeStr;
}

function getListOfMarketDays(isoTimeStr, numberOfDaysToGet){
    var currentDayStr = isoTimeStr+"";
    var listOfDays = [];

    if(marketTimeData(currentDayStr,true).marketIsOpenToday){listOfDays.push(currentDayStr);}

    while(listOfDays.length<numberOfDaysToGet){
        var nextDayStr = timeStrAddTime(currentDayStr,1,'days');
        var mtd = marketTimeData(nextDayStr,true);
        var nextDayIsMarketDay = mtd.marketIsOpenToday;// && !mtd.isWeekend;
        if(nextDayIsMarketDay){
            listOfDays.push(nextDayStr);
        }
        currentDayStr=nextDayStr+"";
    }

    return listOfDays.map(function(isoStr){
        //dateStr has format 2022-09-19
        var dateStr = isoStr.slice(0,10);
        var hours = calendar.tradingSession(dateStr,false);
        hours.start = hours.start.toISOString();
        hours.end = hours.end.toISOString();
        return {
            dateStr,
            ...hours
        }
    });
}

function marketTimeData(dateStr, skipFindNext= false){
    //var dateStr = "2022-09-19T18:59:00+00:00";
    var startDate = new Date(dateStr);
    var startMoment = moment(dateStr);
    var isHoliday = holidays.isHoliday(startDate);
    var isWeekend = !startMoment.isBusinessDay();
    var marketIsOpenNow = calendar.areMarketsOpenAt(startDate);
    var marketIsOpenToday = calendar.areMarketsOpenOn(startDate);
    var nextMarketOpenDateStr = skipFindNext ? null : getNextMarketOpenTime(dateStr);
    var nextMarketOpenDateStrEST = skipFindNext ? null : moment(nextMarketOpenDateStr).tz('America/New_York').format('YYYY-MM-DD hh:mma z');
    var skippableDaysAhead = skipFindNext ? null : Math.floor((new Date(nextMarketOpenDateStr).getTime() - new Date(dateStr).getTime())/millisPerDay)
    var dateStrEST = startMoment.tz('America/New_York').format('YYYY-MM-DD hh:mma z');
    var marketMinute = getMinutesIntoMarketDay(dateStr);
    return {
        marketMinute,
        skippableDaysAhead, isHoliday, isWeekend, marketIsOpenToday, marketIsOpenNow, dateStr, dateStrEST, nextMarketOpenDateStr, nextMarketOpenDateStrEST
    };
}

function getMinutesIntoMarketDay(isoDateString) {
    // Parse the ISO date string into a JavaScript Date object
    var date = new Date(isoDateString);

    // Adjust the time to EST
    var estDate = new Date(date.toLocaleString('en-US', { timeZone: 'America/New_York' }));

    // Get hours and minutes of EST time
    var estHours = estDate.getHours();
    var estMinutes = estDate.getMinutes();

    // Define the market open and close times in minutes from midnight
    var marketOpen = 9.5 * 60;  // 9:30am
    var marketClose = 16 * 60;  // 4:00pm

    // Calculate how many minutes into the day the provided time is
    var minutesIntoDay = estHours * 60 + estMinutes;

    // Return the difference between the provided time and the market times
    if (minutesIntoDay < marketOpen) {
        return minutesIntoDay - marketOpen;
    } else if (minutesIntoDay > marketClose) {
        return minutesIntoDay - marketClose - 2 * (marketClose - marketOpen);
    } else {
        return minutesIntoDay - marketOpen;
    }
}

// Example usage
// const isoDateString = "2023-05-27T10:15:00.000Z";
// const minutesIntoMarketDay = getMinutesIntoMarketDay(isoDateString);
// console.log(minutesIntoMarketDay); // Output: 45
//
// const isoDateString2 = "2023-05-27T08:00:00.000Z";
// const minutesIntoMarketDay2 = getMinutesIntoMarketDay(isoDateString2);
// console.log(minutesIntoMarketDay2); // Output: -150
//
// const isoDateString3 = "2023-05-27T16:30:00.000Z";
// const minutesIntoMarketDay3 = getMinutesIntoMarketDay(isoDateString3);
// console.log(minutesIntoMarketDay3); // Output: 390

function convertToNMinuteIntervals(candles, n) {
    let results = [];
    let tempCandle = null;
    let nSrcCandles = 0;
    let tempVolume = 0;

    for (let candle of candles) {
        let date = new Date(candle.date);
        let roundedDate = new Date(Math.floor(date.getTime() / (n * 60000)) * (n * 60000));

        if (tempCandle === null) {
            tempCandle = { ...candle, date: roundedDate.toISOString() };
            tempVolume = candle.volume;
            nSrcCandles = 1;
        } else {
            if (roundedDate.getTime() === new Date(tempCandle.date).getTime()) {
                // Same interval, update high, low and close if necessary, accumulate volume
                if (candle.high > tempCandle.high) tempCandle.high = candle.high;
                if (candle.low < tempCandle.low) tempCandle.low = candle.low;
                tempCandle.close = candle.close;  // last close of the interval
                tempVolume += candle.volume;
                nSrcCandles += 1;
            } else {
                // New interval, add the old tempCandle to results and start a new one
                tempCandle.volume = tempVolume;
                tempCandle.nSrcCandles = nSrcCandles;
                results.push(tempCandle);
                tempCandle = { ...candle, date: roundedDate.toISOString() };
                tempVolume = candle.volume;
                nSrcCandles = 1;
            }
        }
    }

    // Add the last tempCandle to results if it exists
    if (tempCandle !== null) {
        tempCandle.volume = tempVolume;
        tempCandle.nSrcCandles = nSrcCandles;
        results.push(tempCandle);
    }

    return results;
}


module.exports = {convertToNMinuteIntervals, getMinutesIntoMarketDay, getNextMarketOpenTime, marketTimeData, timeStrAddTime, getListOfMarketDays}

// {
//     isHoliday: false,
//     isWeekend: false,
//     marketIsOpenToday: true,
//     marketIsOpenNow: true,
//     dateStr: '2022-09-19T19:59:00.000Z',
//     dateStrEST: '03:59pm EDT',
//     nextMarketOpenDateStr: '2022-09-20T13:30:00.000Z',
//     nextMarketOpenDateStrEST: '09:30am EDT'
// }

//console.log(marketTimeData("2022-09-19T19:59:00.000Z"))

