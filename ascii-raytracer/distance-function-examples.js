var jf = require('jsonfile');
var ru = require('./raytrace-utils.js');
var dfu = require('./distance-function-utils.js');

//var stlTris = jf.readFileSync('./Bitey_Reconstructed_rotated_5k_2digit.json');

var _noise = require('noisejs');
var noise = new _noise.Noise();
var Vector = require('./Vector.js');
/*var _NOHIT=-9999;
var _IRSf = new Float32Array(8);
function intersectRaySector(rpos, rdir, sector){//https://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
    _IRSf[0] = (sector[0][0] - rpos.x)/rdir.x;
    _IRSf[1] = (sector[1][0] - rpos.x)/rdir.x;
    _IRSf[2] = (sector[0][1] - rpos.y)/rdir.y;
    _IRSf[3] = (sector[1][1] - rpos.y)/rdir.y;
    _IRSf[4] = (sector[0][2] - rpos.z)/rdir.z;
    _IRSf[5] = (sector[1][2] - rpos.z)/rdir.z;
    _IRSf[6] = Math.max(Math.max(Math.min(_IRSf[0], _IRSf[1]), Math.min(_IRSf[2], _IRSf[3])), Math.min(_IRSf[4], _IRSf[5]));
    _IRSf[7] = Math.min(Math.min(Math.max(_IRSf[0], _IRSf[1]), Math.max(_IRSf[2], _IRSf[3])), Math.max(_IRSf[4], _IRSf[5]));
    return (_IRSf[7] < 0 || _IRSf[6] > _IRSf[7]) ? _NOHIT : _IRSf[6];
}*/

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

var getPointAlongLine_dist = function(line, dist){

    var _t = dist/lineLength(line);

    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    //console.log("before array abuse?", arr);
    //arr["line"]=line;
    //console.log("after array abuse", arr);
    return arr;
};

 // var RBush3D_raycast_loop = function (rtree,ox, oy, oz, dx, dy, dz, maxLen) { //added by dspdog
 //
 //        var newOrigin = [ox,oy,oz];
 //        var currentResult = rtree.raycast(newOrigin[0], newOrigin[1], newOrigin[2], dx, dy, dz, maxLen);
 //        var node = currentResult.node;
 //        var res=[];
 //
 //        while(node){// && currentResult.dist<Infinity){
 //            if(res.indexOf(node)==-1){
 //                res.push(node);
 //            }
 //            newOrigin = getPointAlongLine_dist([newOrigin[0],[newOrigin[0][0]+dx,newOrigin[0][1]+dy,newOrigin[0][2]+dz]], currentResult.dist+0.001);
 //            currentResult = rtree.raycast(newOrigin[0], newOrigin[1], newOrigin[2], dx, dy, dz, maxLen);
 //            node = currentResult.node;
 //        }
 //
 //        return res;
 //        //return this.raycast(ox, oy, oz, dx, dy, dz, maxLen) ;
 //    };

var dfSphere = function(cx,cy,cz,radius){
    return function(x,y,z){
        return Math.sqrt((x-cx)*(x-cx)+(y-cy)*(y-cy)+(z-cz)*(z-cz))-radius;
    }
};

var dfPerlin3D = noise.perlin3;

//var dfPerlin3D = function(x,y,z){
    //return noise.perlin3(x,y,z);
    //return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s+t,y/s,z/s)+0.75) //lava lamp
    //return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s,y/s,z/s)) //planet
//}

const path = require("path");
const stl = require("stl");
const fs = require("fs");


//var SCENE_DF = dfSphere(0,0,0,5);
var dfBlobWorld = function(x,y,z){
    var s = 5.0
    var t = Date.now()/5000;
    return noise.perlin3(x/s+t,y/s,z/s)+0.5; //blobs world
    //return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s+t,y/s,z/s)+0.75) //lava lamp
    //return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s,y/s,z/s)) //planet
}

var dfPlanet = function(x,y,z){
    var s = 5.0
    var t = Date.now()/5000;
    //return noise.perlin3(x/s+t,y/s,z/s)+0.5; //blobs world
    //return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s+t,y/s,z/s)+0.75) //lava lamp
    return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s,y/s,z/s)) //planet
}

