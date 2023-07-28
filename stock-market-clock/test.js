var smc = require('./index.js');

// marketTimeData(isoString, skipFindNext?=false) //set skipFindNext to true if you dont care about finding the upcoming open market time
console.log(smc.marketTimeData("2022-09-23T19:59:00.000Z"))

// {
//     marketMinute: 389, //same as value returned by .getMinutesIntoMarketDay
//     skippableDaysAhead: 2, //0 for monday, 2 for friday [2-day weekend], 3 for longer weekend, etc //[null if skipFindNext=true]
//     isHoliday: false,
//     isWeekend: false,
//     marketIsOpenToday: true,
//     marketIsOpenNow: true,
//     dateStr: '2022-09-23T19:59:00.000Z',
//     dateStrEST: '2022-09-23 03:59pm EDT',
//     nextMarketOpenDateStr: '2022-09-26T13:30:00.000Z', // [null if skipFindNext=true]
//     nextMarketOpenDateStrEST: '2022-09-26 09:30am EDT' //9:30am upcoming monday [null if skipFindNext=true]
// }

// getNextMarketOpenTime(isoString)
console.log(smc.getNextMarketOpenTime("2022-09-20T13:30:00.000Z"))
// "2022-09-20T13:31:00.000Z" //one minute later

console.log(smc.getNextMarketOpenTime("2022-09-19T19:59:00.000Z"))
// "2022-09-20T13:30:00.000Z" //9:30am the next day

// util to add time units to isostring and return another isostring
console.log(smc.timeStrAddTime("2022-09-20T13:30:00.000Z", 7, "minutes"));
// "2022-09-20T13:37:00.000Z"

//get how many minutes into the market day we are [negative if time is outside market hours [time until next 9:30am] -- note -- treats weekends/holidays the same! ]
console.log(smc.getMinutesIntoMarketDay("2022-09-20T13:30:00.000Z")) //0
console.log(smc.getMinutesIntoMarketDay("2022-09-20T13:29:00.000Z")) //-1
console.log(smc.getMinutesIntoMarketDay("2022-09-23T19:59:00.000Z")) //389
console.log(smc.getMinutesIntoMarketDay("2022-09-23T20:00:00.000Z")) //390
console.log(smc.getMinutesIntoMarketDay("2022-09-23T20:02:00.000Z")) //-778

// util to generate list of market open days from a starting date isostring + session hours
console.log(smc.getListOfMarketDays("2022-09-20T13:30:00.000Z", 5))

// [
//     {
//         dateStr: '2022-09-20',
//         from: '9:30 am',
//         to: '4:00 pm',
//         start: '2022-09-20T13:30:00.000Z',
//         end: '2022-09-20T20:00:00.000Z'
//     },
//     {
//         dateStr: '2022-09-21',
//         from: '9:30 am',
//         to: '4:00 pm',
//         start: '2022-09-21T13:30:00.000Z',
//         end: '2022-09-21T20:00:00.000Z'
//     },
//  ...
