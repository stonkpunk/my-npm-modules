//{"time":1646974800,"close":1993.4000244140625,"open":1992.5999755859375,"high":1993.4000244140625,"low":1991.9000244140625,"volume":0,"clock":"00:00am","day":"2022-03-11"}
var pu = require('./pt-utils.js');
//const jf = require("jsonfile");

var DEFAULT_DOLLARS_PER_STEP = 0.01;

function roundPriceOffToStep(amt, dollarsPerStep= DEFAULT_DOLLARS_PER_STEP){
    return parseFloat((Math.floor(amt / dollarsPerStep) * dollarsPerStep).toFixed(4));
}

var rp = roundPriceOffToStep;

function getProfileTotalVolumeForPriceRange(pr, profile, dollarsPerStep= DEFAULT_DOLLARS_PER_STEP){ //pr = price range
    var lo = rp(pr[0],dollarsPerStep);
    var hi = rp(pr[1],dollarsPerStep);
    var total = 0;
    for(var price=lo; price<hi; price+=dollarsPerStep){
        var p = rp(price, dollarsPerStep)+"";
        total += profile[p] ? profile[p] : 0;
    }
    return total;
}

function getProfileTotalVolumeForPriceRange_redGreen(pr, profile, dollarsPerStep= DEFAULT_DOLLARS_PER_STEP){ //pr = price range
    var lo = rp(pr[0],dollarsPerStep);
    var hi = rp(pr[1],dollarsPerStep);
    var total = 0;
    for(var price=lo; price<hi; price+=dollarsPerStep){
        var p = rp(price, dollarsPerStep)+"_rg";
        total += profile[p] ? profile[p] : 0;
    }
    return total;
}

function getProfileBuckets(pr, profile, nBuckets=32, dollarsPerStep= DEFAULT_DOLLARS_PER_STEP){ //pr = price range
    var bucketRanges = [];
    var dollarsPerBucket = (pr[1]-pr[0])/nBuckets;
    var gray = [128,128,128];
    var green = [0,255,0];
    //var blue = [0,0,255];
    var red = [255,0,0];
    var doQuantizeColors = true;
    var highestVolume = 0;

    for(var price=pr[0];price<pr[1];price+=dollarsPerBucket){
        var prBucket = [price+0,price+dollarsPerBucket]; //price range for bucket
        var volume = getProfileTotalVolumeForPriceRange(prBucket, profile, dollarsPerStep);
        var volumeSigned = getProfileTotalVolumeForPriceRange_redGreen(prBucket, profile, dollarsPerStep);
        var rgb0 = volumeSigned > 0 ? pu.lerpNd(gray, green, volume ? volumeSigned/volume : 0) : pu.lerpNd(gray, red, volume ? -volumeSigned/volume : 0);

        //6 bit colors
        if(doQuantizeColors){
            rgb0=rgb0.map(Math.floor).map(d=>((d>>6)<<6))
        }

        highestVolume = Math.max(highestVolume,volume);

        //var rgb1 = pu.lerpNd(rgb0, )
        bucketRanges.push({
            priceRange: prBucket,
            volume: volume,
            volume_signed: volumeSigned,
            volume_color: rgb0, //rgb color for this bucket
            //volume_colorB: pu.lerpNd(rgb0, blue, )
            volume_color_t: ((volumeSigned > 0 ? volumeSigned/volume : -volumeSigned/volume) + 1.0)/2.0 //param 0...1 for red...green
        });
    }

    bucketRanges=bucketRanges.map(function(b){
        b.volume_normalized = b.volume / highestVolume;
        return b;
    });

    return bucketRanges;
}

function addCandleToProfile(candle, profile = {}, dollarsPerStep=DEFAULT_DOLLARS_PER_STEP){
    var p = rp(candle.close, dollarsPerStep)+"";
    profile[p] = profile[p] || 0;
    profile[p+"_rg"] = profile[p+"_rg"] || 0;
    profile[p+"_rg_norm"] = profile[p+"_rg_norm"] || {pos:1,neg:1,ratio:0};

    profile[p] += candle.volume;
    profile[p+"_rg"] += (candle.open < candle.close ? candle.volume : -candle.volume); //positive/negative summed volume to show red/green coloring
    var wentUp = candle.open < candle.close;
    profile[p+"_rg_norm"].neg += (wentUp ? 0 : candle.volume)
    profile[p+"_rg_norm"].pos += (wentUp ? candle.volume :0)
    profile[p+"_rg_norm"].ratio = profile[p+"_rg_norm"].pos / profile[p+"_rg_norm"].neg; // 1/1 == neutral ; 1/1000 == sales; 1000/1 == buys
    profile[p+"_rg_norm_ratio"] = profile[p+"_rg_norm"].ratio;
    return profile;
}

function addCandlesToProfile(candles, profile={}, dollarsPerStep=DEFAULT_DOLLARS_PER_STEP){
    candles.forEach(function(candle){
        profile = addCandleToProfile(candle,profile, dollarsPerStep);
    });
    return profile;
}

//return len = numberOfSteps * 4
// function profileNormalizeForPrice(profile, pricePt, numberSteps, dollarsPerStep=DEFAULT_DOLLARS_PER_STEP){
//     //var p = rp(candle.close, dollarsPerStep)+"";
//     var res = [];
//     for(var i=-numberSteps; i<numberSteps+1; i++){
//         var p = rp(rp(pricePt,dollarsPerStep) + i*dollarsPerStep, dollarsPerStep)+"";
//         res.push(profile[p] || 0);
//         //res.push(profile[p+"_rg_norm_ratio"] || 1.0);
//     }
//     return res;
// }

