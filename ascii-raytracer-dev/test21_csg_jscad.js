var art = require('./index.js');

var t2c = require('./triangles-to-csg.js');
const fs = require("fs");
var stl = require('stl');

var triangles = stl.toObject(fs.readFileSync('./Bitey_Reconstructed_5k.stl')).facets.map(function(f){return f.verts});


//var bounds = trianglesBounds(triangles);


const myshape = cube({center: [0,0,0], size: [100, 9, 9]});

var csg_model = t2c.triangles2Csg(triangles);
var new_model = csg_model.intersect(myshape);

var trisAgain = t2c.csg2Triangles(new_model);

var config = {
    tris:trisAgain,
    triangleColors: trisAgain.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    cameraPos: [22,29,-12],
    cameraRot: [2.37,-4.5]
}

art.runScene(config);
