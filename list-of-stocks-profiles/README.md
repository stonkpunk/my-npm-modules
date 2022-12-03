# list-of-stocks-profiles

**pre-baked** dataset of NASDAQ/NYSE stock profiles from Yahoo Finance with basic information and approximate price/volume + market capitalization for each ticker 

This is meant to assist in basic sorting/clustering of stock tickers, not for up-to-date information.

data last updated December 1st 2022

## Installation

```sh
npm i list-of-stocks-profiles
```

## Usage 

```javascript
var profiles = require('list-of-stocks-profiles').loadProfiles(); //decompress dataset 

console.log(profiles["AAPL"]); //any symbol from NYSE or NASDAQ [see npm list-of-stocks]

// {
//     shortName: 'Apple Inc.',
//     longName: 'Apple Inc.',
//     website: 'https://www.apple.com',
//     industry: 'Consumer Electronics',
//     sector: 'Technology',
//     longBusinessSummary: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, ... ',
//     marketCap: 2356148699136,
//     price: 148.11,
//     fiftyDayAverage: 146.5318,
//     twoHundredDayAverage: 154.59515,
//     beta: 1.246644,
//     pe: 24.24059,
//     volume: 34396077,
//     averageDailyVolume10Day: 68057400,
//     bid: 148.14,
//     ask: 148.13,
//     bidSize: 1300,
//     askSize: 800,
//     dividendYield: 0.0061000003
// }

//note -- missing/undefined values are replaced with -1 
//        other than PE and beta, which are replaced with null

```

## See Also

- [list-of-stocks](https://www.npmjs.com/package/list-of-stocks) 

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



