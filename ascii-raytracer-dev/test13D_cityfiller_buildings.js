var art = require('./index.js');

var trp = require('triangle-random-pts')
var rtu = require('raycasting-utils');
var dfu = require('./distance-function-utils.js');
var lu = require('./lines-utils.js');

var s = 75.0;

var THICKNESS = 0.25; //line thickness
var SKIP_SADDLE_CALC = false;
var NUM_ROADS = 256;//1024*4;
var NUM_BUILDINGS = 0;
var PATH_RANDOMIZER = false; //if false, all lines are branching off exisitng lins
var DIRECTION_LIMITER = false; //limit to only directions of starting outline shape
var JITTER_FACTOR = 0.1;
var JITTER_FACTOR_COLOR=0.1;
var ATTEMPTS_TO_FIND_MAXPT=32; //for buildings
var ATTEMPTS_TO_FIND_MAXLINE=1024*10; //for roads , decreases 0.75x w/ each road added
var ATTEMPTS_TO_FIND_MAXLINE_minVal=32; //min val it can decrease to
var lowerleft = [0,0,0];
var lowerright = [s,0,0];
var upperleft = [0,0,s];
var upperright = [s,0,s];
var boxLines = [[lowerleft,upperleft],[upperleft, upperright],[ upperright,lowerright],[lowerright,lowerleft]];//sector2LinesEdges([[0.0,0.0,0.0],[s,0.0,s]]);
var boxLinesNoEdges = [];

var SIDES = 6;


var offset =[s,0,s];
var o = offset;
var lines0=lu.createCircleLinesXZ(37, s/2, o);
var lines1 = lu.createStarLinesXZ(10, s/3, o);
lines0=lu.addExtraPt(lines0);
lines1=lu.addExtraPt(lines1);
boxLines = [].concat(lines0,lines1); //lu.caliLines2d();//


var boxLinesOrig = JSON.parse(JSON.stringify(boxLines));

var boxLinesDirections = boxLinesOrig.map(bl=> lu.normalizeAndCenterLine(bl));

function ptInsideBox(pt, boxSize){
    var eps = 0.1;
    return pt[0]>=-eps && pt[0]<=boxSize+eps &&
           pt[2]>=-eps && pt[2]<=boxSize+eps
}


function sample2dcircle(steps,pt,lines, tracer,pullBack = 0.5){
    var v = 0.5;
    var lines_to_raycast = lu.createCircleLinesXZ(steps, s, pt); //lu.caliLines2d();//
    //var boxLinesOrig = JSON.parse(JSON.stringify(boxLines));
    //trianglesTraceFast_returnIndex
    tracer = tracer || rtu.trianglesTraceFast(lu.lines2Triangles(lines), false);
    var distTraced_multi = lines_to_raycast.map(function(line){
        var center = pt;//lu.addPts([v,0,v],pt)
        var rayLine = lu.normalizeAndCenterLine([center,line[0]])
        var ray = {
            point:{x:center[0],y:center[1],z:center[2]},
            vector:{x:rayLine[1][0],y:rayLine[1][1],z:rayLine[1][2]},
        };
        var t = tracer(ray);
        return [center, lu.getPointAlongLine_dist([center,line[0]], t*pullBack)];//, t.index];
    });//tracer(ray);//Math.min(tracer(ray),s/2);
    return distTraced_multi;
}
//
// function traceFromLine(line,t,allLines){
//     var ray = {
//         point:{x:_startPt[0],y:_startPt[1],z:_startPt[2]},
//         vector:{x:n[1][0],y:n[1][1],z:n[1][2]},
//     };
//     var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(boxLines), false);
//     var distTraced = tracer(ray);//Math.min(tracer(ray),s/2);
// }

//console.log("SKELETON", skeleton);

var traceAnotherLine = require('./generate-road-wall-line-2d.js').traceAnotherLine;
var detectBuildingPtGroups = require('./detect-building-or-room-centers.js');

//function detectBuilding





function getHiPt(){
    var solDf = dfu.linesDistFast(boxLines);
    var dfv = -9999;
    var hipt = null;

    for(var i=0; i<ATTEMPTS_TO_FIND_MAXPT;i++){
        var pt = rndPt();
        if(lu.lineInsideShape([pt,pt],boxLinesOrig)){
            var dfvc = solDf(...pt);
            if(dfvc>dfv){
                dfv=dfvc;
                hipt = pt;
            }
        }
    }
    return hipt;
}

