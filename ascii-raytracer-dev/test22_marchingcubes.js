var art = require('./index.js');

var ti = require('triangles-index');
var dfe = require('./distance-function-examples.js');

 var t0=Date.now();

var isosurface = require("isosurface")
var RES = 32; // marching cubes resolution
var WS = 8; // world size - bounds of df

var trisIndexed = isosurface.marchingCubes([RES,RES,RES], dfe.dfBlobWorldStatic, [[0,0,0],[WS,WS,WS]]);

console.log("build took",Date.now()-t0);

function scalePt(pt,s){return [pt[0]*s,pt[1]*s,pt[2]*s];}
function scaleTri(tri,s){return tri.map(p=>scalePt(p,s));}

var tris = ti.deindexTriangles_meshView(trisIndexed).map(t=>scaleTri(t,50));

tris = require('simplify-triangles').simplify(tris,0.125);

var config = {
    tris:tris,
    triangleColors: tris.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    cameraPos: [22,29,-12],
    cameraRot: [1.63,-5.7]
}

art.runScene(config);
