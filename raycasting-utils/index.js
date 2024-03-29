var bvhtree = require('bvh-tree-plus');
var RTREE = require('rbush-3d');

var RECENT_RTREE=null;
var RECENT_BVH = null;

function getBvh(){
    return RECENT_BVH;
}

function getRTree(){
    return RECENT_RTREE;
}

var lastIntPt = null;
var lastIntV = null;
var lastIntDist = 9999;
var Vector = require('./Vector.js');
function traceDf(ray, df, maxSteps = 256, minDist = 0.05){
    var shiftVector = {x: 0, y: 0, z: 0};

    var ray = {point: {x:ray.point.x+shiftVector.x, y:ray.point.y+shiftVector.y, z:ray.point.z+shiftVector.z}, vector: {x:ray.vector.x, y:ray.vector.y, z:ray.vector.z}};
    var pt0 = {x:ray.point.x, y:ray.point.y, z:ray.point.z};
    var rayUnit = Vector.unitVector(ray.vector);

    var dx,dy,dz,s;
    var PIXEL_WIDTH = minDist; //minimum feature size

    for(var i=0; i<maxSteps;i++){

        var dfv = df(ray.point.x,ray.point.y,ray.point.z);

        if(dfv<PIXEL_WIDTH){
            lastIntV=dfv;
            lastIntPt=ray.point;
            dx = pt0.x-ray.point.x;
            dy = pt0.y-ray.point.y;
            dz = pt0.z-ray.point.z;
            lastIntDist = Math.sqrt(dx*dx+dy*dy+dz*dz)
            return lastIntDist; //ray length to reach df
        }else{
            if(dfv<1.0){
                s=dfv*0.5;
                ray.point={x: ray.point.x+rayUnit.x*s, y: ray.point.y+rayUnit.y*s, z: ray.point.z+rayUnit.z*s};
                //ray.point=Vector.add(ray.point,Vector.scale(rayUnit, dfv*0.25));
            }else{
                s=dfv*0.90;
                ray.point={x: ray.point.x+rayUnit.x*s, y: ray.point.y+rayUnit.y*s, z: ray.point.z+rayUnit.z*s};
                //ray.point=Vector.add(ray.point,Vector.scale(rayUnit, dfv-1.0));
            }
        }
    }
    lastIntDist=9999;
    lastIntV=null;
    lastIntPt=null;
    return Infinity;
};

function traceDf_useLine(line, df, maxSteps = 256, minDist = 0.05){
    return traceDf(line2Ray(line), df, maxSteps, minDist);
}


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

var normalizeAndCenterLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var len = (Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    return [[0,0,0],[dx/len, dy/len, dz/len]];
};

function line2Ray(line){
    var p=line[0];
    var dir = normalizeAndCenterLine(line)[1];
    return {
        point: {x:p[0],y:p[1],z:p[2]},
        vector: {x:dir[0],y:dir[1],z:dir[2]}
    }
}

function trianglesTraceFast_useLine(tris, backfaceCulling=true){
    var f = trianglesTraceFast(tris,backfaceCulling);
    return function(line){
        var r = line2Ray(line);
        return f(r);
    };
}

function trianglesTraceFast_returnIndex_useLine(tris, backfaceCulling=true){
    var f = trianglesTraceFast_returnIndex(tris,backfaceCulling);
    return function(line){
        var r = line2Ray(line);
        return f(r);
    };
}

function trianglesTraceFast(tris, backfaceCulling=true){
    var meshTrisFlat = buildFlatList(tris);
    var maxTrianglesPerNode = 2;
    var bvhSkull = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);
    RECENT_BVH = bvhSkull;

    return function(ray){
        var o = ray.point;
        var v = ray.vector;
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
    RECENT_BVH = bvhSkull;

    return function(ray){
        var o = ray.point;
        var v = ray.vector;
        //var backfaceCulling = true;
        var intersectionResult = bvhSkull.intersectRay(o, v, backfaceCulling);
        console.log("RES",intersectionResult);
        var dist = 9999+Math.random();
        var minIndex = -1;
        var minTriangle = null;
        var minPt = null;
        for(var i=0;i<intersectionResult.length;i++){
            //var t = intersectionResult[i].triangle;
            var _o = intersectionResult[i].intersectionPoint;
            var D = lineLength([[_o.x,_o.y,_o.z],[o.x,o.y,o.z]]);//Math.min(dist, triangleDistance([_o.x,_o.y,_o.z], [t[0],t[1],t[2]],[t[3],t[4],t[5]],[t[6],t[7],t[8]]))
            //dist = Math.min(dist,D);
            if(D<dist){
                dist=D;
                minIndex = intersectionResult[i].triangleIndex;
                minTriangle = intersectionResult[i].triangle;
                minPt = _o;
            }
        }

        return {dist: dist, index: minIndex, triangle: minTriangle, pt: minPt};
    }
}