var dfLavaLamp = function(x,y,z){
    var s = 5.0
    var t = Date.now()/5000;
    //return noise.perlin3(x/s+t,y/s,z/s)+0.5; //blobs world
    return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s+t,y/s,z/s)+0.75) //lava lamp
    //return Math.max(dfSphere(0,0,0,7)(x,y,z), noise.perlin3(x/s,y/s,z/s)) //planet
}




//var rti = require('ray-triangle-intersection');

//does not work well! leaves lots of gaps (raycast loop func broken?)
// function trianglesTraceFast(tris, radius){
//     var trianglesRTree = triangles2RTree(tris);
//     //var sectorsRTree = sectors2RTree(sectors);//console.log("TRI RTREE?", trisRTree);
//     //var s = radius;
//     return function(ray){
//
//         //raycast(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxLen?: number): DistNode;
//         var o = ray.point;
//         var v = ray.vector;
//         var p = [o.x,o.y,o.z]
//         var _v = [v.x,v.y,v.z];
//         var potentialTris = RBush3D_raycast_loop(trianglesRTree,o.x,o.y,o.z,v.x,v.y,v.z,500)
//             .map(r=>[r.triangle, rti([], p, _v, r.triangle)]).filter(i=>i[1]);//trianglesRTree.raycast(o.x,o.y,o.z,v.x,v.y,v.z);
//         //
//
//         //console.log(potentialTris);
//
//         if(potentialTris.length>0){
//             potentialTris.sort(function(a,b){return lineLength([p,a[1]])-lineLength([p,b[1]])});
//             return lineLength([p,potentialTris[0][1]]);//potentialTris[0][0];
//         }
//
//         // var dist = 9999;
//         // var triDists = potentialTris.map(t=>triangleDistance([o.x,o.y,o.z],t));
//         // //return Math.min(...triDists);
//         // for(var i=0;i<triDists.length;i++){
//         //     dist = Math.min(dist,triDists[i]);
//         // }
//
//         return 9999+Math.random();
//
//         //return res ? res.dist : 9999;
//
//         // var ray = {point: {x:r.point.x+shiftVector.x, y:r.point.y+shiftVector.y, z:r.point.z+shiftVector.z}, vector: {x:r.vector.x, y:r.vector.y, z:r.vector.z}};
//         // var pt0 = {x:r.point.x, y:r.point.y, z:r.point.z};
//         // var rayUnit = Vector.unitVector(ray.vector);
//
//         //return distNode
//         // export interface DistNode {
//         //     dist: number;
//         //     node?: BBox;
//         // }
//
//     }
// }







var maze = [[[0,0,6],[7,1,7]],[[6,0,0],[7,1,6]],[[4,0,4],[5,1,6]],[[0,0,0],[1,1,6]],[[2,0,4],[4,1,5]],[[2,0,2],[3,1,4]],[[4,0,2],[6,1,3]],[[1,0,0],[6,1,1]]];
var mazeMedium = [[[0,0,8],[9,1,9]],[[8,0,0],[9,1,8]],[[6,0,6],[7,1,8]],[[0,0,0],[1,1,8]],[[2,0,6],[5,1,7]],[[4,0,4],[5,1,6]],[[2,0,4],[3,1,6]],[[5,0,4],[8,1,5]],[[6,0,2],[7,1,4]],[[1,0,2],[5,1,3]],[[1,0,0],[8,1,1]]];
var mazeBig = [[[1,0,0],[2,1,1]],[[15,0,4],[16,1,5]],[[1,0,6],[2,1,7]],[[0,0,16],[17,1,17]],[[16,0,0],[17,1,16]],[[14,0,14],[15,1,16]],[[8,0,14],[9,1,16]],[[0,0,0],[1,1,16]],[[10,0,14],[13,1,15]],[[6,0,14],[8,1,15]],[[2,0,14],[5,1,15]],[[12,0,8],[13,1,14]],[[10,0,12],[11,1,14]],[[6,0,6],[7,1,14]],[[2,0,10],[3,1,14]],[[13,0,12],[16,1,13]],[[8,0,12],[10,1,13]],[[4,0,12],[6,1,13]],[[14,0,10],[16,1,11]],[[7,0,10],[11,1,11]],[[3,0,10],[5,1,11]],[[8,0,2],[9,1,10]],[[4,0,2],[5,1,10]],[[13,0,8],[15,1,9]],[[10,0,8],[12,1,9]],[[2,0,6],[3,1,9]],[[10,0,4],[11,1,8]],[[12,0,6],[15,1,7]],[[14,0,4],[15,1,6]],[[11,0,4],[13,1,5]],[[5,0,4],[8,1,5]],[[2,0,4],[4,1,5]],[[12,0,2],[13,1,4]],[[13,0,2],[15,1,3]],[[9,0,2],[11,1,3]],[[6,0,0],[7,1,3]],[[2,0,0],[3,1,3]],[[7,0,0],[16,1,1]],[[3,0,0],[6,1,1]]];

