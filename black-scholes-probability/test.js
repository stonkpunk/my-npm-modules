
var bsp = require('./index.js');
var underlyingPrice = 100;
var strikePrice = 101;
var timeToExpiration = 7 / 365; // 1 week out of 1 year
var volatility = 0.2; // assume a volatility of 20%
var riskFreeInterestRate = 0.01; // assume a risk-free interest rate of 1%
var optionIsCall = true; //false for puts

var resultForCall = bsp.calculateProbability(underlyingPrice, strikePrice, timeToExpiration, volatility, riskFreeInterestRate, optionIsCall);
optionIsCall=false;
var resultForPut = bsp.calculateProbability(underlyingPrice, strikePrice, timeToExpiration, volatility, riskFreeInterestRate, optionIsCall);

console.log({resultForCall, resultForPut});
//{
// resultForCall: 0.3674992381620333,
// resultForPut: 0.6325007618379668
// }

