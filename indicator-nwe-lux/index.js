// Gaussian window
function gauss(x, h) {
    return Math.exp(-(Math.pow(x, 2) / (h * h * 2)));
}

// This function computes the NWE
function computeNWE(candles, h, mult, windowSize=499) {
    const n = candles.length;

    let sae = 0.;
    let nwe = [];
    let nweTop = [];
    let nweBottom = [];
    let buy = [];
    let sell = [];

    // Compute and set NWE point
    for(let i = 0; i < Math.min(windowSize, n - 1); i++) {
        let sum = 0.;
        let sumw = 0.;
        // Compute weighted mean
        for(let j = 0; j < Math.min(windowSize, n - 1); j++) {
            let w = gauss(i - j, h);
            sum += candles[j].close * w;
            sumw += w;
        }

        let y2 = sum / sumw;
        sae += Math.abs(candles[i].close - y2);
        nwe.push(y2);
    }

    sae = sae / Math.min(windowSize, n - 1) * mult;

    for(let i = 0; i < Math.min(windowSize, n - 1); i++) {
        nweTop.push(nwe[i] + sae);
        nweBottom.push(nwe[i] - sae);

        if (i > 0) {
            if (candles[i-1].close > nweTop[i-1] && candles[i].close < nweTop[i]) {
                sell.push(true);
                buy.push(false);
            } else if (candles[i-1].close < nweBottom[i-1] && candles[i].close > nweBottom[i]) {
                sell.push(false);
                buy.push(true);
            } else {
                sell.push(false);
                buy.push(false);
            }
        } else {
            sell.push(false);
            buy.push(false);
        }
    }

    return { nwe, nweTop, nweBottom, buy, sell };
}

// This function computes the NWE


function computeForSingleCandle(candles, index=candles.length-1, lookbackLen = 499, h = 8, mult = 3){

// Usage
//     let data = [...]; // replace with your data
//     let h = 8.;  // bandwidth
//     let mult = 3.;  // mult value

    var start = Math.max(0,index-lookbackLen);
    var end = index;
    var sampleCandles = candles.slice(start,end+1);

    let result = computeNWE(sampleCandles, h, mult, lookbackLen);
// console.log(index,result.nweTop.length);
var nres = result.nweTop.length;
// Append fields to each candle
    var i = index;
//     for (let i = start; i < end; i++) {
        candles[i]['NWEtop'] = result.nweTop[nres-1];
        candles[i]['NWEbottom'] = result.nweBottom[nres-1];
        candles[i]['buy'] = result.buy[nres-1];
        candles[i]['sell'] = result.sell[nres-1];
    // }
    return candles;
}

function computeForAllCandlesSlow(candles, lookbackLen = 499, h = 8, mult = 3, doLog=true){
    for(var i=1;i<candles.length;i++){ //slow but rigorous -- eg for backtests
        candles = computeForSingleCandle(candles, i, 499, h, mult);
        if(doLog){
            console.log(i,'/',candles.length);
        }
    }
}

function computeForAllCandlesFast(candles, lookbackLen = 499, h = 8, mult = 3){

// Usage
//     let data = [...]; // replace with your data
//     let h = 8.;  // bandwidth
//     let mult = 3.;  // mult value

    // var start = Math.max(0,index-lookbackLen);
    // var end = index;
    var start = Math.max(0,candles.length-lookbackLen)
    var sampleCandles = candles.slice(-lookbackLen);//.slice(start,end+1);

    let result = computeNWE(sampleCandles, h, mult, lookbackLen);
// console.log(index,result.nweTop.length);
    var nres = result.nweTop.length;
// Append fields to each candle
//     var i = index;
    for (let i = start; i < candles.length; i++) {
        candles[i]['NWEtop'] = result.nweTop[i-start];
        candles[i]['NWEbottom'] = result.nweBottom[i-start];
        candles[i]['buy'] = result.buy[i-start];
        candles[i]['sell'] = result.sell[i-start];
        // if(!candles[i].NWEtop){
        //     throw candles[i]
        // }
    // console.log('okok',candles[i],start);
    }
    return candles;
}


module.exports = {computeForSingleCandle, computeForAllCandlesFast, computeForAllCandlesSlow}
