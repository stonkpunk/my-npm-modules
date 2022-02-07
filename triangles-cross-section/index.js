var tti = require('triangle-triangle-intersection');
var earcut = require('earcut');
var chunkArray = require('chunk-array').chunks;
const boundingBlockOfPts = require("./bounding-block-points.js");
const lf = require("./line-funcs.js");
var sl = require('./sort-lines.js');
var tf = require('./triangle-funcs.js');
var dfu = require('./distance-function-utils.js');

//var trianglesRTree = null;//triangles2RTree(tris);//console.log("TRI RTREE?", trisRTree);
// var s = radius;
// return function(x,y,z){
//     var color=[0,1.0,0];
//     var potentialTris = trianglesRTree.search(sector2RTreeObj([[x,y,z],[x,y,z]],s)).map(s=>s.triangle);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);
//

function trianglesCrossSectionY(tris,y, hullMode=true, cleanUpTris=true, hullCurvature=1, cleanUpTries=1, trianglesRTree=null, skipTriangles=false){
    var s = 9999;//slicingTriangleSize;
    /*
    a
    |\
    | \
    |  c
    | /
    |/
    b
    */

    var pA = [-s,y,-s];
    var pB = [-s,y,s];
    var pC = [s,y,0];
    var planeTri = [pA,pB,pC];

    var potentialTris = (trianglesRTree ? trianglesRTree.search(dfu.sector2RTreeObj([[-s,y-0.001,-s],[s,y+0.001,s]],s)).map(s=>s.triangle) : tris);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);

    var crossSegs = potentialTris.map(tri=>tti(tri,planeTri)).filter(t=>t);

    if(crossSegs.length==0){
        return null;
    }

    var pts = hullMode ? sl.lines2PtsListHull(crossSegs, hullCurvature) : sl.lines2PtsList(crossSegs);
    var ptsList2d = pts.map(pt=>[pt[0],pt[2]])
    var ptsListFlat2d = [].concat(...ptsList2d);

    var ptsList3d = pts.map(pt=>[pt[0],y,pt[2]])
    //var ptsListFlat3d = [].concat(...ptsList3d);

    var e2d_tris = [];

    if(!skipTriangles){
        e2d_tris = chunkArray(earcut(ptsListFlat2d,null,2).map(i=>ptsList3d[i]),3);

        if(cleanUpTris){
            var tries = cleanUpTries;
            e2d_tris = tf.removeDegenTris(e2d_tris.concat(tf.flipTris(e2d_tris)), tris, tries);
        }
    }

    return {lineSegments: crossSegs, ptsList:pts, triangles: e2d_tris};//, index: linesIndexed};
}

function crossSectionsXZ(tris,numSlices=5, hullMode=true, cleanUpTris=true, hullCurvature=1, skipTriangles=false){
    var trianglesRTree = dfu.triangles2RTree(tris);
    var bb = boundingBlockOfPts([].concat(...tris));
    var resAll = [];
    var eps = 0.001;
    for(var i=0;i<=numSlices+eps;i++){
        var x = i==0?-eps*2:eps/2;
        var yCoord = lf.getPointAlongLine(bb,i/numSlices-x)[1];
        var res = trianglesCrossSectionY(tris,yCoord,hullMode,cleanUpTris, hullCurvature,1,trianglesRTree,skipTriangles); //add ",false,true)" to do earcut mode instead of hull mode
        if(res){
            resAll.push(res);
        }
    }
    return resAll;
}

module.exports.crossSectionXZ = trianglesCrossSectionY;
module.exports.crossSectionsXZ = crossSectionsXZ;