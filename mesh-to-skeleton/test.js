var mts = require('./index.js');
var getSkeletalPoints = mts.getSkeletalPoints;
var getSkeletalPoints_resampled = mts.getSkeletalPoints_resampled;

var bunny = require('bunny'); //stanford bunny model
var ti = require('triangles-index'); //tool to convert indexed model into triangle list
var triangles = ti.deindexTriangles_meshView(bunny); //raw list of triangles

console.log(triangles.length);

//each triangle is an array of 3 pts [[x,y,z],[x,y,z],[x,y,z]]
var skeletonPtsObjs = getSkeletalPoints(triangles); //list of {pt: [x,y,z], dist: distanceToSurface}

var skeletonPtsObjs_resampled = getSkeletalPoints_resampled(triangles, 500);

//optionally: visualize with ascii-raytracer
var art = require('ascii-raytracer');
var config = {
    pts: skeletonPtsObjs_resampled.map(r=>r.pt),
    ptSize: 0.05,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}
art.runScene(config);