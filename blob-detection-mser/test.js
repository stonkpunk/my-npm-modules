var MSER = require('./index.js');

var mser = new MSER({
    delta: 2,
    minArea: 0.001,
    maxArea: 0.5,
    maxVariation: 0.5,
    minDiversity: 0.33
});

var imageData = require('image-sync').read('./lorem-ipsum.jpg');

var rects = mser.extract(imageData).map(function(region) {
    return region.rect; // use only regions rect
});

rects = mser.mergeRects(rects); //merge results

//draw results to image
rects.map(function(rect){
    var rgba = [255,0,0,255];
    mser.drawRectOutline(rect, rgba, imageData)
});

//save resulting image
imageData.saveAs("./output.png")
