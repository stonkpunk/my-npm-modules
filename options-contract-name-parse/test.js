var parseName = require('./index.js').parse;

var contractName = "QQQ230530C00292000";
var parsedContract = parseName(contractName);

console.log(parsedContract);

// {
//   symbol: 'QQQ',
//   expirationDateYYMMDD: '23/05/30',
//   expirationDateISO: '2023-05-30T16:00:00.000Z',
//   expirationDateUnixSeconds: 1685462400,
//   optionType: 'call',
//   strikePrice: 292
// }

var contractName2 = "AAPL230526C00110000";
var parsedContract2 = parseName(contractName2);

console.log(parsedContract2);

// {
//   symbol: 'AAPL',
//   expirationDateYYMMDD: '23/05/26',
//   expirationDateISO: '2023-05-26T16:00:00.000Z',
//   expirationDateUnixSeconds: 1685116800,
//   optionType: 'call',
//   strikePrice: 110
// }
