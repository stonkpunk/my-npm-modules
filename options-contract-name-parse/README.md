# options-contract-name-parse

parse names of options contracts like `QQQ230530C00292000` or `AAPL230526C00110000`

the expected format is 
`SYMBOL + YYMMDD + P|C + 8-digit-strike-price-in-thousandths-of-dollars`

does not work for options from before the year 2000.

experimental, use at your own risk.

## Installation

```sh
npm i options-contract-name-parse
```

## Usage 

```javascript
var parseName = require('options-contract-name-parse').parse;

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
//   expirationDateISO: '2023-05-26T16:00:00.000Z', //assumes 4PM EST
//   expirationDateUnixSeconds: 1685116800,
//   optionType: 'call',
//   strikePrice: 110
// }
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



