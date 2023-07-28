function never(){
    return false;
}

//candle format [TS O H L C V] -- format of TS [timestamp] does not matter
//or {open high low close volume}
function calculateProfit(candles, buyCriteria=never, sellCriteria=never, bidAskSpreadAbsolute=0, doReturnHistory=false) {
    var doUseObjects = !Array.isArray(candles[0]);
    let position = null;
    let entryPrice = 0;
    let entryIndex = -1;
    let exitPrice = 0;
    let profit = 0;
    let profitHistory = [];
    for (let i = 0; i < candles.length; i++) {
        const candle = candles[i];
        const close = doUseObjects ? candle.close : candle[4]; // Close price
        const spread =  bidAskSpreadAbsolute / 2.0; // Bid-ask spread
        const buyPrice = close + spread; // Buy price
        const sellPrice = close - spread; // Sell price
        if (buyCriteria(candle, i, candles) && position === null) {
            position = 'long'; entryIndex = i;
            entryPrice = buyPrice;
        } else if (sellCriteria(candle, i, entryPrice, entryIndex, candles)) {
            if (position === 'long') {
                exitPrice = sellPrice;
                profit += exitPrice - entryPrice;
                if(doReturnHistory)profitHistory.push({profit: exitPrice - entryPrice, percent: calculatePercentChange(entryPrice, exitPrice), entryPrice, exitPrice, position, entryIndex, exitIndex: i});
                position = null; entryIndex = -1;
            }
        }
    }
    return doReturnHistory ? profitHistory : profit;
}

//same func but w bid ask prices, candles [TS O H L C B A]
//or {open high low close volume bid ask}
function calculateProfitWithBidAsk(candles, buyCriteria=never, sellCriteria=never, doReturnHistory=false) {
    var doUseObjects = !Array.isArray(candles[0]);
    let position = null;
    let entryPrice = 0;
    let entryIndex = -1;
    let exitPrice = 0;
    let profit = 0;
    let profitHistory = [];
    for (let i = 0; i < candles.length; i++) {
        const candle = candles[i];
        const close = doUseObjects ? candle.close : candle[4]
        if (buyCriteria(candle, i, candles) && position === null) {
            position = 'long'; entryIndex = i;
            entryPrice = doUseObjects ? candle.bid : candle[6]; // Bid price
        } else if (sellCriteria(candle, i, entryPrice, entryIndex, candles)) {
            if (position === 'long') {
                exitPrice = doUseObjects ? candle.ask : candle[7]; // Ask price
                profit += exitPrice - entryPrice;
                if(doReturnHistory)profitHistory.push({profit: exitPrice - entryPrice, percent: calculatePercentChange(entryPrice, exitPrice), entryPrice, exitPrice, position, entryIndex, exitIndex: i});
                position = null; entryIndex = -1;
            }
        }
    }
    return doReturnHistory ? profitHistory : profit;
}

function calculatePercentChange(entryPrice, exitPrice) {
    const percentChange = (exitPrice - entryPrice) / entryPrice * 100;
    return percentChange;
}

function flattenCandles(candlesObjs){
    return candlesObjs.map(function(c){
        //["1990-01-01", 90, 100, 80, 95, 2000], //[ts, o, h, l, c, v]
        return [
            c.date || c.ts,
            c.open || c.o,
            c.high || c.h,
            c.low || c.l,
            c.close || c.c,
            c.volume || c.v
        ]
    });
}

module.exports = {
    never,
    calculateProfit,
    calculatePercentChange,
    calculateProfitWithBidAsk,
    flattenCandles
}