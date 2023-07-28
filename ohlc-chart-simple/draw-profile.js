var pd = require("pixel-draw");
var pu = require('./pt-utils.js');
const vp = require("./volume-profile");
var {kernelDensityEstimate, getRange} = require('kde-simple');

function drawKde(priceRange, config, _canvas){//w=512,h=512, _canvas, renderWidth = 32, bottomPartHeight=32){
    var { w,h, profileBucketsWidth, kdePrices, kdeBandwidthDollars, kdeBandwidthPercent, kdeIsGaussian} = config;
    var canvas = _canvas || pd(w,h);
    var renderWidth = profileBucketsWidth;
    var prices = kdePrices;

    var bottomPartHeight = config.volumeBarsHeight; //todo why does 16 look more correct? //32 is bottom area for volume series from draw-candles.js...
    var _h = h-bottomPartHeight;

    var useTriangularKernel = !kdeIsGaussian; //if false, uses gaussian kernel
    var bandwidth = kdeBandwidthDollars ? kdeBandwidthDollars : (priceRange[1]-priceRange[0])*kdeBandwidthPercent/100.0;


    // console.log("BW",bandwidth);
    // var nBuckets = profileBuckets.length;
    // var bucketHeight = _h/nBuckets;

    var bucketMaxWidth = renderWidth;

    var _prices = prices.map(function(p){return {x:p[0],weight:p[1]||1.0}});
    var kRange = getRange(_prices, bandwidth, useTriangularKernel);

    var yStep = 1.0;
    for(var y=0; y<_h; y+=yStep){
        var __h = yStep;
        var _w = renderWidth;
        var x = w-renderWidth;

        var t = y/_h;
        var priceHere = priceRange[1]-(priceRange[1]-priceRange[0])*t;
        var val = renderWidth * kernelDensityEstimate(_prices, priceHere, bandwidth, useTriangularKernel, kRange);
// console.log({priceHere,val,kRange})
        canvas.drawRectangle(w-renderWidth+renderWidth-val, y, val, __h, config.kdeColor);
    }

    // var blue = [230,230,255];
    // var green = [230,255,230];
    // canvas.drawRectangle(0,_h*(1.0-pocBucketsIndex/nBuckets), w, bucketHeight, blue);
    // if(avPriceIndex>=0){
    //     canvas.drawRectangle(0,_h*(1.0-avPriceIndex/nBuckets), w, bucketHeight, green);
    // }
    //
    // //canvas.drawRectangle(1,_h*(1.0-pocBucketsIndex/nBuckets), 64, bucketHeight, blue);
    //
    // profileBuckets.forEach(function(bucket,i){
    //     var bw = bucketMaxWidth*bucket.volume/volRange[1];
    //     canvas.drawRectangle(w-bw,_h*(1.0-i/nBuckets), bw, bucketHeight, bucket.volume_color);
    // });
    return canvas;
}

function drawProfileBuckets(profile, profileBuckets, w=512,h=512, _canvas=null, config){//renderWidth = 32){
    //bucket
    // {
    //     priceRange: [ 1974.3925, 1999.59 ],
    //     volume: 197703,
    //     volume_signed: 90361,
    //     volume_color: [ 69.49705366130003, 186.04589207042886, 69.49705366130003 ],
    //     volume_color_t: 0.7285271341355468
    // }

    var renderWidth = config.profileBucketsWidth;

    //var pocBucketsPrice = vp.getBucketsPOC(profileBuckets);
    var pocBucketsIndex = vp.getBucketsPOC_index(profileBuckets);
    var avPriceIndex = vp.getProfileVolumeWeightedAveragePrice_index(profile, profileBuckets);

    var bucketsLoHiVolume = profileBuckets.map(function(c) {
        var row = [c.priceRange[0], c.priceRange[1], c.volume]
        return row;
    });

    var lowHiVolBounds = pu.boundingBlockOfPts_nd(bucketsLoHiVolume);
    //var lowHiRange = [lowHiVolBounds[0][0], lowHiVolBounds[1][1]]; //lowest low, highest high
    var volRange = [lowHiVolBounds[0][2], lowHiVolBounds[1][2]];
    //if(volRange[0]==volRange[1]){volRange[1]++;}

    //var lowHiDiff = lowHiRange[1] - lowHiRange[0];

    var canvas = _canvas || pd(w,h);

    var bottomPartHeight = 32; //32 is bottom area for volume series from draw-candles.js...
    var _h = h-bottomPartHeight;

    var nBuckets = profileBuckets.length;
    var bucketHeight = _h/nBuckets;

    var bucketMaxWidth = renderWidth;

    var blue = [230,230,255];
    var green = [230,255,230];
    canvas.drawRectangle(0,_h*(1.0-pocBucketsIndex/nBuckets), w, bucketHeight, blue);
    if(avPriceIndex>=0){
        canvas.drawRectangle(0,_h*(1.0-avPriceIndex/nBuckets), w, bucketHeight, green);
    }

    //canvas.drawRectangle(1,_h*(1.0-pocBucketsIndex/nBuckets), 64, bucketHeight, blue);

    profileBuckets.forEach(function(bucket,i){
        var bw = bucketMaxWidth*bucket.volume/volRange[1];
        canvas.drawRectangle(w-bw,_h*(1.0-i/nBuckets), bw, bucketHeight, bucket.volume_color);
    });
    return canvas;
}

