var art = require('./index.js');

var trp = require('triangle-random-pts')
var rtu = require('raycasting-utils');
var dfu = require('./distance-function-utils.js');
var lu = require('./lines-utils.js');

var s = 75.0;

var SKIP_SADDLE_CALC = false;
var NUM_ROADS = 256;//1024*4;
var NUM_BUILDINGS = 0;
var PATH_RANDOMIZER = false; //if false, all lines are branching off exisitng lins
var DIRECTION_LIMITER = false; //limit to only directions of starting outline shape
var JITTER_FACTOR = 0.1;
var JITTER_FACTOR_COLOR=0.005;
var JITTER_FACTOR_CURVES = 1.0;
var ATTEMPTS_TO_FIND_MAXPT=32; //for buildings
var ATTEMPTS_TO_FIND_MAXLINE=1024*10; //for roads , decreases 0.75x w/ each road added
var ATTEMPTS_TO_FIND_MAXLINE_minVal=2; //min val it can decrease to
var lowerleft = [0,0,0];
var lowerright = [s,0,0];
var upperleft = [0,0,s];
var upperright = [s,0,s];
var boxLines = [[lowerleft,upperleft],[upperleft, upperright],[ upperright,lowerright],[lowerright,lowerleft]];//sector2LinesEdges([[0.0,0.0,0.0],[s,0.0,s]]);
var boxLinesNoEdges = [];

var SIDES = 6;


var offset =[s,0,s];
var o = offset;
var lines0=lu.createCircleLinesXZ(5, s/2, o);
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


function sample2dcircle(steps,pt,lines, tracer,pullBack = 0.75){
    var s = 0.5;
    var lines_to_raycast = lu.createCircleLinesXZ(steps, s, pt); //lu.caliLines2d();//
    //var boxLinesOrig = JSON.parse(JSON.stringify(boxLines));
    tracer = tracer || rtu.trianglesTraceFast(lu.lines2Triangles(lines), false);
    var distTraced_multi = lines_to_raycast.map(function(line){
        var center = lu.addPts([s,0,s],pt)
        var rayLine = lu.normalizeAndCenterLine([center,line[0]])
        var ray = {
            point:{x:center[0],y:center[1],z:center[2]},
            vector:{x:rayLine[1][0],y:rayLine[1][1],z:rayLine[1][2]},
        };
        return [center, lu.getPointAlongLine_dist([center,line[0]], pullBack*tracer(ray))];
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

var traceAnotherLineCurvy = require('./generate-road-wall-line-2d.js').traceAnotherLine_curvy;

for(var i=0;i<NUM_ROADS;i++){
    traceAnotherLineCurvy(boxLines, boxLinesNoEdges, boxLinesOrig,{JITTER_FACTOR_CURVES, JITTER_FACTOR_COLOR,ATTEMPTS_TO_FIND_MAXLINE, JITTER_FACTOR, PATH_RANDOMIZER, SKIP_SADDLE_CALC});

    console.log('added',i, ATTEMPTS_TO_FIND_MAXLINE)
    ATTEMPTS_TO_FIND_MAXLINE*=0.75;
    ATTEMPTS_TO_FIND_MAXLINE=Math.floor(Math.max(ATTEMPTS_TO_FIND_MAXLINE_minVal,ATTEMPTS_TO_FIND_MAXLINE));
}


var before = boxLines.length;
boxLines = boxLines.filter(l=>lu.lineLength(l)>0.01);
console.log( boxLines.length-before);

var _ = require('underscore');
var chopLines = require('lines-self-chop');
var choppedLines = chopLines(boxLines, 0.01);


var STARTING_COLOR = [1,1,1];
var config = {
    lines: choppedLines.map(function(line){
        line.color = line.color || [Math.random(),Math.random(),Math.random()];
        //console.log("COLOR",line.color);
        return line;
    }),
    //lineColors: boxLines.map(function(line){return [Math.random(),Math.random(),Math.random()]}),
    resolution: 64,
    cameraPos: lu.addPts([0,95.21,0],offset),
    cameraRot: [3.14,-3.14],
    aspectRatio: 1.0,
    cameraMode: 1,
    thickness: 0.25, //line thickness
    mouseControl:false,
    antiAlias: true
}

art.runScene(config);