var fs = require("fs");
var stl = require('stl');
var path = require('path');

//load triangles from stl file
var triangles = stl.toObject(fs.readFileSync(path.join(__dirname,'Bitey_Reconstructed_5k.stl'))).facets.map(function(f){return f.verts});

var getTrianglesMeshEdges = require('./index.js');

//list pf line segments
var edges = getTrianglesMeshEdges(triangles, 45);

//view result with ascii-raytracer
var art = require('ascii-raytracer');
var config = {
    lines:edges,
    resolution: 64,
    aspectRatio: 1.0,
    cameraMode: 1,
    thickness: 0.10, //line thickness
    mouseControl:true,
    antiAlias: true
}

art.runScene(config);