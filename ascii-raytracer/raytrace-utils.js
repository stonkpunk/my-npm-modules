var bvhtree = require('bvh-tree-plus');

function buildFlatList(tris){
    var arr = [];
    tris.forEach(function(tri){
        arr.push(tri[0][0],tri[0][1],tri[0][2],  tri[1][0],tri[1][1],tri[1][2],  tri[2][0],tri[2][1],tri[2][2]);
    });
    return new Float32Array(arr);
}

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function trianglesTraceFast(tris, backfaceCulling=true){
    var meshTrisFlat = buildFlatList(tris);
    var maxTrianglesPerNode = 2;
    var bvhSkull = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);

    return function(ray){
        var o = ray.point;
        var v = ray.vector;
        //var backfaceCulling = true;
        var intersectionResult = bvhSkull.intersectRay(o, v, backfaceCulling);

        var dist = 9999+Math.random();
        for(var i=0;i<intersectionResult.length;i++){
             //var t = intersectionResult[i].triangle;
             var _o = intersectionResult[i].intersectionPoint;
             var D = lineLength([[_o.x,_o.y,_o.z],[o.x,o.y,o.z]]);//Math.min(dist, triangleDistance([_o.x,_o.y,_o.z], [t[0],t[1],t[2]],[t[3],t[4],t[5]],[t[6],t[7],t[8]]))
             dist = Math.min(dist,D);
        }


        return dist;
    }
}

function trianglesTraceFast_returnIndex(tris, backfaceCulling=true){
    var meshTrisFlat = buildFlatList(tris);
    var maxTrianglesPerNode = 2;
    var bvhSkull = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);

    return function(ray){
        var o = ray.point;
        var v = ray.vector;
        //var backfaceCulling = true;
        var intersectionResult = bvhSkull.intersectRay(o, v, backfaceCulling);

        var dist = 9999+Math.random();
        var minIndex = -1;
        for(var i=0;i<intersectionResult.length;i++){
            //var t = intersectionResult[i].triangle;
            var _o = intersectionResult[i].intersectionPoint;
            var D = lineLength([[_o.x,_o.y,_o.z],[o.x,o.y,o.z]]);//Math.min(dist, triangleDistance([_o.x,_o.y,_o.z], [t[0],t[1],t[2]],[t[3],t[4],t[5]],[t[6],t[7],t[8]]))
            //dist = Math.min(dist,D);
            if(D<dist){
                dist=D;
                minIndex = intersectionResult.triangleIndex;
            }

        }


        return {dist: dist, index: minIndex};
    }
}

function trianglesTraceFast_colored(tris, backfaceCulling=true){
    var meshTrisFlat = buildFlatList(tris);
    var maxTrianglesPerNode = 2;
    var bvhSkull = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);

    return function(ray){
        var o = ray.point;
        var v = ray.vector;
        //var backfaceCulling = true;
        var intersectionResult = bvhSkull.intersectRay(o, v, backfaceCulling);

        var dist = 9999+Math.random();
        var minColor = [0,0,1];
        for(var i=0;i<intersectionResult.length;i++){
            //var t = intersectionResult[i].triangle;
            var _o = intersectionResult[i].intersectionPoint;
            var D = lineLength([[_o.x,_o.y,_o.z],[o.x,o.y,o.z]]);//Math.min(dist, triangleDistance([_o.x,_o.y,_o.z], [t[0],t[1],t[2]],[t[3],t[4],t[5]],[t[6],t[7],t[8]]))
            dist = Math.min(dist,D);

            if(D<dist){
                dist=D;
                minColor=tris[intersectionResult[i].triangleIndex].color || minColor;
            }

        }

        return [dist, minColor];
    }
}


var RTREE = require('rbush-3d');
const {BBox} = require("rbush-3d");