var dfSectors = dfu.sectorsDistFast(mazeBig,10.00);
var dfSectorsTrace = ru.sectorsTraceFast(mazeBig,10.00); //45fps at start w aa
//var dfSectorsTrace = ru.sectorsTraceBVH(mazeBig,10.00); //40fps at start w aa
var dfMaze = function(x,y,z){
    return dfSectors(x,y,z);
    //return sectorStackDistFast(mazeMedium,x,y,z);
}

var dfMazeTrace = dfSectorsTrace;

//var meshTris = trisSwapZY(jf.readFileSync(path.resolve(__dirname, './Bitey_Reconstructed_rotated_5k_2digit.json')));
var meshTris = stl.toObject(fs.readFileSync(path.resolve(__dirname, "Bitey_Reconstructed_5k.stl"))).facets.map(function(f){return f.verts})

function ptSwapZY(p){
    return [p[0],p[2],p[1]];
}

function trisSwapZY(tris){
    return tris.map(function(tri){
        return [
            ptSwapZY(tri[0]),
            ptSwapZY(tri[2]),
            ptSwapZY(tri[1])

        ];
    });
}


var dfSkull = dfu.trianglesDistFast(meshTris, 0.10); //find triangles dist w rtree
//var dfSkullTrace = trianglesTraceFast(meshTris, 10.0);
//
// var dfSkull = sectorsDistFast(meshTris.map(t=>boundingBlockOfPts(t)),10.00);
// var dfSkullTrace = sectorsTraceFast(meshTris.map(t=>boundingBlockOfPts(t),10.00));
//
// // example with simple mesh + bvh of triangles ...



//
// var triangleDistance = require('triangle-distance').triangleDistance;
// var dfSkullBVH = function(x,y,z){ //pretty slow on its own...
//     //  get df by intersect sphere
//     var sphere = {
//       radius: 4,
//       center: [
//         x,y,z
//       ]
//     };
//
//     // var theRes = null;
//     // var attempts = 0;
//     // while(!theRes && attempts<16){
//     //     attempts++;
//     //     sphere.radius*=2;
//     //     var intersectionResult = bvhSkull.intersectSphere(sphere);
//     //
//     //     var dist = 9999+Math.random();
//     //     for(var i=0;i<intersectionResult.length;i++){
//     //          var t = intersectionResult[i].triangle;
//     //          dist = Math.min(dist, triangleDistance([x,y,z], [t[0],t[1],t[2]],[t[3],t[4],t[5]],[t[6],t[7],t[8]]))
//     //          theRes = dist;
//     //     }
//     // }
//     // return dist;
//
//     var intersectionResult = bvhSkull.intersectSphere(sphere);
//     //  //console.log(intersectionResult);
//     //
//     var dist = 9999+Math.random()*0.000001;
//     for(var i=0;i<intersectionResult.length;i++){
//          var t = intersectionResult[i].triangle;
//          dist = Math.min(dist, triangleDistance([x,y,z], [[t[0],t[1],t[2]],[t[3],t[4],t[5]],[t[6],t[7],t[8]]]))
//          //theRes = dist;
//     }
//
//     return dist;
//
//     // intersectSphere() returns an array of intersection result objects, one for each triangle that intersected the ray. Each object contains the following properties:
//     //
//     // triangle the 1D array of vertices such as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
//     // triangleIndex the position of the intersecting triangle in the input triangle array provided to the BVH constructor. Note that only the triangles with their 3 vertices inside the sphere are returned.
// }

var dfSkullTrace = ru.trianglesTraceFast(meshTris);
//
//

module.exports = {dfSphere, dfPerlin3D, dfBlobWorld, dfPlanet, dfLavaLamp, dfSkullTrace, dfSkull, dfMaze, dfMazeTrace};