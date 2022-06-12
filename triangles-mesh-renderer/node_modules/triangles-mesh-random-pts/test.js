var meshRndPts = require('./index.js');

//here we generate 5000 random points on the surface of the stanford bunny mesh
//each result has format {pt: [x,y,z], normal: [x,y,z], normalLine: [[x,y,z],[x,y,z]], triangleIndex: int}

var bunny = require("bunny");
var results = meshRndPts.randomPtsNormalsForMeshIndexed(bunny,500);

//randomPtsNormalsForMesh(tris, numberPts) is similar but takes a list of triangles and indexes them automatically
//where each triangle = [[x,y,z],[x,y,z],[x,y,z]]

//view the result with ascii-raytracer

var art = require('ascii-raytracer');
var config = {
    thickness:0.05, //line rendering thickness
    lines: results.map(r=>r.normalLine),
    lineColors: results.map(r=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:false,
    cameraPos: [-6.63,11.11,16.56],
    cameraRot: [1.93,-7.47]
}
art.runScene(config);
