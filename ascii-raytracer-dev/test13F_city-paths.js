var art = require('./index.js');

// var trp = require('triangle-random-pts')
// var rtu = require('./raytrace-utils.js');
var dfu = require('./distance-function-utils.js');
var lu = require('./lines-utils.js');

var s = 75.0;

var SKIP_SADDLE_CALC = false;
var NUM_ROADS = 64;//1024*4;
var NUM_BUILDINGS = 0;
var PATH_RANDOMIZER = false; //if false, all lines are branching off exisitng lins
var DIRECTION_LIMITER = false; //limit to only directions of starting outline shape
var JITTER_FACTOR = 0.1;
var JITTER_FACTOR_COLOR=0.5;
var ATTEMPTS_TO_FIND_MAXPT=32; //for buildings
var ATTEMPTS_TO_FIND_MAXLINE=1024*10; //for roads , decreases 0.75x w/ each road added
var ATTEMPTS_TO_FIND_MAXLINE_minVal=2; //min val it can decrease to
var lowerleft = [0,0,0];
var lowerright = [s,0,0];
var upperleft = [0,0,s];
var upperright = [s,0,s];
var boxLines = [[lowerleft,upperleft],[upperleft, upperright],[ upperright,lowerright],[lowerright,lowerleft]];//sector2LinesEdges([[0.0,0.0,0.0],[s,0.0,s]]);
var boxLinesNoEdges = [];

var offset =[s,0,s];
var o = offset;
var lines0=lu.createCircleLinesXZ(5, s/2, o);
var lines1 = lu.createStarLinesXZ(10, s/3, o);
lines0=lu.addExtraPt(lines0);
lines1=lu.addExtraPt(lines1);
boxLines = [].concat(lines0,lines1); //lu.caliLines2d();//


var boxLinesOrig = JSON.parse(JSON.stringify(boxLines));



var traceAnotherLine = require('./generate-road-wall-line-2d.js').traceAnotherLine;


for(var i=0;i<NUM_ROADS;i++){

    traceAnotherLine(boxLines, boxLinesNoEdges, boxLinesOrig,{JITTER_FACTOR_COLOR,ATTEMPTS_TO_FIND_MAXLINE, JITTER_FACTOR, PATH_RANDOMIZER, SKIP_SADDLE_CALC});

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



//test18
var sp = require('./pts-shortest-path.js');
var nres = lu.lines2PtsWithNeighbors(choppedLines);
//console.log("LINEs2Pts",nres.map(pt=>pt.neighbors.length));

var interpLines = require('lines-path-interpolate');
//var interpLines = require('./lines-interp.js');

var _ = require('underscore');
const {shiftLine} = require("./lines-utils");
function generatePathLoop(pointsWithNeighbors){
    var numDests = 25;
    var ptsIds = pointsWithNeighbors.map((f,i)=>i);
    var destIds = _.sample(ptsIds, numDests);
    var allLines = [];
    for(var i=0;i<numDests;i++){
        allLines.push(...getPathLines(pointsWithNeighbors, destIds[i],destIds[(i+1)%numDests]));
    }
    return allLines;
}

function getPathLines(pointsWithNeighbors, src, trg){
    var ptsIds = sp.setOfPointsShortestPath2(pointsWithNeighbors, trg, src);
    var pathLines = lu.pts2Lines(pointsWithNeighbors,ptsIds);
    return pathLines;
}


var numCars = 64;
var cars = [];

for(var c=0;c<numCars;c++){
    var pathLines = generatePathLoop(nres);//getPathLines(src, trg);
    var speed = 0.005251*(1.0+Math.random()/5.0);
    var totalPathLength = lu.linesLength(pathLines);
    var expectedTimeForPath = totalPathLength / speed;
    var t = 0.0;
    var carSize = Math.random()*1.0+1.0;
    var dist = 0;
    var pt = interpLines.interpAlongLines(pathLines,t%1.0);
    var dirFwd = [[0,0,0],[0,0,0]];
    var dirUp = [[0,0,0],[0,1,0]];
    var dirRight = [[0,0,0],[0,0,0]];
    var color = [Math.random(),Math.random(),Math.random()];
    cars.push({pt,color, dist,carSize,pathLines,speed,totalPathLength,expectedTimeForPath,t,dirFwd,dirUp,dirRight})
}


console.log("path total len?",totalPathLength);



var t0=Date.now();
setInterval(function(){
    var xs = [];
    var timeSinceLastUpdate = Date.now()-t0;



    cars.forEach(function(car){
        var prevPt = lu.addPts(car.pt,[0,0,0]);
        car.t+= timeSinceLastUpdate/car.expectedTimeForPath;
        car.dist += car.totalPathLength * timeSinceLastUpdate/car.expectedTimeForPath;

        car.pt = interpLines.interpAlongLines_bezier_dist(car.pathLines,car.dist%car.totalPathLength); //interpAlongLineset_dist

        var motionDir = lu.normalizeLine([car.pt,prevPt]);
        var upDir = lu.normalizeLine([[0,0,0],[0,1,0]]);
        var rightDir = lu.crossProductLines(motionDir, upDir);

        car.dirFwd = motionDir;
        car.dirUp = upDir;
        car.dirRight = rightDir;

        //pt2DirTriangleLines pt2XLines
        // xs.push(
        //     shiftLine(car.dirFwd,
        //         lu.addPts(car.pt, lu.scalePt(car.dirRight,2.0))
        //     )
        // );
        xs.push(...lu.pt2XLines(lu.addPts(car.pt, lu.scalePt(car.dirRight,2.0)),car.carSize, car.color));
    });

    art.updateDfForLines([].concat(choppedLines,xs));
    t0=Date.now();
},50);

var STARTING_COLOR = [1,1,1];
var config = {
    lines: choppedLines.map(function(line){
        line.color = [Math.random(),Math.random(),Math.random()];
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
    antiAlias: true,
    mouseControl:false,
    thickness: 0.5,
    doAddEndCaps:false //add endcaps to lines
}

art.runScene(config);