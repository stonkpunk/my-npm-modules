# breeden-litzenberger

Breeden-Litzenberger formula with derivatives calculated via central differences.

Simple implementation, not always numerically stable -- can return negative values etc

Experimental, use at your own risk

## Installation

```sh
npm i breeden-litzenberger
```

## Usage 

```javascript
var {calcFromLastPrices, calcFromBidAskPrices} = require('breeden-litzenberger');

var riskFreeRate=0.0369; //default. 3.69% rate for this example
let timeToExpirationInYears = 0.0055; //for this example, expiring in about 1.8 days [the default is 1 week, or 0.01916 years]
var optionChain = require('jsonfile').readFileSync('./example-chain.json'); 

//optionChain = [
//     {
//       strike: 90,
//       last: 85.23,
//       bid: 84.5,
//       ask: 86.55,
//     }, ...
// ]

//calcFromBidAskPrices uses bid-ask midpts as prices 
//calcFromLastPrices uses the last prices 

console.log(calcFromBidAskPrices(optionChain, timeToExpirationInYears, riskFreeRate))

// [
//   { strike: 95, density: 0.020804230141809044, option }, //"option" field is reference back to original data row 
//   { strike: 100, density: -0.03800772814368944, option },
//   { strike: 105, density: -0.11122261498890337, option },
//   ...
//   { strike: 220, density: 0, option },
//   { strike: 225, density: 0, option },
//   { strike: 230, density: 0.00020004067444047308, option },
//   { strike: 240, density: -0.00040008134888094615, option }
// ]

//defaults:
//calcFromLastPrices(optionsChain, timeToExpiration=0.01916, riskFreeRate= 0.0369)
//calcFromBidAskPrices(optionsChain, timeToExpiration=0.01916, riskFreeRate= 0.0369)
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



