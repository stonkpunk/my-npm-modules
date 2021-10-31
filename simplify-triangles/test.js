var fs = require("fs");
var stl = require("stl");
var st = require('./simplify-tris-fast.js');

//triangles have format [ [x,y,z], [x,y,z], [x,y,z] ]

var triangles = stl.toObject(fs.readFileSync('./Bitey_Reconstructed_5k.stl')).facets.map(f=>f.verts);
var simplifiedTriangles = st.simplifyTrisFast(triangles,0.125,true); //result will have 0.125x as many triangles...

var config = {
    triangles: simplifiedTriangles,
    cameraPos: [45.82,22.11,61.08],
    cameraRot: [1.87,-2.25],
    aspectRatio: 4/3,
    screenShotDir: "/Users/user/Desktop/"
}

require('ascii-raytracer').runScene(config);