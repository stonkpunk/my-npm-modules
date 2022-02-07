var tdf = require('./index.js'); //triangles-distance-fast
var fs = require("fs");
var stl = require('stl');
var path = require('path');

//load tris from stl
var triangles = stl.toObject(fs.readFileSync(path.join(__dirname,'Bitey_Reconstructed_5k.stl'))).facets.map(function(f){return f.verts});

var rtreeCached = tdf.triangles2RTree(triangles);

//make distance function
var df = tdf.trianglesDistance(triangles,20.0, rtreeCached);
var dfs = tdf.trianglesDistance_signed(triangles,20.0, rtreeCached);

//use it
var dist = df(0,0,0);
var dist_signed = dfs(0,0,0);
console.log(dist); //2.2391352461280922
console.log(dist_signed); //-2.2391352461280922

//returns >9999 if nothing found

var s = 999;
var sliceBox = [[-s,-0.01,-s],[s,0.01,s]];
var trianglesGettingSliced = tdf.trianglesIntersectingAABB(triangles, sliceBox, rtreeCached);

console.log(trianglesGettingSliced.length, "tris touch box");
