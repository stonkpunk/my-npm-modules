//https://www.npmjs.com/package/bvh-tree-plus
// var point = [12, 30, 50]; // coordinates as [x, y, z]
// var isInside = bvh.isInside( pos );
//
// var meshTrisFlat = buildFlatList(tris);
// var maxTrianglesPerNode = 2;
// var bvhSkull = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);
//
var bsb = require('./bvh-sub-blocks.js');

function boundingBlockOfPts(sop){
    var bb = [sop[0],sop[0]];
    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        var xLo = Math.min(p[0],bb[0][0]);
        var xHi = Math.max(p[0],bb[1][0]);
        var yLo = Math.min(p[1],bb[0][1]);
        var yHi = Math.max(p[1],bb[1][1]);
        var zLo = Math.min(p[2],bb[0][2]);
        var zHi = Math.max(p[2],bb[1][2]);
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }
    return bb;
};

function boundingBlockOfVertices(vertices){
    var bb = [[vertices[0].x,vertices[0].y,vertices[0].z],[vertices[0].x,vertices[0].y,vertices[0].z]];
    for(var i=0; i<vertices.length;i++){
        var p = vertices[i];
        var xLo = Math.min(p.x,bb[0][0]);
        var xHi = Math.max(p.x,bb[1][0]);
        var yLo = Math.min(p.y,bb[0][1]);
        var yHi = Math.max(p.y,bb[1][1]);
        var zLo = Math.min(p.z,bb[0][2]);
        var zHi = Math.max(p.z,bb[1][2]);
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }
    return bb;
};

function buildFlatList(bunny){
    var arr = [];
    bunny.cells.forEach(function(cell){
        arr.push(
            bunny.positions[cell[0]][0],bunny.positions[cell[0]][1],bunny.positions[cell[0]][2],
            bunny.positions[cell[1]][0],bunny.positions[cell[1]][1],bunny.positions[cell[1]][2],
            bunny.positions[cell[2]][0],bunny.positions[cell[2]][1],bunny.positions[cell[2]][2]
        );
    });
    return new Float32Array(arr);
}

function buildFlatListThreeGeom(geom){
    var arr = [];
    geom.faces.forEach(function(face){
        arr.push(
            geom.vertices[face.a].x,geom.vertices[face.a].y,geom.vertices[face.a].z,
            geom.vertices[face.b].x,geom.vertices[face.b].y,geom.vertices[face.b].z,
            geom.vertices[face.c].x,geom.vertices[face.c].y,geom.vertices[face.c].z
        );
    });
    return new Float32Array(arr);
}

var bvhtree = require('bvh-tree-plus');

function meshBoundingBlock(bunny){
    return boundingBlockOfPts(bunny.positions)
}

function threeGeomBoundingBlock(threeGeom){
    return boundingBlockOfVertices(threeGeom.vertices)
}

function meshToBvh(bunny){
    var maxTrianglesPerNode = 2;
    var flatList = buildFlatList(bunny);
    var bvh = new bvhtree.BVH(flatList, maxTrianglesPerNode);
    return bvh;
}

function threeGeomToBvh(threeGeom){
    var maxTrianglesPerNode = 2;
    var flatList = buildFlatListThreeGeom(threeGeom);
    var bvh = new bvhtree.BVH(flatList, maxTrianglesPerNode);
    return bvh;
}

function meshToVoxels(mesh, iters=3, cubifyBounds=true, edgesOnly=true, volumeOnly = false, dontSubdivideEnclosedBlocks=false, mergeAfter = false, meshBvh = null, preIters=0){
    var meshBounds = cubifyBounds ? bsb.blockToCube(meshBoundingBlock(mesh)) : meshBoundingBlock(mesh);
    meshBvh = meshBvh || meshToBvh(mesh);
    var voxels = bsb.getSubBlocksForBlockIterated(meshBounds,iters,meshBvh,edgesOnly,volumeOnly,dontSubdivideEnclosedBlocks,mergeAfter);
    return voxels;
}

function createVoxels(bounds, resolutionXYZ) {
    const [minPoint, maxPoint] = bounds;
    const [numVoxelsX, numVoxelsY, numVoxelsZ] = resolutionXYZ;

    const voxelSizeX = (maxPoint[0] - minPoint[0]) / numVoxelsX;
    const voxelSizeY = (maxPoint[1] - minPoint[1]) / numVoxelsY;
    const voxelSizeZ = (maxPoint[2] - minPoint[2]) / numVoxelsZ;

    const voxels = [];

    for (let x = 0; x < numVoxelsX; x++) {
        for (let y = 0; y < numVoxelsY; y++) {
            for (let z = 0; z < numVoxelsZ; z++) {
                const voxelMinX = minPoint[0] + x * voxelSizeX;
                const voxelMinY = minPoint[1] + y * voxelSizeY;
                const voxelMinZ = minPoint[2] + z * voxelSizeZ;

                const voxelMaxX = voxelMinX + voxelSizeX;
                const voxelMaxY = voxelMinY + voxelSizeY;
                const voxelMaxZ = voxelMinZ + voxelSizeZ;

                const voxel = [
                    [voxelMinX, voxelMinY, voxelMinZ],
                    [voxelMaxX, voxelMaxY, voxelMaxZ]
                ];

                voxels.push(voxel);
            }
        }
    }

    return voxels;
}

