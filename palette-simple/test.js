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

var imgPalette = require('./index.js').imgPalette;
var img = require('image-sync').read('./cat.png');

var numberOfColors = 8;

//imgPalette(data, numberOfColors, skipBuildImage=false) //data is flat uint8 array [r,g,b,a,r,g,b,a ... ]
var dataPalettized = imgPalette(img.data, numberOfColors); //returns {palette, data}

var theColorPalette = dataPalettized.palette;
console.log(theColorPalette);

img.data = dataPalettized.data;
img.saveAs('./cat2.png');