function trianglesTraceFast_colored_useLine(tris, backfaceCulling=true){
    var f = trianglesTraceFast_colored(tris,backfaceCulling);
    return function(line){
        var r = line2Ray(line);
        return f(r);
    };
}

function trianglesTraceFast_colored(tris, backfaceCulling=true){
    var meshTrisFlat = buildFlatList(tris);
    var maxTrianglesPerNode = 2;
    var bvhSkull = new bvhtree.BVH(meshTrisFlat, maxTrianglesPerNode);
    RECENT_BVH = bvhSkull;

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

function sectors2RTree(sos) {
    var theTree = new RTREE.RBush3D(2); //Higher value means faster insertion and slower search, and vice versa.
    theTree.clear();
    var sectorBoxes = sos.map(function (sector) {
        return sector2RTreeObj(sector, 0.0001);
    });
    theTree.load(sectorBoxes);
    RECENT_RTREE=theTree;
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
    var sectorsRTree = sectors2RTree(sectors);
    //RECENT_RTREE=sectorsRTree;
    return function(ray){
        //raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxLen?: number): DistNode;
        var o = ray.point;
        var v = ray.vector;
        var res = sectorsRTree.raycast(o.x,o.y,o.z,v.x,v.y,v.z);
        if(res){
            return res.dist;
        }
        return 9999;
    }
}

function sectorsTraceFast_returnIndex(sectors){
    var sectorsRTree = sectors2RTree(sectors);
    //RECENT_RTREE=sectorsRTree;
    return function(ray){
        //raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxLen?: number): DistNode;
        var o = ray.point;
        var v = ray.vector;
        var res = sectorsRTree.raycast(o.x,o.y,o.z,v.x,v.y,v.z);
        if(res){
            return res.dist;
        }
        return 9999;
    }
}

function sectorsTraceFast_useLine(sectors){
    var f = sectorsTraceFast(sectors);
    return function(line){
        var r = line2Ray(line);
        return f(r);
    };
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

// function flipTriangle(tri){
//     return [tri[0],tri[2],tri[1]];
// }

function sectorsTraceBVH_useLine(sectors){
    var f = sectorsTraceBVH(sectors);
    return function(line){
        var r = line2Ray(line);
        return f(r);
    };
}

function sectorsTraceBVH(sectors){ //similar to sectorsTraceFast but using BHV instead. seems to be slightly slower.
    var tris = [];
    sectors.forEach(function(sector){
        tris.push(...sector2Triangles(sector).map(flipTriangle));
    });
    return trianglesTraceFast(tris);
}

function searchRTreeForSectors(theTree, aabb){
    return theTree.search(sector2RTreeObj(aabb)).map(box => box.sector);
}

//aliases for sane ppl who call aabbs "aabbs"
//i like to incorrectly call them sectors, for unknown reason, out of habit
var aabbsTraceFast = sectorsTraceFast;
var aabbsTraceFast_useLine = sectorsTraceFast_useLine;
var aabbsTraceBVH = sectorsTraceBVH;
var aabbsTraceBVH_useLine = sectorsTraceBVH_useLine;
var aabb2Triangles = sector2Triangles;
var aabbs2RTree = sectors2RTree;
var searchRTreeForAabbs = searchRTreeForSectors;

module.exports = {searchRTreeForAabbs, searchRTreeForSectors, aabbs2RTree, sectors2RTree, traceDf_useLine,traceDf,getBvh, getRTree, aabbsTraceFast, aabbsTraceFast_useLine, aabbsTraceBVH, aabbsTraceBVH_useLine, aabb2Triangles, sector2Triangles, sectorsTraceBVH, sectorsTraceBVH_useLine, sectorsTraceFast, sectorsTraceFast_useLine, trianglesTraceFast, trianglesTraceFast_useLine, trianglesTraceFast_returnIndex, trianglesTraceFast_returnIndex_useLine, trianglesTraceFast_colored_useLine, trianglesTraceFast_colored};