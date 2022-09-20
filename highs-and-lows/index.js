
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

function buysAndSells(values, windowSize, doFilterRuns){
    return highsAndLows(values, windowSize, doFilterRuns).map(function(r){
        r[1]=r[1].replace('high','sell').replace('low','buy');
        return r;
    })
}

module.exports = {buysAndSells, highsAndLows, getHighIndices, getLowIndices}