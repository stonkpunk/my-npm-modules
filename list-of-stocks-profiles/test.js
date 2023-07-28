var losp = require('./index.js');
//load profiles
var profiles = losp.loadProfiles();

//print profile for symbol
console.log(profiles["AAPL"]);
// throw 'ok';
// console.log(losp.getSectorsObj())
// console.log(losp.emojis) //see emojis for each industry / sector

var entries = Object.entries(profiles);
var topPrice = entries.filter(e=>e[1].price).sort((a,b)=>(b[1].price-a[1].price));
var topBeta = entries.filter(e=>e[1].beta).sort((a,b)=>(b[1].beta-a[1].beta));
var minBeta = entries.filter(e=>e[1].beta).sort((a,b)=>(a[1].beta-b[1].beta));
var topPE = entries.filter(e=>e[1].pe).sort((a,b)=>(b[1].pe-a[1].pe));
var minPE = entries.filter(e=>e[1].pe).sort((a,b)=>(a[1].pe-b[1].pe));
var topDividend = entries.filter(e=>e[1].dividendYield).sort((a,b)=>(b[1].dividendYield-a[1].dividendYield));

var byMC = losp.listOfSymbolsSortedByMarketCap();

// [
//     'AAPL', 'MSFT',  'GOOGL', 'GOOG', 'AMZN', 'NVDA', 'META',
//     'TSLA', 'JNJ',   'V',     'XOM',  'UNH',  'TSM',  'WMT',
//     'JPM',  'LLY',   'NVO',   'PG',   'MA',   'CVX',  'HD', ...

var byMC2 = losp.listOfProfilesSortedByMarketCap();
// console.log(byMC2);


// console.log(topDividend.slice(0,10));




// {
//     shortName: 'Apple Inc.',
//     longName: 'Apple Inc.',
//     website: 'https://www.apple.com',
//     industry: 'Consumer Electronics',
//     sector: 'Technology',
//     longBusinessSummary: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide. It also sells various related services. In addition, the company offers iPhone, a line of smartphones; Mac, a line of personal computers; iPad, a line of multi-purpose tablets; AirPods Max, an over-ear wireless headphone; and wearables, home, and accessories comprising AirPods, Apple TV, Apple Watch, Beats products, HomePod, and iPod touch. Further, it provides AppleCare support services; cloud services store services; and operates various platforms, including the App Store that allow customers to discover and download applications and digital content, such as books, music, video, games, and podcasts. Additionally, the company offers various services, such as Apple Arcade, a game subscription service; Apple Music, which offers users a curated listening experience with on-demand radio stations; Apple News+, a subscription news and magazine service; Apple TV+, which offers exclusive original content; Apple Card, a co-branded credit card; and Apple Pay, a cashless payment service, as well as licenses its intellectual property. The company serves consumers, and small and mid-sized businesses; and the education, enterprise, and government markets. It distributes third-party applications for its products through the App Store. The company also sells its products through its retail and online stores, and direct sales force; and third-party cellular network carriers, wholesalers, retailers, and resellers. Apple Inc. was incorporated in 1977 and is headquartered in Cupertino, California.',
//     marketCap: 2404030873600
// }

//get extrapolated market cap for symbol at price
// console.log(losp.getMarketCapAtPrice("AAPL", 133)) //2115777170418.8857

//get map of companies by sector/industry -- map[sectors|industries][sectorName/industryName] = [list of symbols]
// console.log(losp.getSymbolsBySectorObj())

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
