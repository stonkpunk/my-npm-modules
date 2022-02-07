function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function triSides(t){
    return [
        lineLength([t[0],t[1]])+0.000001,
        lineLength([t[1],t[2]])+0.000001,
        lineLength([t[2],t[0]])+0.000001
    ]
}

function triRatio(tri){
    var sides = triSides(tri);
    return Math.max(sides[0]/sides[1], sides[0]/sides[2], sides[1]/sides[2],
        sides[1]/sides[0], sides[2]/sides[0], sides[2]/sides[1]);
}

function tris2Lines(tris){
    var lines = [];
    tris.forEach(function(t){
        lines.push([t[0],t[1]]);
        lines.push([t[1],t[2]]);
        lines.push([t[0],t[2]]);
    });
    return lines;
}

function flipTris(tris){
    return tris.map(function(t){
        return [t[0],t[2],t[1]];
    });
}

function triangleCenter(t){
    return [
        (t[0][0]+t[1][0]+t[2][0])/3.0,
        (t[0][1]+t[1][1]+t[2][1])/3.0,
        (t[0][2]+t[1][2]+t[2][2])/3.0
    ]
}

// function ptIsInsideMeshECC(meshTris, pt, rtreeTris){
//     //TODO for this to work we need to filter by triangles that actually hit the aabb's [rn returns tris whose own aabb's hit the aabbs, bigger set than the correct set]
//     var rtree = rtreeTris || tdf.triangles2RTree(meshTris);
//     var s = 9999;
//     var _s=0;
//     var voteX_isInside = tdf.trianglesIntersectingAABB(meshTris, [pt,[pt[0]+s, pt[1]+_s,pt[2]+_s]],rtree).length % 2;// = 1 if pt inside mesh
//     var voteY_isInside = tdf.trianglesIntersectingAABB(meshTris, [pt,[pt[0]+_s,pt[1]+s, pt[2]+_s]],rtree).length % 2;
//     var voteZ_isInside = tdf.trianglesIntersectingAABB(meshTris, [pt,[pt[0]+_s,pt[1]+_s,pt[2]+s]],rtree).length % 2;
//     return (voteX_isInside+voteY_isInside+voteZ_isInside)>1;
// }

var rtp = require('triangle-random-pts');
var bvhtree = require('bvh-tree-plus');

function buildFlatList(tris){
    var arr = [];
    tris.forEach(function(tri){
        arr.push(tri[0][0],tri[0][1],tri[0][2],  tri[1][0],tri[1][1],tri[1][2],  tri[2][0],tri[2][1],tri[2][2]);
    });
    return new Float32Array(arr); //or just do [].concat(...[].concat(...tris))
}

function removeDegenTris(tris, meshTris, tries=1){
    var triangles = buildFlatList(meshTris);
    var maxTrianglesPerNode = 2;
    var bvh = new bvhtree.BVH(triangles, maxTrianglesPerNode);

    function isNonDegenTri(tri){
        var pts = tries>1 ? rtp.randomPointsInTriangle(tri, tries) : [triangleCenter(tri)];
        var ptsInside = pts.filter(pt=>bvh.isInside( pt ));//ptIsInsideMeshECC(meshTris,pt,rtree));
        return ptsInside.length==tries; /*triRatio(tri)<100 &&*/
    }

    return tris.filter(isNonDegenTri)
}

module.exports = {removeDegenTris, tris2Lines, triSides, lineLength, flipTris, triangleCenter};