var art = require('./index.js');

var mstLines = require('./generate-mst-forest.js').generateMstLines(256);

//console.log(mstLines);

var config = {
    lines: mstLines,
    lineColors: mstLines.map(l=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}

art.runScene(config);