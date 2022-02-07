var art = require('./index.js');

var cone2Triangles = require('./cones-to-triangles.js').cone2Triangles;
var dLines = require('./generate-delaunay-lines.js').generateDelaunayLines(24);

var tris = [];

for(var i=0; i<dLines.length; i++){
    tris.push(...cone2Triangles({line: dLines[i], r0: 1, r1: 1}))
}

var config = {
    triangles: tris,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}

art.runScene(config);