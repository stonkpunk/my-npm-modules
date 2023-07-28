
var DEFAULT_FIB_LEVELS = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];
var DEFAULT_FIB_LEVELS_EXTENDED = [-0.236, 0, 0.236, 0.382, 0.5, 0.618, 0.786, 1, 1.272];

function fitSlow(prices, _fibLevels = DEFAULT_FIB_LEVELS, minLen=10) {
    let minMSE = null, minStart = null, minEnd = null;
    for (let i = 0; i < prices.length-minLen; i++) { //loop thru possible start pts
        for (let j = i+minLen ; j < prices.length-minLen; j++) { //loop thru possible end pts
            const start = prices[i], end = prices[j];
            var mse = mseForStartEnd(start, end, prices, _fibLevels);
            if (minMSE === null || mse < minMSE) {
                minMSE = mse;
                minStart = start;
                minEnd = end;
            }
        }
    }

    var priceLevels = _fibLevels.map(function(f){
        return minStart + f * (minEnd - minStart);
    });

    return { start: minStart, end: minEnd, mse: minMSE, fibonacciLevels: _fibLevels, priceLevels};
}

// ends up being slower
// var RTree = require('rtree');
// function fitFast(prices, _fibLevels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1], minLen=10, _priceTree) {
//     let minMSE = null, minStart = null, minEnd = null;
//     var priceTree = _priceTree || RTree(2);
//
//     if(!_priceTree){
//         prices.forEach(function(price,i){
//             priceTree.insert({x:i, y:price-0.01, w:1, h:0.01*2}, price);
//         });
//     }
//
//     for (let i = 0; i < prices.length-minLen; i++) { //loop thru possible start pts
//         for (let j = i+minLen ; j < prices.length-minLen; j++) { //loop thru possible end pts
//             const start = prices[i], end = prices[j];
//             var mse = mseForStartEndFast(start, end, prices, _fibLevels, priceTree);
//             if (minMSE === null || mse < minMSE) {
//                 minMSE = mse;
//                 minStart = start;
//                 minEnd = end;
//             }
//         }
//     }
//
//     var priceLevels = _fibLevels.map(function(f){
//         return minStart + f * (minEnd - minStart);
//     });
//
//     return { start: minStart, end: minEnd, mse: minMSE, fibonacciLevels: _fibLevels, priceLevels, priceTree};
// }

function fitStochastic(prices, attempts = prices.length, _fibLevels = DEFAULT_FIB_LEVELS){
    var bestMSE = 9999;
    var bestResult = null;
    var i=0;
    var resultCache = {};

    while(i<attempts){

        var [start, end] = [
            prices[Math.floor(Math.random()*prices.length)],
            prices[Math.floor(Math.random()*prices.length)]
        ].sort();
        var hash = `${start}_${end}`;

        var mse = resultCache[hash] || mseForStartEnd(start, end, prices, _fibLevels);
        resultCache[hash] = mse;

        if(mse < bestMSE){
            bestMSE = mse;
            bestResult = {
                start, end, mse, fibonacciLevels: _fibLevels
            };
        }
        i++;

    }
    var priceLevels = _fibLevels.map(function(f){
        return bestResult.start + f * (bestResult.end - bestResult.start);
    });
    bestResult.priceLevels = priceLevels;
    return bestResult;
}

function std(arr) {
    let sum = 0;
    let mean = 0;
    let variance = 0;
    let stdDeviation = 0;

    // Calculate the sum of all elements in the array
    for (let i = 0; i < arr.length; i++) {sum += arr[i];}

    // Calculate the mean of the array
    mean = sum / arr.length;

    // Calculate the variance of the array
    for (let j = 0; j < arr.length; j++) {variance += Math.pow(arr[j] - mean, 2);}

    variance = variance / arr.length;

    // Calculate the standard deviation of the array
    stdDeviation = Math.sqrt(variance);

    return stdDeviation;
}

