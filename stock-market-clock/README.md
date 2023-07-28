# stock-market-clock

Util for American stock market timing. 

Calculate the next minute that the NYSE will be open.

How it works:

- gets business days via `require('moment-business-days')`
- gets holidays via `require('@date/holidays-us').bank()`
- gets trading session time via `require("fincal").new_york` [9:30am - 4:00pm]

I haven't tested this very much so use at your own risk

## Installation

```sh
npm i stock-market-clock
```

## Usage 

```javascript

var smc = require('stock-market-clock');

// uses ISO 8601 date strings -- new Date().toISOString()
// YYYY-MM-DDTHH:mm:ss.sssZ

// marketTimeData(isoString, skipFindNext?=false) //set skipFindNext to true if you dont care about finding the upcoming open market time
console.log(smc.marketTimeData("2022-09-23T19:59:00.000Z")) //3:59pm on a friday

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

// getNextMarketOpenTime(isoString, skipFindNext?=false) 
console.log(smc.getNextMarketOpenTime("2022-09-20T13:30:00.000Z")) //9:30am
// "2022-09-20T13:31:00.000Z" //one minute later

console.log(smc.getNextMarketOpenTime("2022-09-19T19:59:00.000Z")) //3:59pm
// "2022-09-20T13:30:00.000Z" //9:30am the next day

// util to add time units to isostring and return another isostring
console.log(smc.timeStrAddTime("2022-09-20T13:30:00.000Z", 7, "minutes"));
// "2022-09-20T13:37:00.000Z"

//get how many minutes into the market day we are [negative if time is outside market hours [time until next 9:30am] -- note -- treats weekends/holidays the same! ]
console.log(smc.getMinutesIntoMarketDay("2022-09-20T13:30:00.000Z")) //0
console.log(smc.getMinutesIntoMarketDay("2022-09-20T13:29:00.000Z")) //-1
console.log(smc.getMinutesIntoMarketDay("2022-09-23T19:59:00.000Z")) //389
console.log(smc.getMinutesIntoMarketDay("2022-09-23T20:00:00.000Z")) //390
console.log(smc.getMinutesIntoMarketDay("2022-09-23T20:02:00.000Z")) //-778 //minutes until next 9:30am

//util to convert interval of candles [merged candles line up with clock, eg n=15 means candles start at 9:30, 9:45, etc]

// var n = 15;
// var mergedCandles = smc.convertToNMinuteIntervals(candles, n)

//where candles = [{date, open, high, low, close, volume}, ...] with date set to be an iso date string like "2022-11-21T05:00:00.000Z"

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
```

## See Also

- [trading-calendar](https://www.npmjs.com/package/trading-calendar)
- [@date/holidays-us](https://www.npmjs.com/package/@date/holidays-us)
- [fincal](https://www.npmjs.com/package/fincal)
- [moment-business-days](https://www.npmjs.com/package/moment-business-days)
- [list-of-stocks-profiles](https://www.npmjs.com/package/list-of-stocks-profiles)
- [list-of-stocks](https://www.npmjs.com/package/list-of-stocks)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



