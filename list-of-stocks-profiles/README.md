# list-of-stocks-profiles

**pre-baked** dataset of NASDAQ/NYSE stock profiles from Yahoo Finance with basic information and approximate price/volume + market capitalization for each ticker 

Also contains IPO dates from [list-of-stocks-ipos](https://www.npmjs.com/package/list-of-stocks-ipos)

This is meant to assist in basic sorting/clustering of stock tickers, not for up-to-date information.

Data last updated April 29th 2023

*This is not necessarily a complete or accurate dataset, use at your own risk!*

## Installation

```sh
npm i list-of-stocks-profiles
```

## Usage 

```javascript
var losp = require('list-of-stocks-profiles');
var profiles = losp.loadProfiles(); //must call this first to decompress the dataset

console.log(profiles["AAPL"]);

// {
//     shortName: 'Apple Inc.',
//     longName: 'Apple Inc.',
//     website: 'https://www.apple.com',
//     industry: 'Consumer Electronics',
//     sector: 'Technology',
//     longBusinessSummary: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. In addition, the company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, and HomePod. Further, it provides AppleCare support and cloud services store services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. Additionally, the company offers various services, such as Apple Arcade, a game subscription service; Apple Fitness+, a personalized fitness service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.',
//     marketCap: 2062007795712,
//     price: 129.62,
//     fiftyDayAverage: 141.3484,
//     twoHundredDayAverage: 150.84735,
//     beta: 1.27241,
//     pe: 21.214401,
//     volume: 87754715,
//     averageDailyVolume10Day: 81865790,
//     bid: 129.26,
//     ask: 129.35,
//     bidSize: 800,
//     askSize: 1200,
//     dividendYield: 0.0074,
//     ipoDate: '1980-12-12'
//     emojiSimple: '📱',
//     emojiComplex: '📱📺' //note -- emojis are per-sector-industry not per-company 
// }

//note -- missing/undefined values are replaced with -1 
//        other than PE / beta / ipoDate, which are replaced with null

//get extrapolated market cap for symbol at price [returns -1 if unknown symbol / market cap]
console.log(losp.getMarketCapAtPrice("AAPL", 133)) //2115777170418.8857

//get map of companies by sector/industry -- map[sectors|industries][sectorName/industryName] = [list of symbols]
console.log(losp.getSymbolsBySectorObj())

// {
//     sectors: {
//         Healthcare: [
//             'A',    'AADI', 'ABBV', 'ABC',  'ABCL', 'ABCM', 'ABEO',
//             'ABIO', 'ABMD', 'ABOS', 'ABSI', 'ABT',  'ABUS', 'ABVC',
//             'ACAD', 'ACB',  'ACCD', 'ACER', 'ACET', 'ACHC', 'ACHL',
//             'ACHV', 'ACIU', 'ACLX', 'ACON', 'ACOR', 'ACRS', 'ACRX',
//             'ACST', 'ACXP', 'ADAG', 'ADAP', 'ADCT', 'ADIL', 'ADMA', ... ],
//          ....
//      }
//      industries: { //these are like sub-sectors of sectors ...
//             'Diagnostics & Research': [
//                 'A',    'ACRS', 'AKU',   'APDN', 'AWH',  'BDSX',
//                 'BIOC', 'BNGO', 'BNR',   'CDNA', 'CEMI', 'CHEK',
//                 'CNTG', 'CO',   'CRL',   'CSTL', 'DGX',  'DHR', ... ],
//          ....
// }


console.log(losp.listOfSymbolsSortedByMarketCap());

// [
//     'AAPL', 'MSFT',  'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META',
//     'TSLA', 'JNJ',   'V',     'XOM',  'UNH',  'TSM',  'WMT',
//     'JPM',  'LLY',   'NVO',   'PG',   'MA',   'CVX',  'HD', ...

//also, losp.listOfProfilesSortedByMarketCap -- returns full profiles as array 

```

## See Also

- [list-of-stocks](https://www.npmjs.com/package/list-of-stocks) 
- [list-of-stocks-ipos](https://www.npmjs.com/package/list-of-stocks-ipos)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



