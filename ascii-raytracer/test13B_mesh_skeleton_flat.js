var createSDF = require('sdf-polygon-2d');
var points = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
];
//
// // pass an array of polygons, including polygons with holes
// var sample = createSDF([points]);
// console.log(sample(0, 0)) // -10
// console.log(sample({ x: 10, y: 0 })) // 0
// console.log(sample([20, 0])) // 10


var art = require('./index.js');

var trp = require('triangle-random-pts')
var rtu = require('./raytrace-utils.js');
var dfu = require('./distance-function-utils.js');
var lu = require('./lines-utils.js');

var s = 75.0;

var NUM_ROADS = 0;
var NUM_BUILDINGS = 0;
var ATTEMPTS_TO_FIND_MAXPT=32;
var ATTEMPTS_TO_FIND_MAXLINE=512;
var lowerleft = [0,0,0];
var lowerright = [s,0,0];
var upperleft = [0,0,s];
var upperright = [s,0,s];
var boxLines = [[lowerleft,upperleft],[upperleft, upperright],[ upperright,lowerright],[lowerright,lowerleft]];//sector2LinesEdges([[0.0,0.0,0.0],[s,0.0,s]]);
var boxLinesNoEdges = [];

var SIDES = 6;


var offset = [s*3,0,s*3];
var boxLines = lu.reverseLines(lu.createStarLinesXZ(10, s/2, offset));

//boxLines.unshift([lu.getPointAlongLine(boxLines[0],0.0),lu.getPointAlongLine(boxLines[0],0.00001)]); //TODO hack to fix pt-in-poly function

var boxLines2 = lu.createCircleLinesXZ(32, s/8, offset)//.map(L=>[L[1],L[0]]);
//boxLines2.reverse();

boxLines=lu.addExtraPt(boxLines);
boxLines2=lu.addExtraPt(boxLines2);

boxLines.push(...boxLines2);

//boxLines = [].concat(lu.createStarLinesXZ(12, s/2, offset),lu.createCircleLinesXZ(16, s/8, offset)); //lu.caliLines2d();//
var boxLinesOrig = JSON.parse(JSON.stringify(boxLines));


function tris2Skeleton(tris, bothSides = true){

    var tpts = tris.map(function(t){return{x:t[0][0],y:t[0][2]}});
    var TDF= createSDF([tpts]);//dfu.trianglesDistFast(tris,32.0);

    var _tdf = dfu.trianglesDistFast(tris,32.0);
    //var _tdf=  function(x,y,z){return Math.abs(TDF(x,z));} //slower than other one

    var tracer = rtu.trianglesTraceFast(tris, false);

    var skeletonPts = [];

    var RND_PTS_PER_TRI = 16;
    var RND_TRI_ROUNDS = 16;

    for(var j=0;j<RND_TRI_ROUNDS;j++)
    tris.forEach(function(tri){
        var nl = lu.triangleNormalLines(tri);
        var antinorm = bothSides ? nl[Math.random() > 0.5 ? 0 : 1] : nl[1];
        var nl0 = [lu.getPointAlongLine(antinorm,0.01), antinorm[1]]
        var n = lu.normalizeAndCenterLine(nl0); //anti-normal direction
        //var antinormDirSmall = lu.scalePt(n[1],0.01);

        //quasiRandomPointsInTriangle
        var rp = trp.randomPointsInTriangle(tri,RND_PTS_PER_TRI);//.map(pt=>lu.addPts(pt,antinormDirSmall));

        rp.forEach(function(_rp){

            //var _rp = rp[Math.floor(Math.random()*rp.length)];
            var nj = lu.normalizePt(lu.jitterPt(n[1],1.00));
            var __rp = lu.getPointAlongLine([_rp,lu.addPts(_rp,nj)],0.01)

            var ray = {
                point:{x:__rp[0],y:__rp[1],z:__rp[2]},
                vector:{x:nj[0],y:nj[1],z:nj[2]},
            };
            var distTraced = tracer(ray);
            var midPtDist = distTraced/2.0;

            var sampleLine = [__rp,lu.addPts(__rp,nj)];
            sampleLine[1]=lu.getPointAlongLine_dist(sampleLine,distTraced);
            var midPtTracedPt = lu.lineDFHighPt(sampleLine,_tdf).pt;
            //var midPtTracedPt = lu.lineMidPt(sampleLine);

            skeletonPts.push(midPtTracedPt);
        });

    });

    return skeletonPts;

    // var n = lu.normalizeAndCenterLine(randomPathLine2);
    // var ray = {
    //     point:{x:randomPathLine2[0][0],y:randomPathLine2[0][1],z:randomPathLine2[0][2]},
    //     vector:{x:n[1][0],y:n[1][1],z:n[1][2]},
    // };
    //var distTraced = tracer(ray);//Math.min(tracer(ray),s/2);

}


var skeletonPts = tris2Skeleton(lu.lines2Triangles(boxLines),false);

var skeletonLines = skeletonPts.map(pt=>[lu.addPts(pt,[Math.random(),0,Math.random()]),lu.addPts(pt,[0.25,0,0.25])]);
boxLines.push(...skeletonLines.filter(l=>lu.lineInsideShape(l,boxLines)))
//console.log("SKELETON", skeleton);



var config = {
    lines: boxLines,
    //colors: boxLines.map(function(line){return [Math.random(),Math.random(),Math.random()]});
    resolution: 64,
    cameraPos: lu.addPts([-3.81,95.21,4.26],offset),
    cameraRot: [3.14,-3.14],
    aspectRatio: 1.0,
    cameraMode: 1,
    thickness: 0.34, //line thickness
    antiAlias: true,
    mouseControl:false,
}

art.runScene(config);