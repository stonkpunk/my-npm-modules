var fs = require("fs");
var st = require('./index.js');

//triangles have format [ [x,y,z], [x,y,z], [x,y,z] ]

var triangles = require('triangles-index').deindexTriangles_meshView(require('bitey'));//stl.toObject(fs.readFileSync('./Bitey_Reconstructed_5k.stl')).facets.map(f=>f.verts);
var simplifiedTriangles = st.simplify(triangles,0.125,true); //result will have 0.125x as many triangles...

var config = {
    triangles: simplifiedTriangles,
    cameraPos: [45.82,22.11,61.08],
    cameraRot: [1.87,-2.25],
    aspectRatio: 4/3,
    screenShotDir: "/Users/user/Desktop/"
}

require('ascii-raytracer').runScene(config);