function profilePriceRange(profile, dollarsPerStep=DEFAULT_DOLLARS_PER_STEP){
    var bb = pu.boundingBlockOfPts_nd(Object.keys(profile).filter(k=>!k.includes("_rg")).map(k=>[parseFloat(k)]));
    return [bb[0][0],bb[1][0]];
}

function getBucketsPOC(profileBuckets){
    var pr = [].concat(profileBuckets).sort(function(a,b){
        return b.volume-a.volume;
    })[0].priceRange;

    return (pr[1]+pr[0])/2.0;
}

function getPrice_index(profileBuckets, p){

    var res = [].concat(profileBuckets.map(function(pb,i){pb.i=i;return pb;})).filter(function(bucket){
        //console.log(p,bucket);
        return bucket.priceRange[0]<=p && bucket.priceRange[1]>=p;
    });

    if(res.length>0){
        return res[0].i;
    }

    return -1;
}

function getBucketsPOC_index(profileBuckets){
    return [].concat(profileBuckets.map(function(pb,i){pb.i=i;return pb;})).sort(function(a,b){
        return b.volume-a.volume;
    })[0].i;
}

function getProfilePOC(profile){
    var priceTop = Object.keys(profile).filter(k=>!k.includes("_rg")).map(k=>[k,profile[k]])
        .sort(function(a,b){
            return b[1]-a[1];
        })[0][0];
    return parseFloat(priceTop);
}

function vwapDirect(candles, VWAP_POWER=1){
    var totalVolume = 0;
    var totalPrice = 0;
    candles.forEach(function(c){
        totalVolume+=c.volume;
        totalPrice+=c.close*Math.pow(c.volume,VWAP_POWER);
    })
    //console.log({totalPrice,totalVolume});
    return totalPrice/totalVolume;
}

function vwapSeries(candles, windowSize){
    return candles.map(function(c,i){
        var fullWindow = candles.slice(Math.max(0,i-windowSize),i+1);
        return vwapDirect(fullWindow);
    });
}

//var ic = require('infinite-clamp')
//todo this should use "rolling" atr calc'd per-candle
function vwapSeriesNormalized(candles, windowSize, ATR=1.0){  //0...1 --- price is low if < 0.5
    return candles.map(function(c,i){
        var fullWindow = candles.slice(Math.max(0,i-windowSize),i+1);
        var diff = (c.close - vwapDirect(fullWindow))/ATR;
        return diff;//ic.remap(diff);
    });
}

function vwapSeriesNormalized_single(candles, windowSize, ATR=1.0){  //0...1 --- price is low if < 0.5
    var i = candles.length-1;
    var lastCandle = candles[i];
    var fullWindow = candles.slice(Math.max(0,i-windowSize),i+1);
    var diff = (lastCandle.close - vwapDirect(fullWindow))/ATR;
    //console.log({diff,i,lastCandle});
    return diff;//ic.remap(diff);
}

function vwapMultiScale(candles, ATR=1.0){
    var diff0 = vwapSeriesNormalized_single(candles, candles.length, ATR); //60
    var diff1 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/2.0), ATR); //30
    var diff2 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/3.0), ATR); //20
    var diff3 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/4.0), ATR); //15
    var diff4 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/5.0), ATR); //12
    var diff5 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/6.0), ATR); //10
    var diff6 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/12.0), ATR); //5
    var diff7 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/24.0), ATR); //2.5
    var diff8 = vwapSeriesNormalized_single(candles, Math.floor(candles.length/48.0), ATR); //1.25

    return [
        diff0,
        diff1,
        diff2,
        diff3,
        diff4,
        diff5,
        diff6,
        diff7,
        diff8
    ]
}

//todo sep indicator based on sum of signs of multiscale vwaps [as in 03-vwap-scalp.js]

function getProfileVolumeWeightedAveragePrice(profile){
    var volumeSum = 0;
    var priceSumWeighted = 0;
    Object.keys(profile).filter(k=>!k.includes("_rg")).map(k=>[k,profile[k]]).forEach(
        function(price_vol){
            priceSumWeighted += price_vol[1] * parseFloat(price_vol[0]);
            volumeSum += price_vol[1];
        }
    );
    return priceSumWeighted / volumeSum;
}

function getProfileVolumeWeightedAveragePrice_index(profile,profileBuckets){
    var p = getProfileVolumeWeightedAveragePrice(profile);

    var res = [].concat(profileBuckets.map(function(pb,i){pb.i=i;return pb;})).filter(function(bucket){
        //console.log(p,bucket);
        return bucket.priceRange[0]<=p && bucket.priceRange[1]>=p;
    });

    if(res.length>0){
        return res[0].i;
    }
    return -1;
}

// function getProfileValueArea(profile){
//     var poc = getProfilePOC(profile);
//     //TODO 70% area of volume around POC
// }

module.exports = {
    profilePriceRange,
    addCandlesToProfile,
    addCandleToProfile,
    getProfileBuckets,
    getBucketsPOC,
    getProfileVolumeWeightedAveragePrice,
    getProfileVolumeWeightedAveragePrice_index,
    getBucketsPOC_index,
    getProfilePOC,
    getProfileTotalVolumeForPriceRange,
    roundPriceOffToStep,
    getPrice_index,
    vwapDirect,
    vwapSeries,
    vwapSeriesNormalized,
    vwapSeriesNormalized_single,
    vwapMultiScale
}