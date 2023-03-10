
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

function highsAndLows(values, numRowsToLook = 30, doFilterRuns= true){
    // doFilterRuns ==> remove runs of repeated buys/sells keeping only the "best" in the run
    // numRowsToLook ==> size of window

    var highs = []; //indices of candles when trader sells
    var lows = []; //indices of candles when trader buys

    highs = getHighIndices(values,numRowsToLook);
    lows = getLowIndices(values,numRowsToLook);

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
            //console.log(`sell for ${priceHere} we now have ${money.toFixed(2)} (profit ${profit.toFixed(2)})`);
            maxMoney=Math.max(money,maxMoney);
            minMoney=Math.min(money,minMoney);
        }
        _minMoney=Math.min(_minMoney,money); //max amt of money "risked"
    });

    var riskReward = maxMoney/-_minMoney; //higher is better

    return {profit: money, maxMoney, minMoney: _minMoney, minMoneyAfterSell:minMoney,riskReward};
}

function buysAndSells(values, windowSize, doFilterRuns){
    return highsAndLows(values, windowSize, doFilterRuns).map(function(r){
        r[1]=r[1].replace('high','sell').replace('low','buy');
        return r;
    })
}

module.exports = {buySellProfitsForWindowSize, buySellProfitsForIndices, buysAndSells, highsAndLows, getHighIndices, getLowIndices}