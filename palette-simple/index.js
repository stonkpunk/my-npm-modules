function chunkArray (arr, len) { //see https://stackoverflow.com/questions/8495687/split-array-into-chunks
    var chunks = [], i = 0, n = arr.length;
    while (i < n) {chunks.push(arr.slice(i, i += len));}
    return chunks;
}

function unchunkArray (arrChunks) {
    var res = [];
    arrChunks.forEach(function(chunk){res.push(...chunk);});
    return res;
}

var skmeans = require("skmeans");

function imgPalette(imgData, numberOfColors, skipBuildImg=false){ //imgData = [r,g,b,a,r,g,b,a] uint8's
    var chunksRgb = chunkArray(imgData,4).map(f=>[f[0],f[1],f[2]]); //ignore alpha
    //var t0=Date.now();
    var result = skmeans(chunksRgb, numberOfColors); //, "kmpp" 2441, without 1866
    //console.log(Date.now()-t0);
    var dataPalettized = skipBuildImg ? [] : unchunkArray(result.idxs.map(i=>[result.centroids[i][0],result.centroids[i][1],result.centroids[i][2],255].map(Math.floor)));//unchunkArray();
    return {
        palette: result.centroids.map(c=>c.map(Math.floor)),
        data: dataPalettized
    };
}

module.exports = {imgPalette}