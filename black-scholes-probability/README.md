# black-scholes-probability

Get the probability that the price of an asset will be above the strike price of an option at the time of expiration according to the Black-Scholes model.

*Remember that this function assumes a geometric Brownian motion price process and the fulfillment of all the assumptions of the Black-Scholes model. **These assumptions are not always met in reality**, so while the model can give some insight, it is not always accurate.*

Use at your own risk.

## Installation

```sh
npm i black-scholes-probability
```

## Usage 
Example
```javascript
var {calculateProbability, stdNormCDF, erf, calcD1, calcD2} = require('black-scholes-probability');
var underlyingPrice = 100;
var strikePrice = 101;
var timeToExpiration = 7 / 365; // 1 week out of 1 year
var volatility = 0.2; // assume a volatility of 20%
var riskFreeInterestRate = 0.01; // assume a risk-free interest rate of 1%
var optionIsCall = true; //false for puts

var resultForCall = calculateProbability(underlyingPrice, strikePrice, timeToExpiration, volatility, riskFreeInterestRate, optionIsCall);
optionIsCall=false;
var resultForPut = calculateProbability(underlyingPrice, strikePrice, timeToExpiration, volatility, riskFreeInterestRate, optionIsCall);

console.log({resultForCall, resultForPut});
//{ 
// resultForCall: 0.3674992381620333, 
// resultForPut: 0.6325007618379668 
// }
```

More info
```javascript
// {Number} s Current price of the underlying asset
// {Number} k Strike price
// {Number} t Time to expiration in years
// {Number} v Volatility as a decimal
// {Number} r Annual risk-free interest rate as a decimal
// {Boolean} isCall is a call ? or a put
calculateProbability(s, k, t, v, r, isCall = true) //probability asset will be above strike price (or below for a put)

calcD1(s, k, t, v, r) //d1 from black-scholes formula
calcD2(s, k, t, v, r) //d2 from black-scholes formula
stdNormCDF(x) //0.5 * (1 + erf(x / Math.sqrt(2)))
erf(x) //error function from math-erf

// explanation:

// the calculateProbability formula can be interpreted as the risk-adjusted probability that the option will be in-the-money at expiration in a risk-neutral world (i.e., a theoretical world where all investors expect a return equal to the risk-free rate). 
// This is similar to the probability that the asset price will be above the strike price for a call option (or below for a put).

// d1 is used to calculate the price of the option based on the expected price change of the underlying asset. It measures how much the option price is expected to change per unit change in the underlying asset price.

// d2 is the expected value of the option given that it is in the money at expiration, discounted at the risk-free rate. It can also be interpreted as the risk-adjusted probability that the option will be exercised.
```




[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