function fitStochastic2(prices, stochasticSteps=prices.length, randomStartSteps=20, tempMultiplier = 0.95, _fibLevels = DEFAULT_FIB_LEVELS){
    var bestMSE = 9999;
    var bestResult = null;
    var i=0;
    var resultCache = {};

    var min = Math.min(...prices);
    var max = Math.max(...prices);
    var bestMin = min+0;
    var bestMax = max+0;
    var temp = std(prices);

    while(i<stochasticSteps+randomStartSteps){
        var startSteps = randomStartSteps;
        //i==0 -- min max
        //i 1...startSteps random choices
        //i startSteps+ stoachstic descent

        var [start, end] = [
            prices[Math.floor(Math.random()*prices.length)],
            prices[Math.floor(Math.random()*prices.length)]
        ].sort();

        if(i==0){
            [start, end] = [
                bestMin,
                bestMax
            ].sort()
        }else if(i>startSteps){
            [start, end] = [
                bestMin+(Math.random()-0.5)*temp,
                bestMax+(Math.random()-0.5)*temp
            ].sort()
            temp*=tempMultiplier;
        }

        var hash = `${start}_${end}`;

        var mse = resultCache[hash] || mseForStartEnd(start, end, prices, _fibLevels);
        resultCache[hash] = mse;

        if(mse < bestMSE){

            bestMin = start;
            bestMax = end;

            bestMSE = mse;
            bestResult = {
                start, end, mse, fibonacciLevels: _fibLevels
            };
        }
        i++;

    }
    var priceLevels = _fibLevels.map(function(f){
        return bestResult.start + f * (bestResult.end - bestResult.start);
    });
    bestResult.priceLevels = priceLevels;
    return bestResult;
}

function mseForStartEnd(start, end, prices, _fibLevels){
    var errorsSum = 0
    var range = end-start;
    // var fibPrices = _fibLevels.map(f=>start+f*range);

    for(var q=0;q<prices.length;q++){ //loop thru prices to get MSE
        var price = prices[q];
        var smallestErr2 = Infinity;
        for(var leveli =0;leveli<_fibLevels.length; leveli++){
            var err = start+_fibLevels[leveli]*range - price; //fibPrices[leveli];//actually slower to precalc it ?
            var err2 = err*err;
            if(err2 < smallestErr2){
                smallestErr2=err2;
            }
        }
        errorsSum += smallestErr2;
    }

    const mse = errorsSum/prices.length/_fibLevels.length;//errors.reduce((sum, error) => sum + error, 0) / errors.length;
    return mse;
}

// ends up being slower
// function mseForStartEndFast(start, end, prices, _fibLevels, priceTree){
//     var errorsSum = 0;
//     // _fibLevels=_fibLevels.sort();
//
//     for(var leveli =0;leveli<_fibLevels.length; leveli++){
//
//         var linePricePrev = leveli > 0 ? start+_fibLevels[leveli]*(end-start) : start - 1;
//         var linePrice = start+_fibLevels[leveli]*(end-start);
//         var linePriceNext = leveli < _fibLevels.length ? start+_fibLevels[leveli+1]*(end-start) : end + 1;
//
//         var searchPriceMin = linePrice + (linePricePrev - linePrice) * 0.5;
//         var searchPriceMax = linePrice + (linePriceNext - linePrice) * 0.5;
//
//         var pricesNearLine = priceTree.search({x:-1, y:searchPriceMin, w:prices.length*2, h:Math.abs(searchPriceMax-searchPriceMin)});
//
//         // console.log("PRICES NEAR LINE", pricesNearLine);
//
//         nearestLevelPrice = linePrice;
//
//         for(var i=0;i<pricesNearLine.length;i++){
//             errorsSum += Math.pow(pricesNearLine[i] - nearestLevelPrice,2)
//         }
//
//         //if(Math.abs(linePrice - price) < Math.abs(nearestLevelPrice-price)){
//         //    nearestLevelPrice=linePrice;
//         //}
//     }
//
//     const mse = errorsSum/prices.length/_fibLevels.length;//errors.reduce((sum, error) => sum + error, 0) / errors.length;
//     return mse;
// }

function findNearestIndex(arr, x) {
    var minDiff2 = Infinity;
    var nearestIndex = null;

    for (let i = 0; i < arr.length; i++) {
        var d = x - arr[i];
        var diff2 = d*d;
        if (diff2 < minDiff2) {
            minDiff2 = diff2;
            nearestIndex = i;
        }
    }

    return nearestIndex;
}

function encodeIntoNearestLevels(prices, doReturnString = false, windowSizeFit=10, minFitWidthFib=1){
    var res = prices.map(function(price,i){
        var windowPrices = prices.slice(Math.max(0,i-windowSizeFit+1),i+1); //prices from index i-windowSize to i, inclusive, length windowSize
        var fibHere = fitSlow(windowPrices, DEFAULT_FIB_LEVELS, minFitWidthFib);
        var ni = fibHere.priceLevels.length==0 ? -1 : findNearestIndex(fibHere.priceLevels, price);
        return ni;
    });
    return doReturnString ? res.map(num=>String.fromCharCode(num+97)).join('') : res;
}


module.exports = {/*fitFast,*/ fitSlow, fitStochastic, fitStochastic2, encodeIntoNearestLevels, DEFAULT_FIB_LEVELS, DEFAULT_FIB_LEVELS_EXTENDED}