function addRndLoop(pt){
    var resLinesAccum=[];
    var resLines = sample2dcircle(64,pt ,boxLines.concat(resLinesAccum),null);
    var resLinesLoop = resLines.map(function(line,i){
        var nextLine = resLines[(i+1)%resLines.length];
        return [line[1],nextLine[1]];
    });

    var simped = lu.simplifyLines2d(resLinesLoop, 0.01);

    console.log("SIMP",simped.length, resLinesLoop.length);

    resLinesAccum.push(...simped);

    var res = resLinesAccum.filter(line=>lu.lineInsideShape(line,boxLinesOrig));

    return res;
}



// var hipt = getHiPt();
// addRndLoop(hipt);
// traceAnotherLine(boxLines);



for(var i=0;i<NUM_ROADS;i++){

    traceAnotherLine(boxLines, boxLinesNoEdges, boxLinesOrig,{JITTER_FACTOR_COLOR,ATTEMPTS_TO_FIND_MAXLINE, JITTER_FACTOR, PATH_RANDOMIZER, SKIP_SADDLE_CALC});
    console.log('added',i, ATTEMPTS_TO_FIND_MAXLINE)
    ATTEMPTS_TO_FIND_MAXLINE*=0.75;
    ATTEMPTS_TO_FIND_MAXLINE=Math.floor(Math.max(ATTEMPTS_TO_FIND_MAXLINE_minVal,ATTEMPTS_TO_FIND_MAXLINE));

}

//


//boxLines.push(...resLinesAccum.filter(line=>lu.lineInsideShape(line,boxLinesOrig)));





//TODO x10 -- pick random pt from lines existing so far, trace new line
//


var pn = require('./get-points-neighbors.js');
//const chopLines = require("./lines-self-cut.js");



//boxLines.push(...detectBuildingPtPairs(buildingPts, boxLines).lines);



var chopLines = require('lines-self-chop');
//const simplify = require("simplify-path"); //seems to improve results
boxLines = chopLines(boxLines, 0.01);


var res = detectBuildingPtGroups(boxLines, boxLinesOrig);


console.log("CENTERS", res.centers.length);

// var lines1 = res.lines;
// boxLines.push(...lines1);

var buildingTris = [];




res.centers.forEach(function(bp,i){
    var color = [Math.random(),Math.random(),Math.random()];
    //boxLines.push(...lu.pt2XLines(bp,1.0))
    var buildingLines = lu.simplifyLines2d(addRndLoop(bp)); //lines for 1 building
    //boxLines.push(...buildingLines);
    var height = Math.random()*Math.random()*20.0
    buildingTris.push(...lu.lines2PrismTris(buildingLines, color, height));
})

buildingTris.push(...lu.lines2ConesTriangles(boxLines, THICKNESS))

// for(var i=0;i<NUM_BUILDINGS;i++){
//     //var ol = lu.randomOrthoLineFromSetOfLines(boxLines);
//     hipt = getHiPt();
//     addRndLoop(hipt);
// }

//var chopLines = require('./lines-self-cut.js');

//console.log("CHOP LINES", chopLines(boxLines));

//console.log("POINTS", buildingPts.length, "MIDS", pairMidPts.length);

var STARTING_COLOR = [1,1,1];
var config = {
    // lines: boxLines.map(function(line){
    //     line.color = lu.brightenColor(line.color || STARTING_COLOR,0.5);//[Math.random(),Math.random(),Math.random()];
    //     //console.log("COLOR",line.color);
    //     return line;
    // }),
    tris: buildingTris.map(function(tri){
        tri.color = lu.jitterColorF(tri.color || [Math.random(),Math.random(),Math.random()],0.1);
        return tri;
    }),
    //lineColors: boxLines.map(function(line){return [Math.random(),Math.random(),Math.random()]}),
    resolution: 64,
    //37.33,28.05,76.33|p2.19,t-5.94
    cameraPos: [37.33,28.05,76.33],//lu.addPts([0,95.21,0],offset),
    cameraRot: [2.19,(-5.94+Math.PI*3)%(Math.PI*2)],
    aspectRatio: 1.0,
    cameraMode: 1,
    thickness: THICKNESS, //line thickness
    mouseControl:true,
    antiAlias: true
}

art.runScene(config);