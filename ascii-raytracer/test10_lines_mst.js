var art = require('./index.js');

var mstLines = require('./generate-mst-forest.js').generateMstLines(64);

var config = {
    lines: mstLines,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);