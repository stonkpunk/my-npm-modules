# highs-and-lows

Extract indices of high/low points in a 1D array with a moving window

## Installation

```sh
npm i highs-and-lows
```

## Usage 

```javascript
var hl = require('highs-and-lows');
var prices = [0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,5,4,3,2,1,0,1,2,3,4,5]

var windowSize = 5;
var doFilterRuns = true; //remove runs -- keep the highest highs and lowest lows in each run

//highsAndLows(values, windowSize=5, doFilterRuns=true);
var res = hl.highsAndLows(prices, windowSize, doFilterRuns);

//same result but uses "buy" / "sell"
//var res = hl.buysAndSells(prices, windowSize, doFilterRuns);

console.log(res);

// [
//     [ 5, 'high' ], //sell
//     [ 10, 'low' ], //buy
//     [ 15, 'high' ], //sell
//     [ 20, 'low' ], //buy
//     [ 25, 'high' ] //sell
// ]

//get highs and lows for window size, then 
// [with "buys" at lows and "sells" at highs],
//  calculate "profit" for the given series of prices
//   -buys first low "for free" then sells first high
//   -always filters out runs  
//   -always starts with buy and ends with sell
//   -discards start/end indices otherwise
//   -bidAskSpread is expressed as fraction of price, 0...1 
//   -buys get prices increased by spread/2, sells get price decreased by spread/2
//.buySellProfitsForWindowSize(prices, windowSize, bidAskSpread=0)

//returns obj with floats 
// {profit, maxMoney, minMoney, minMoneyAfterSell, riskReward}

//like above but takes raw list of buys/sells produced by buysAndSells function
//.buySellProfitsForIndices(buySellIndices,pricesList,bidAskSpread=0)
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



