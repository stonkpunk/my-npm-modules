
var m2v = require('./index.js');
var bunny = require('bunny');
var voxels = m2v.meshToVoxels(bunny)
console.log("VOXELS", voxels); //each voxel is axis-aligned bounding box [[minX,minY,minZ],[maxX,maxY,maxZ]]

//view result with ascii-raytracer

var art = require('ascii-raytracer');

var config = {
    boxes: voxels,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    antiAlias:true
}

art.runScene(config);