function calculateBoundingBoxMidpoint(bounds) {
    const [minPoint, maxPoint] = bounds;

    const midX = (minPoint[0] + maxPoint[0]) / 2;
    const midY = (minPoint[1] + maxPoint[1]) / 2;
    const midZ = (minPoint[2] + maxPoint[2]) / 2;

    const midpoint = [midX, midY, midZ];
    return midpoint;
}

// function jitterPoint(point, factor) {
//     const jitteredPoint = point.map(coord => {
//         const randomDisplacement = (Math.random() - 0.5) * factor;
//         return coord + randomDisplacement;
//     });
//
//     return jitteredPoint;
// }

var mergeBoxes = require('merge-boxes').mergeBoxes;

function meshToVoxelsNaive(mesh, resolutionXYZ=[32,32,32], cubifyBounds=true, mergeAfter = false, meshBvh = null){
    var meshBounds = cubifyBounds ? bsb.blockToCube(meshBoundingBlock(mesh)) : meshBoundingBlock(mesh);
    meshBvh = meshBvh || meshToBvh(mesh);
    var allBlocks = createVoxels(meshBounds, resolutionXYZ) ; //todo subdivide entire bounds by resolutoin xyz, then sift by bvh.isInside(pt)
    // var voxels = bsb.getSubBlocksForBlockIterated(meshBounds,iters,meshBvh,edgesOnly,volumeOnly,dontSubdivideEnclosedBlocks,mergeAfter);
    var blocks = allBlocks.filter(function(s){
        var center = calculateBoundingBoxMidpoint(s)
        return meshBvh.isInside(center);
    });

    if(mergeAfter){
        mergeBoxes(blocks);
    }

    return blocks;
}

function threeGeomToVoxels(geom, iters=3, cubifyBounds=true, edgesOnly=true, volumeOnly = false, dontSubdivideEnclosedBlocks=false, mergeAfter = false, geomBvh = null){
    var meshBounds = cubifyBounds ? bsb.blockToCube(threeGeomBoundingBlock(geom)) : threeGeomBoundingBlock(geom);
    geomBvh = geomBvh || threeGeomToBvh(geom);
    var voxels = bsb.getSubBlocksForBlockIterated(meshBounds,iters,geomBvh,edgesOnly,volumeOnly,dontSubdivideEnclosedBlocks,mergeAfter);
    return voxels;
}

function getSubBlocksGridForBlock(fullBlock, miniBlockSizeXYZ){
    var minX = fullBlock[0][0];
    var minY = fullBlock[0][1];
    var minZ = fullBlock[0][2];
    var maxX = fullBlock[1][0];
    var maxY = fullBlock[1][1];
    var maxZ = fullBlock[1][2];
    var blockW = maxX-minX;
    var blockH = maxY-minY;
    var blockD = maxZ-minZ;
    var res = [];
    for(var x=minX;x<maxX;x+=miniBlockSizeXYZ[0]){
        for(var y=minY;y<maxY;y+=miniBlockSizeXYZ[1]){
            for(var z=minZ;z<maxZ;z+=miniBlockSizeXYZ[2]){
                res.push([[x,y,z],[x+miniBlockSizeXYZ[0],y+miniBlockSizeXYZ[1],z+miniBlockSizeXYZ[2]]])
            }
        }
    }
    return res;
}

//todo version of meshToVoxels using this function [more stable...]
function getSubBlocksGridForBlock(fullBlock, miniBlockSizeXYZ){
    var minX = fullBlock[0][0];
    var minY = fullBlock[0][1];
    var minZ = fullBlock[0][2];
    var maxX = fullBlock[1][0];
    var maxY = fullBlock[1][1];
    var maxZ = fullBlock[1][2];
    var blockW = maxX-minX;
    var blockH = maxY-minY;
    var blockD = maxZ-minZ;
    var res = [];
    for(var x=minX;x<maxX;x+=miniBlockSizeXYZ[0]){
        for(var y=minY;y<maxY;y+=miniBlockSizeXYZ[1]){
            for(var z=minZ;z<maxZ;z+=miniBlockSizeXYZ[2]){
                res.push([[x,y,z],[x+miniBlockSizeXYZ[0],y+miniBlockSizeXYZ[1],z+miniBlockSizeXYZ[2]]])
            }
        }
    }
    return res;
}

function boundingBlockOfMesh(bunny){
    return boundingBlockOfPts(bunny.positions)
}

module.exports = {meshToVoxelsNaive, boundingBlockOfPts, boundingBlockOfMesh, meshToVoxels, threeGeomToVoxels, meshToBvh, threeGeomToBvh, meshBoundingBlock, threeGeomBoundingBlock};
