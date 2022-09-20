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

function meshToVoxels(mesh, iters=3, cubifyBounds=true, edgesOnly=true, volumeOnly = false, dontSubdivideEnclosedBlocks=false, mergeAfter = false, meshBvh = null){
    var meshBounds = cubifyBounds ? bsb.blockToCube(meshBoundingBlock(mesh)) : meshBoundingBlock(mesh);
    meshBvh = meshBvh || meshToBvh(mesh);
    var voxels = bsb.getSubBlocksForBlockIterated(meshBounds,iters,meshBvh,edgesOnly,volumeOnly,dontSubdivideEnclosedBlocks,mergeAfter);
    return voxels;
}

function threeGeomToVoxels(geom, iters=3, cubifyBounds=true, edgesOnly=true, volumeOnly = false, dontSubdivideEnclosedBlocks=false, mergeAfter = false, geomBvh = null){
    var meshBounds = cubifyBounds ? bsb.blockToCube(threeGeomBoundingBlock(geom)) : threeGeomBoundingBlock(geom);
    geomBvh = geomBvh || threeGeomToBvh(geom);
    var voxels = bsb.getSubBlocksForBlockIterated(meshBounds,iters,geomBvh,edgesOnly,volumeOnly,dontSubdivideEnclosedBlocks,mergeAfter);
    return voxels;
}

module.exports = {meshToVoxels, threeGeomToVoxels, meshToBvh, threeGeomToBvh, meshBoundingBlock, threeGeomBoundingBlock};
