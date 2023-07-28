
function getHighIndices(values, windowSize){
    var res = [];
    for(var i=1;i<values.length;i++){
        var lastNValues = values.slice(Math.max(0,i-windowSize),i);
        var lastNMaxValue = Math.max(...lastNValues);
        if(values[i]>lastNMaxValue){
            res.push(i);
        }
    }
    return res;
}

function getLowIndices(values, windowSize){
    var res = [];
    for(var i=1;i<values.length;i++){
        var lastNValues = values.slice(Math.max(0,i-windowSize),i);
        var lastNMinValue = Math.min(...lastNValues);
        if(values[i]<lastNMinValue){
            res.push(i);
        }
    }
    return res;
}

function highsAndLows(values, numRowsToLook = 30, doFilterRuns= true, doEnhance=false, candleMode=false){
    // doFilterRuns ==> remove runs of repeated buys/sells keeping only the "best" in the run
    // numRowsToLook ==> size of window

    var highs = []; //indices of candles when trader sells
    var lows = []; //indices of candles when trader buys

    if(candleMode){
        highs = getHighIndices(values.map(c=>c.high),numRowsToLook);
        lows = getLowIndices(values.map(c=>c.low),numRowsToLook);
    }else{
        highs = getHighIndices(values,numRowsToLook);
        lows = getLowIndices(values,numRowsToLook);
    }


    //optimized highs / lows ... remove "runs" and pick the "best" out of each "run"

    var sbMerged = [].concat(highs.map(i=>[i,"high"]), lows.map(i=>[i,"low"])).sort(function(a,b){
        return a[0]-b[0];
    })

    if(!doFilterRuns){
        return sbMerged;
    }

    //console.log(sbMerged);
    var result = [];
    sbMerged.reduce(function (r, a) {
        //console.log(a,"R",r);
        if (a[1] !== r[1]) {
            result.push([]);
        }
        result[result.length - 1].push(a);
        return a;
    }, [0,""]);

    result=result.map(function(r){
        if(r[0][1]=="high"){
            return r.sort(function(a,b){
                return values[b[0]]-values[a[0]] //higher is better
            })[0]
        }
        if(r[0][1]=="low"){
            return r.sort(function(b,a){
                return values[b[0]]-values[a[0]] //lower is better
            })[0]
        }
    });

    if(doEnhance){
        let lastHighIndex = null;
        let lastLowIndex = null;

        var enhancedRes = result.map((val) => {
            if (val[1] == 'high') {
                if (lastHighIndex === null) {
                    lastHighIndex = val[0];
                    return [val[0],val[1],'high']; // return the first high as it is
                } else {
                    let result;
                    if (values[val[0]] > values[lastHighIndex]) {
                        result = [val[0], val[1],'higher high'];
                    } else if (values[val[0]] < values[lastHighIndex]) {
                        result = [val[0], val[1],'lower high'];
                    } else {
                        result = [val[0], val[1],'equal high'];
                    }
                    lastHighIndex = val[0];
                    return result;
                }
            } else if (val[1] == 'low') {
                if (lastLowIndex === null) {
                    lastLowIndex = val[0];
                    return [val[0],val[1],'low']; // return the first low as it is
                } else {
                    let result;
                    if (values[val[0]] < values[lastLowIndex]) {
                        result = [val[0],val[1], 'lower low'];
                    } else if (values[val[0]] > values[lastLowIndex]) {
                        result = [val[0],val[1], 'higher low'];
                    } else {
                        result = [val[0],val[1], 'equal low'];
                    }
                    lastLowIndex = val[0];
                    return result;
                }
            }
        });

        result=enhancedRes;
    }

    return result;
}

function buySellProfitsForIndices(values, windowSize, doFilterRuns){
    return highsAndLows(values, windowSize, doFilterRuns).map(function(r){
        r[1]=r[1].replace('high','sell').replace('low','buy');
        return r;
    })
}

//get highs and lows for window size, then [with "buys" at lows and "sells" at highs], calculate profit for the given series of prices
function buySellProfitsForWindowSize(prices, windowSize, bidAskSpread=0){
    var _buysAndSells = buysAndSells(prices, windowSize, true);
    var profitObj = buySellProfitsForIndices(_buysAndSells, prices, bidAskSpread);
    //{profit: money, maxMoney, minMoney: _minMoney, minMoneyAfterSell:minMoney,riskReward}
    return profitObj;
}

