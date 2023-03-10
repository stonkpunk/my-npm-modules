var mb = require('./index.js');

var m2v = require('mesh-to-voxels');
var bunny = require('bunny'); //mesh has format {cells, positions}

var voxels = m2v.meshToVoxels(bunny);

console.log("start len", voxels.length);

mb.mergeBoxes(voxels);

console.log("greedy result", voxels.length);

//todo try dynamic programming version