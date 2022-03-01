var fmcvl = require('./fast-marching-cubes-voxel-list.js');
var dfsb = require('./df-sub-blocks.js');

function powerOfTwo(x) {
    return (Math.log(x)/Math.log(2)) % 1 === 0;
}

function marchingCubesFast(RES, POTENTIAL, WORLD_BOUNDS){
    if(!powerOfTwo(RES)){
        throw 'resolution must be power of 2';
    }
    var ITERS = Math.floor(Math.log2(RES)-1);
    var blocks = dfsb.getSubBlocksForBlockIteratedDFunc_edgesOnly(WORLD_BOUNDS, ITERS, POTENTIAL);
    var tris = fmcvl.marchingCubes(POTENTIAL, blocks); //{faces, vertices}
    return tris;
}

//TODO maybe calculate hausdorff dimension ?

module.exports = {
    getSubBlocksRecursive: dfsb.getSubBlocksForBlockIteratedDFunc_edgesOnly,
    marchingCubes: marchingCubesFast,
    marchingCubesVoxelList: fmcvl.marchingCubes
}