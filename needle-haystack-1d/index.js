var convolve = require("ndarray-convolve")
const ndarray = require('ndarray');
const regression = require('regression');
var ndNorm = require("ndarray-normalize");
function getNeedleScaleShift(needleOriginal, haystack, positionStartOfMatch, futurePeriodsToAdd=0){
    var extractedHaystackSection = haystack.slice(positionStartOfMatch,positionStartOfMatch+needleOriginal.length+futurePeriodsToAdd);
    //use linear regression to find scale, shift
    const result = regression.linear(needleOriginal.map((_, i) => [_, extractedHaystackSection[i]]));
    const slope = result.equation[0];
    const yIntercept = result.equation[1];
    //result extracted from haystack
    var extractedHaystackSectionRescaled = extractedHaystackSection.map(function(v, i){
        return (v-yIntercept)/slope;
    })
    return {
        slope,
        yIntercept,
        extractedHaystackSection,
        extractedHaystackSectionRescaled
    }
}

function getMSE(needleOrig, extractedHaystackSectionRescaled) {
    //note that extractedHaystackSectionRescaled can be longer than the orig needle [allow for future periods]
    const squaredError = needleOrig.reduce((sum, value, index) => {
        const error = value - extractedHaystackSectionRescaled[index];
        return sum + error * error;
    }, 0);
    return squaredError / needleOrig.length;
}

function sortedIndexValues(arr) { //convert arr into arr of [index, value] sorted by value
    return arr.map((value, index) => [index, value]).sort((a, b) => b[1] - a[1]);
}

function getNeedleHaystackData(needle, haystack, doRemoveOverlaps=false){
    const needleNDArray = ndarray(needle, [needle.length]);
    const haystackNDArray = ndarray(haystack, [haystack.length]);

    var out = ndarray([].concat(haystack), [haystack.length]);
    var xc = convolve.correlate( out, haystackNDArray, needleNDArray );

    ndNorm(out) //todo we can remove this line -- but result just looks nicer, meh

    var crossCorrelation = Array.from(out.data);
    var ccIndexValues = sortedIndexValues(crossCorrelation);
    ccIndexValues=ccIndexValues.filter((ccIndexValue,i)=>ccIndexValue[0]+1>=needle.length); //avoid accidentally hits that get cut off at the start

    var indicesWithCorrelations = ccIndexValues.map(function(ccIndexValue,i){
        var index = ccIndexValue[0];
        return [index-needle.length+1,crossCorrelation[index]];
        //^^^note how we shift index back by needle.length -- otherwise it is the index of the end of the match
    });

    if(doRemoveOverlaps){
        return removeOverlaps({indicesWithCorrelations}, needle.length);
    }else{
        return {/*crossCorrelation,*/ indicesWithCorrelations};
    }
}

function removeOverlaps(hits, windowSize){ //hits = {indicesWithCorrelations}
    var invalidIndexMap = {};
    var ic = hits.indicesWithCorrelations;
    var rowsRes = [];

    function invalidate(row){
        rowsRes.push(row);
        var theIndex = row[0];
        for(var i=theIndex-windowSize;i<theIndex+windowSize;i++){
            invalidIndexMap[i]=true;
        }
    }

    for(var i=0;i<ic.length;i++){
        var theIndex = ic[i][0];
        if(!invalidIndexMap[theIndex]){
            invalidate(ic[i]);
        }
    }

    return {indicesWithCorrelations:rowsRes};
}

module.exports = {
    getNeedleScaleShift, getMSE, getNeedleHaystackData, removeOverlaps
}