function sectors2RTree(sos) {
    if (!RTREE) console.log("RTREE library not found! import rtree.js");
    var theTree = new RTREE.RBush3D(2); //Higher value means faster insertion and slower search, and vice versa.
    theTree.clear();
    var sectorBoxes = sos.map(function (sector) {
        return sector2RTreeObj(sector, 0.0001);
    });
    theTree.load(sectorBoxes);
    return theTree;

    //rtree.js
    //intersectOp = theTree.raycast(rndPt[0],rndPt[1],rndPt[2],theDir[0],theDir[1],theDir[2],2000);
    //if(intersectOp && intersectOp.dist < Infinity)

    //var nearbyLines = theTree.search(sector2RTreeObj(pt2Sector(candidates[0],1.0),neighborRad)).map(box => box.origLine);
}

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

function sectorsTraceFast(sectors){
    var sectorsRTree = sectors2RTree(sectors);//console.log("TRI RTREE?", trisRTree);
    //var s = radius;
    return function(ray){

        //raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxLen?: number): DistNode;
        var o = ray.point;
        var v = ray.vector;
        var res = sectorsRTree.raycast(o.x,o.y,o.z,v.x,v.y,v.z);

        if(res){//console.log("DIST",res.dist);
            //var _lastIntPt = Vector.unitVector(v);
            //lastIntPt = {x:_lastIntPt.x,y:_lastIntPt.y,z:_lastIntPt.z};
            return res.dist;
        }
        //lastIntPt = {x:0,y:0,z:0};
        return 9999;

        //return res ? res.dist : 9999;

        // var ray = {point: {x:r.point.x+shiftVector.x, y:r.point.y+shiftVector.y, z:r.point.z+shiftVector.z}, vector: {x:r.vector.x, y:r.vector.y, z:r.vector.z}};
        // var pt0 = {x:r.point.x, y:r.point.y, z:r.point.z};
        // var rayUnit = Vector.unitVector(ray.vector);

        //return distNode
        // export interface DistNode {
        //     dist: number;
        //     node?: BBox;
        // }

    }
}


function createDistortionObjFromSector(s){
    return {
        p000: [s[0][0], s[0][1], s[0][2]],
        p001: [s[0][0], s[0][1], s[1][2]],
        p010: [s[0][0], s[1][1], s[0][2]],
        p011: [s[0][0], s[1][1], s[1][2]],
        p100: [s[1][0], s[0][1], s[0][2]],
        p101: [s[1][0], s[0][1], s[1][2]],
        p110: [s[1][0], s[1][1], s[0][2]],
        p111: [s[1][0], s[1][1], s[1][2]],
    }
}

function sector2Triangles(sector){
    var d = createDistortionObjFromSector(sector);
    var tris = [
        [d.p010, d.p001, d.p000], //xlo 0
        [d.p010, d.p011, d.p001], //xlo 1
        [d.p111, d.p100, d.p101], //xhi 0
        [d.p111, d.p110, d.p100], //xhi 1
        [d.p001, d.p100, d.p000], //ylo 0
        [d.p001, d.p101, d.p100], //ylo 1
        [d.p111, d.p010, d.p110], //yhi 0
        [d.p111, d.p011, d.p010], //yhi 1
        [d.p110, d.p000, d.p100], //zlo 0
        [d.p110, d.p010, d.p000], //zlo 1
        [d.p011, d.p101, d.p001], //zhi 0
        [d.p011, d.p111, d.p101]  //zhi 1
    ];

    return tris;
}

function flipTriangle(tri){
    return [tri[0],tri[2],tri[1]];
}

function sectorsTraceBVH(sectors){ //similar to sectorsTraceFast but using BHV instead. seems to be slightly slower.
    var tris = [];
    sectors.forEach(function(sector){
        tris.push(...sector2Triangles(sector).map(flipTriangle));
    });
    return trianglesTraceFast(tris);
}

module.exports = {sectorsTraceFast, trianglesTraceFast, trianglesTraceFast_colored, trianglesTraceFast_returnIndex, sectorsTraceBVH};