// Function to find pivot high
function findPivotHigh(candles, leftLen, rightLen) {
    let pivotHighs = [];
    for (let i = leftLen; i < candles.length - rightLen; i++) {
        let pivotHigh = true;
        for (let j = i - leftLen; j <= i + rightLen; j++) {
            if (candles[j].high < candles[i].high) {
                pivotHigh = false;
                break;
            }
        }
        if (pivotHigh) pivotHighs.push(i);
    }
    return pivotHighs;
}

// Function to find pivot low
function findPivotLow(candles, leftLen, rightLen) {
    let pivotLows = [];
    for (let i = leftLen; i < candles.length - rightLen; i++) {
        let pivotLow = true;
        for (let j = i - leftLen; j <= i + rightLen; j++) {
            if (candles[j].low > candles[i].low) {
                pivotLow = false;
                break;
            }
        }
        if (pivotLow) pivotLows.push(i);
    }
    return pivotLows;
}

function equals(a,b,eps=0.005){
    return Math.abs(a-b) < eps;
}

function findBottomRectEnd(candles, bottom, startIndex){
    var res = candles.findIndex(function(c,i){
        return i>=startIndex && c.low < bottom;
    });

    if(res<0){
        return candles.length+100;
    }

    return res;
}

function findTopRectEnd(candles, top, startIndex){
    var res = candles.findIndex(function(c,i){
        return i>=startIndex && c.high > top;
    });

    if(res<0){
        return candles.length+100;
    }

    return res;
}

// Main function to calculate supply and demand zones
function supplyAndDemand(candles, pivotHighSettings={leftLen: 1, rightLen: 1}, pivotLowSettings={leftLen: 1, rightLen: 1}, timePadding=0) {
    let pivotHighs = findPivotHigh(candles, pivotHighSettings.leftLen, pivotHighSettings.rightLen);
    let pivotLows = findPivotLow(candles, pivotLowSettings.leftLen, pivotLowSettings.rightLen);

    // console.log("OK",{pivotLows,pivotHighs});

    let demandZones = [];
    let supplyZones = [];
    let pvtHIdx = [];
    let pvtLIdx = [];

    for(var i =0;i<candles.length;i++){
        var isPivotHigh = pivotHighs.includes(i);
        var isPivotLow = pivotLows.includes(i);
        if(isPivotHigh) {
            pvtHIdx.push(i);
        } else if(pvtHIdx.length > 0) {
            pvtHIdx.push(pvtHIdx[pvtHIdx.length - 1]);
        }

        if(isPivotLow) {
            pvtLIdx.push(i);
        } else if(pvtLIdx.length > 0) {
            pvtLIdx.push(pvtLIdx[pvtLIdx.length - 1]);
        }
    }

    for (let i = 3; i < candles.length; i++) {

        // imbalanced up
        if (candles[i - 3].high < candles[i - 1].low) {
            if (pvtHIdx[i-3] < pvtLIdx[i-2]) {
                let top = candles[i - 3].high;
                let bottom = candles[i - 2].low;
                let exists = demandZones.some(zone => equals(zone.top, top) && equals(zone.bottom, bottom));
                if (!exists) {
                    demandZones.push({
                        left: i + timePadding,
                        top: top,
                        right: findBottomRectEnd(candles, bottom, i+timePadding),//i + 20,
                        bottom: bottom
                    });
                }
            }
        }
        // imbalanced down
        if (candles[i - 3].low > candles[i - 1].high) {
            if (pvtLIdx[i-3] < pvtHIdx[i-2]) {
                let top = candles[i - 2].high;
                let bottom = candles[i - 3].low;
                let exists = supplyZones.some(zone => equals(zone.top, top) && equals(zone.bottom, bottom));
                if (!exists) {
                    supplyZones.push({
                        left: i + timePadding,
                        top: top,
                        right: findTopRectEnd(candles, top, i+timePadding), //i + 20,
                        bottom: bottom
                    });
                }
            }
        }
    }

    return {demandZones, supplyZones};
}

module.exports = {
    supplyAndDemand
}

