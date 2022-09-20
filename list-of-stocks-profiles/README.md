# list-of-stocks-profiles

pre-baked dataset of NASDAQ/NYSE stock profiles from Yahoo Finance with basic information and approximate market capitalization for each ticker

last updated September 2022

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
//     longBusinessSummary: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. In addition, the company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; AirPods Max, an over-ear wireless headphone; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, HomePod, and iPod touch. Further, it provides AppleCare support services; cloud services store services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. Additionally, the company offers various services, such as Apple Arcade, a game subscription service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.',
//     marketCap: 2404030873600 //<note this will be -1 if unknown/missing 
// }

```

## See Also

- [list-of-stocks](https://www.npmjs.com/package/list-of-stocks) 

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



