var RTREE = require('rbush-3d');

function sector2RTreeObj(sector,_rad){
    var rad = _rad || 0.0001;
    const item = {
        minX: sector[0][0]-rad,
        minY: sector[0][1]-rad,
        minZ: sector[0][2]-rad,
        maxX: sector[1][0]+rad,
        maxY: sector[1][1]+rad,
        maxZ: sector[1][2]+rad,
        sector: sector
    };
    return item;
}

function boundingBlockOfPts(sop){
    //var eps = 0.001;
    var bb = [sop[0],sop[0]];

    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        var xLo = Math.min(Math.min(p[0],bb[0][0]), Math.min(p[0],bb[0][0]));
        var xHi = Math.max(Math.max(p[0],bb[1][0]), Math.max(p[0],bb[1][0]));
        var yLo = Math.min(Math.min(p[1],bb[0][1]), Math.min(p[1],bb[0][1]));
        var yHi = Math.max(Math.max(p[1],bb[1][1]), Math.max(p[1],bb[1][1]));
        var zLo = Math.min(Math.min(p[2],bb[0][2]), Math.min(p[2],bb[0][2]));
        var zHi = Math.max(Math.max(p[2],bb[1][2]), Math.max(p[2],bb[1][2]));
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }

    return bb;
};

function triangleBoundingBlock(tri){
    return boundingBlockOfPts([tri[0],tri[1],tri[2]]);
}

function triangle2RTreeObj(triangle, _rad){
    var rad = _rad || 0.0;
    var sector = triangleBoundingBlock(triangle);
    const item = {
        minX: sector[0][0]-rad,
        minY: sector[0][1]-rad,
        minZ: sector[0][2]-rad,
        maxX: sector[1][0]+rad,
        maxY: sector[1][1]+rad,
        maxZ: sector[1][2]+rad,
        triangle: triangle
    };
    return item;
}

function triangles2RTree(tris){
    if(!RTREE)console.log("RTREE library not found! import rtree.js");
    var theTree = new RTREE.RBush3D(2);
    theTree.clear();
    var triangles = tris;//threeGeom2TrianglesArrs(geom);
    var triangleBoxes = triangles.map(t=>triangle2RTreeObj(t, 0.0));
    theTree.load(triangleBoxes);
    return theTree;
}

var bvhtree = require('bvh-tree-plus');

function trianglesFlatten(tris){
    var arr = [];
    tris.forEach(function(tri){
        arr.push(tri[0][0],tri[0][1],tri[0][2],  tri[1][0],tri[1][1],tri[1][2],  tri[2][0],tri[2][1],tri[2][2]);
    });
    return new Float32Array(arr);
}

function triangles2BvhTree(tris){
    var meshTrisFlat = trianglesFlatten(tris);
    var maxTrianglesPerNode = 2;
    var theBvh = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);
    return theBvh;
}


//note this returns a VALUE not a function
var triangleDistance = require('triangle-distance').triangleDistance_arr;

function trianglesDistance(tris, radius, rtree){
    var trianglesRTree = rtree || triangles2RTree(tris);//console.log("TRI RTREE?", trisRTree);
    var s = radius;
    return function(x,y,z){
        var potentialTris = trianglesRTree.search(sector2RTreeObj([[x,y,z],[x,y,z]],s)).map(s=>s.triangle);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);
        if(potentialTris.length>0){
            var dist = 9999+Math.random();
            var triDists = potentialTris.map(t=>triangleDistance([x,y,z],t));
            //return Math.min(...triDists);
            for(var i=0;i<triDists.length;i++){
                dist = Math.min(dist,triDists[i]);
            }
            return dist;
        }

        return 9999+Math.random();
    }
}

function trianglesDistance_signed(tris, radius, rtree, bvh_tree){
    var trianglesRTree = rtree || triangles2RTree(tris);
    var trianglesBvhTree = bvh_tree || triangles2BvhTree(tris);

    var unsignedDistFunc = trianglesDistance(tris, radius, trianglesRTree);
    return function(x,y,z){
        var distUnsigned = unsignedDistFunc(x,y,z);
        var sign = trianglesBvhTree.isInside([x,y,z]) ? -1 : 1;
        return distUnsigned * sign;
    }
}

function trianglesIntersectingAABB(tris, aabb, rtree){
    var trianglesRTree = rtree || triangles2RTree(tris);//console.log("TRI RTREE?", trisRTree);
    var potentialTris = trianglesRTree.search(sector2RTreeObj(aabb,0.0001)).map(s=>s.triangle);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);
    return potentialTris;
}

module.exports = {trianglesIntersectingAABB, trianglesDistance, trianglesDistance_signed, triangles2RTree, triangles2BvhTree, trianglesFlatten};