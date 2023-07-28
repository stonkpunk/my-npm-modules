var {calcFromLastPrices, calcFromBidAskPrices} = require('./index.js');

var riskFreeRate=0.0369; //3.69% rate for this example
let timeToExpirationInYears = 0.00550035142811004; //expiring in about 2 days
var optionChain = require('jsonfile').readFileSync('./example-chain.json');

//optionChain = [
//     {
//       strike: 90,
//       last: 85.23,
//       bid: 84.5,
//       ask: 86.55,
//     }, ...
// ]

console.log(calcFromBidAskPrices(optionChain, timeToExpirationInYears,riskFreeRate))

// [
//   { strike: 95, density: 0.020804230141809044 },
//   { strike: 100, density: -0.03800772814368944 },
//   { strike: 105, density: -0.11122261498890337 },
//   ...
//   { strike: 220, density: 0 },
//   { strike: 225, density: 0 },
//   { strike: 230, density: 0.00020004067444047308 },
//   { strike: 240, density: -0.00040008134888094615 }
// ]