var ti = require('triangles-index');
var ico = require('icosphere');
var lu = require('./line-utils-basic.js');

function shiftMesh(mesh,shift){mesh.positions = mesh.positions.map(pos=>lu.addPts(pos,shift));return mesh;}
function scaleMesh(mesh,scale){mesh.positions = mesh.positions.map(pos=>lu.scalePt(pos,scale));return mesh;}
function getSphereTrianglesForSkObj(sko){var mesh = shiftMesh(scaleMesh(ico(2),sko.dist),sko.pt);var tris = ti.deindexTriangles_meshView(mesh);return tris;}

var bunny = require('bunny');
var triangles = ti.deindexTriangles_meshView(bunny);
var doBruteForceMode=false; //if true, loop through all triangles instead of using rtree data structure
var preShrink = 1.0; //default 1.0, reduce the sphere diameters by this factor
var overlap = 0.5; //default 0.5, allow spheres to overlap by this factor
var doResample = false; //default false, instead of casting per-triangle, pick random points on the mesh surface
var resamplesTotal = 1000; //default 1000. if doResample is true, this is how many random points get used by the algorithm

//pass raw list of triangles - each triangle is [[x,y,z],[x,y,z].[x,y,z]]
var spheres = require('./index').mesh2Spheres(triangles,overlap,preShrink,doBruteForceMode,doResample,resamplesTotal)

//each sphere is {pt: [x,y,z], dist: radius}

//alternative - feed indexed mesh {cells, positions} directly
//var spheres = require('./index').meshIndexed2Spheres(bunny,overlap,preShrink,doBruteForceMode,resamplesTotal)

console.log(spheres.length,"total spheres added");
var tris = [].concat(...spheres.map(sko=>getSphereTrianglesForSkObj(sko)));
console.log(tris.length,"triangles");

//optionally: visualize with ascii-raytracer
var art = require('ascii-raytracer');
var config = {
    triangles: tris,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}
art.runScene(config);