var {
    calculateProfit,
    calculatePercentChange,
    calculateProfitWithBidAsk
} = require('./index.js');

//some fake candles...
var candles = [
    ["1990-01-01", 90, 100, 80, 95, 2000], //[ts, o, h, l, c, v]
    ["1990-01-02", 90, 100, 80, 100, 2000],
    ["1990-01-03", 90, 100, 80, 105, 2000],
    ["1990-01-04", 90, 100, 80, 95, 2000],
    ["1990-01-05", 90, 100, 80, 100, 2000],
    ["1990-01-06", 90, 100, 80, 95, 2000]
]

//criteria for buying... [only if we dont already have a position]
function buyCriteria(candle, candleIndex){
    // var close = candle[4];
    return candleIndex%2==0;
}

//criteria for selling... [only if we already have a position]
function sellCriteria(candle, candleIndex, entryPrice, entryIndex){
    // var close = candle[4];
    return candleIndex%2==1;
}

var bidAskSpread = 0;
var transactionHistory= calculateProfit(candles, buyCriteria, sellCriteria, bidAskSpread, true);
var profitTotal= calculateProfit(candles, buyCriteria, sellCriteria, bidAskSpread, false);

//calculateProfit(candles, buyCriteria=never, sellCriteria=never, bidAskSpread=0, doReturnHistory=false)

//similar as calculateProfit but candles have additional bidPrice and askPrice column. profits likewise calculated as if we made market orders.
//calculateProfitWithBidAsk(candles, buyCriteria=never, sellCriteria=never, doReturnHistory=false)

console.log({transactionHistory, profitTotal});

// {
//     transactionHistory: [
//         {
//             profit: 5,
//             percent: 5.263157894736842,
//             entryPrice: 95,
//             exitPrice: 100,
//             position: 'long',
//             entryIndex: 0,
//             exitIndex: 1
//         },
//         {
//             profit: -10,
//             percent: -9.523809523809524,
//             entryPrice: 105,
//             exitPrice: 95,
//             position: 'long',
//             entryIndex: 2,
//             exitIndex: 3
//         },
//         {
//             profit: -5,
//             percent: -5,
//             entryPrice: 100,
//             exitPrice: 95,
//             position: 'long',
//             entryIndex: 4,
//             exitIndex: 5
//         }
//     ],
//     profitTotal: -10
// }