//like above but takes raw list of buys/sells produced by buysAndSells function
function buySellProfitsForIndices(buySellIndices,pricesList, bidAskSpread=0){
    if(buySellIndices[0][1]=="sell"){
        buySellIndices.shift(); //remove first item so we start w a buy
        // console.log('discard first');
    }
    if(buySellIndices[buySellIndices.length-1][1]=="buy"){
        buySellIndices.pop(); //remove last item so we end w a sell
        // console.log('discard last');
    }
    var money = 0;
    var lastBuyPrice = 0;
    var maxMoney = -1;
    var minMoney = 99999999;
    var _minMoney = 9999999;

    var totalGains = 0;
    var totalLosses = 0;

    buySellIndices.forEach(function(row){
        var indexOfCandle = row[0];
        var priceHere = pricesList[indexOfCandle];
        if(row[1]=="buy"){
            var amt = row[2] || 1;
            money-=(priceHere*(1.0+bidAskSpread/2.0))*amt;
            lastBuyPrice = priceHere;
            //console.log(`buy for ${priceHere} we now have ${money.toFixed(2)}`, candlesOriginal[indexOfCandle].day, candlesOriginal[indexOfCandle].clock);
        }else if(row[1]=="sell"){
            var amt = row[2] || 1;
            money+=(priceHere*(1.0-bidAskSpread/2.0))*amt;
            var profit = (priceHere-lastBuyPrice)*amt;

            if (profit > 0) {
                totalGains += profit;
            } else {
                totalLosses += Math.abs(profit); // We take the absolute value because losses are negative
            }

            //console.log(`sell for ${priceHere} we now have ${money.toFixed(2)} (profit ${profit.toFixed(2)})`);
            maxMoney=Math.max(money,maxMoney);
            minMoney=Math.min(money,minMoney);
        }
        _minMoney=Math.min(_minMoney,money); //max amt of money "risked"
    });

    var riskReward = totalGains/totalLosses; //higher is better

    return {profit: money, maxMoney, minMoney: _minMoney, minMoneyAfterSell:minMoney,riskReward};
}

function buysAndSells(values, windowSize, doFilterRuns){
    return highsAndLows(values, windowSize, doFilterRuns).map(function(r){
        r[1]=r[1].replace('high','sell').replace('low','buy');
        return r;
    })
}

function distanceToNextOne(mask, maxVal=9999, doNormalize=true) {
    const result = [];
    let nextOneIndex = -1;

    for (let i = mask.length - 1; i >= 0; i--) {
        if (mask[i] === 1) {
            nextOneIndex = i;
            result[i] = 0;
        } else if (nextOneIndex !== -1) {
            result[i] = Math.min(maxVal, (nextOneIndex - i)) / (doNormalize ? maxVal : 1);
        } else {
            result[i] = doNormalize ? 1: maxVal; // or use any other value to represent that there's no "1" after this index
        }
    }

    return result;
}

function maskIndices(indices, len){
    var res = new Array(len).fill(0);
    indices.forEach(function(i){
        res[i] = 1.0;
    });
    return res;
}

function calculateBuySellMaskOracleIndicator(candles, windowSize, doNormalize=true){
    var res = buysAndSells(candles.map(c=>c[4]), windowSize);
    var buys = res.filter(row=>row[1]=='buy').map(r=>r[0]); //list of indices [1,5,7] etc
    var sells = res.filter(row=>row[1]=='sell').map(r=>r[0]);
    var buyMask = maskIndices(buys, candles.length); //mask style list [0, 1, 0, 0, 0, 1, 0, 1]
    var sellMask = maskIndices(sells, candles.length);

    var buyMaskDistToNextOne = distanceToNextOne(buyMask, windowSize, doNormalize); //distance from current index to next "1", normalized 0...1
    var sellMaskDistToNextOne = distanceToNextOne(sellMask, windowSize, doNormalize);

    return {
        buyMask,
        sellMask,
        buyMaskDistToNextOne,
        sellMaskDistToNextOne
    }
}

module.exports = {calculateBuySellMaskOracleIndicator, buySellProfitsForWindowSize, buySellProfitsForIndices, buysAndSells, highsAndLows, getHighIndices, getLowIndices}