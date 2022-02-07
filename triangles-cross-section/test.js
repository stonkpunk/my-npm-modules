var fs = require("fs");
var stl = require('stl');
var path = require('path');
var tf = require('./triangle-funcs.js');
var tcs = require('./index.js'); //triangles-cross-section

//load tris from stl
var triangles = stl.toObject(fs.readFileSync(path.join(__dirname,'Bitey_Reconstructed_5k.stl'))).facets.map(function(f){return f.verts});

var t0=Date.now();
var times = 5;
var resTris,resLines;

for(var i=0;i<times;i++){
    var t1=Date.now();
//get cross-sections
    var numSlices = 7;
    var hullMode = false; //get convex-ish hull of tris, with curvature param set by hullCurvature [curvature of 1 gives detailed outline, curvature 9999 is approx convex hull]
    var cleanUpTris = false; //remove triangles that fall outside the original mesh [reduces errors in some cases]
    var hullCurvature = 1; //curvature for convex hull algo (see npm hull.js). set to 1 for detailed outline, or a high number for convex hull
    var skipTriangles = false; //if true, only return line segments, do not triangulate the infill
    var res = tcs.crossSectionsXZ(triangles,numSlices,hullMode,cleanUpTris, hullCurvature,skipTriangles); //add ",false,true)" to do earcut mode instead of hull mode

    resTris = tf.flipTris([].concat(...res.map(r=>r.triangles)));
    resLines = [].concat(...res.map(r=>r.lineSegments));
    console.log(Date.now()-t1);
}

console.log("AVE",(Date.now()-t0)/times);

//now with rtrees...
//no hull, no clean, skip tris true AVE 40.6
//no hull, no clean, skip tris false AVE 56.8
//hull, no clean, skip tris false AVE 84.6
//hull, clean, skip tris false AVE 147

//view result with ascii-raytracer
var art = require('ascii-raytracer');
var config = {
    triangles: resTris,
    //lines:resLines,
    resolution: 64,
    aspectRatio: 1.0,
    cameraMode: 1,
    thickness: 0.10, //line thickness
    mouseControl:true,
    antiAlias: true
}

art.runScene(config);