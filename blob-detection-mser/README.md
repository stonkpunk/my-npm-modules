# blob-detection-mser

NPM version of Sylvain Foucher's Javascript implementation of [Maximally Stable Extremal Regions](https://en.wikipedia.org/wiki/Maximally_stable_extremal_regions) (MSER) algorithm, with some small changes.

## Install

```bash
$ npm install blob-detection-mser
```

## Description

This implementation is intended for realtime MSER detection in Node.js, using an object similar to canvas ImageData - `{data: [R,G,B,A, R,G,B,A, ...], width, height}` .
For algorithm parameters, please read [this article](http://stackoverflow.com/questions/17647500/exact-meaning-of-the-parameters-given-to-initialize-mser-in-opencv-2-4-x).
The extract method returns an array with detected regions.

## Usage

```javascript
var MSER = require('blob-detection-mser');

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
```

![input](https://i.imgur.com/6pfuUVa.jpg)

^ input 

![output](https://i.imgur.com/4YXJVD1.jpg)

^ output

## See Also
- [bitbucket repo for original mser library](https://slvnfchr@bitbucket.org/slvnfchr/mser.git)
- [github repo for original mser library](https://github.com/slvnfchr/mser)