function drawProfileBucketsFlowSingle(profileBuckets, columnX, w=512,h=512, _canvas=null, lastPrice, skipDraw=false, drawPriceAsWhite=true){
    //bucket
    // {
    //     priceRange: [ 1974.3925, 1999.59 ],
    //     volume: 197703,
    //     volume_signed: 90361,
    //     volume_color: [ 69.49705366130003, 186.04589207042886, 69.49705366130003 ],
    //     volume_color_t: 0.7285271341355468
    // }

    //var pocBucketsPrice = vp.getBucketsPOC(profileBuckets);
    var priceIndex = vp.getPrice_index(profileBuckets,lastPrice)

    //console.log(priceIndex)
    var pocBucketsIndex = vp.getBucketsPOC_index(profileBuckets);
    //var avPriceIndex = vp.getProfileVolumeWeightedAveragePrice_index(profile, profileBuckets);

    var bucketsLoHiVolume = profileBuckets.map(function(c) {
        var row = [c.priceRange[0], c.priceRange[1], c.volume]
        return row;
    });

    var lowHiVolBounds = pu.boundingBlockOfPts_nd(bucketsLoHiVolume);
    //var lowHiRange = [lowHiVolBounds[0][0], lowHiVolBounds[1][1]]; //lowest low, highest high
    var volRange = [lowHiVolBounds[0][2], lowHiVolBounds[1][2]];
    //if(volRange[0]==volRange[1]){volRange[1]++;}

    //var lowHiDiff = lowHiRange[1] - lowHiRange[0];

    var canvas = _canvas || pd(w,h);

    var bottomPartHeight = 32; //32 is bottom area for volume series from draw-candles.js...
    var _h = h-bottomPartHeight;

    var nBuckets = profileBuckets.length;


    //console.log(nBuckets);
    var bucketHeight = _h/nBuckets;

    var bucketMaxWidth = bucketHeight;
    var white = [255,255,255];

    //var blue = [230,230,255];
    //var green = [230,255,230];
    // canvas.drawRectangle(0,_h*(1.0-pocBucketsIndex/nBuckets), w, bucketHeight, blue);
    // if(avPriceIndex>=0){
    //     canvas.drawRectangle(0,_h*(1.0-avPriceIndex/nBuckets), w, bucketHeight, green);
    // }
    //canvas.drawRectangle(1,_h*(1.0-pocBucketsIndex/nBuckets), 64, bucketHeight, blue);

    var RAW_COLORS = [];

    var bw = 1;//bucketMaxWidth;//*bucket.volume/volRange[1];

    // for(var i=0;i<profileBuckets.length;i++){
    //     var bucket = profileBuckets[i];
    //     var vr = (bucket.volume-volRange[0]) / (volRange[1]-volRange[0]);
    //     bucket.volume_color[2] = Math.floor(vr*255);
    //     if(!skipDraw){
    //         canvas.drawRectangle(w-columnX*bw,_h*(1.0-i/nBuckets), bw, bucketHeight, bucket.volume_color);
    //     }
    //     RAW_COLORS.push(bucket.volume_color);
    // }

    profileBuckets.forEach(function(bucket,i){
        // indicate height with blue channel
        var vr = (bucket.volume-volRange[0]) / (volRange[1]-volRange[0]);
        bucket.volume_color[2] = Math.floor(vr*255);
        if(!skipDraw){
            canvas.drawRectangle(w-columnX*bw,_h*(1.0-i/nBuckets), bw, bucketHeight, bucket.volume_color);
        }
        RAW_COLORS.push(bucket.volume_color);
    });

    if(!skipDraw && drawPriceAsWhite){
        canvas.drawRectangle(w-columnX*bw,_h*(1.0-priceIndex/nBuckets), bw, bucketHeight, white);
    }
    RAW_COLORS[Math.floor(RAW_COLORS.length*(1.0-priceIndex/nBuckets))] = white;

    canvas.RAW_COLORS = RAW_COLORS;

    return canvas;
}

function drawProfileBucketsFlow(profileBucketsArr, w=512,h=512, _canvas=null, skipDraw=false, drawPriceAsWhite=true){
    var RAW_COLORS = [];
    profileBucketsArr.forEach(function(pb,i){
        var c = drawProfileBucketsFlowSingle(pb,profileBucketsArr.length-i,w,h,_canvas,pb.lastPrice, skipDraw, drawPriceAsWhite)
        RAW_COLORS.push(c.RAW_COLORS);
    });
    _canvas.RAW_COLORS = RAW_COLORS;
    return _canvas;
}


module.exports = {drawKde, drawProfileBuckets, drawProfileBucketsFlow};