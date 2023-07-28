
var m2v = require('./index.js');
var bunny = require('bunny');
//meshToVoxels(mesh, iters=3, cubifyBounds=true, edgesOnly=true, volumeOnly = false, dontSubdivideEnclosedBlocks=false, mergeAfter = false, meshBvh = null){

var voxels = m2v.meshToVoxelsNaive(bunny,[32,32,32],true,true)

//meshToVoxels(mesh, iters=3, cubifyBounds=true, edgesOnly=true, volumeOnly = false, dontSubdivideEnclosedBlocks=false, mergeAfter = false, meshBvh = null, preIters=0)
//slower, simpler, more reliable:
//meshToVoxelsNaive(mesh, resolutionXYZ=[32,32,32], cubifyBounds=true, mergeAfter = false, meshBvh = null)

console.log("VOXELS", voxels); //each voxel is axis-aligned bounding box [[minX,minY,minZ],[maxX,maxY,maxZ]]

//view result with ascii-raytracer

var art = require('ascii-raytracer');

var config = {
    boxes: voxels,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    antiAlias:false
}

art.runScene(config);
