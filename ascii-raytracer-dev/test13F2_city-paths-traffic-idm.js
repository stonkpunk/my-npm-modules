var art = require('./index.js');
var tidm = require('./traffic-idm.js');

// var trp = require('triangle-random-pts')
// var rtu = require('./raytrace-utils.js');
var dfu = require('./distance-function-utils.js');
var lu = require('./lines-utils.js');

var s = 75.0;

var SKIP_SADDLE_CALC = false;
var NUM_ROADS = 2;//1024*4;
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
var lines0= lu.createCircleLinesXZ(5, s/2, o);
var lines1 = [];//lu.createStarLinesXZ(10, s/3, o);
lines0=lu.addExtraPt(lines0);
lines1=lu.addExtraPt(lines1);
boxLines = [].concat(lines0,lines1); //lu.caliLines2d();//


var boxLinesOrig = JSON.parse(JSON.stringify(boxLines));



var traceAnotherLine = require('./generate-road-wall-line-2d.js').traceAnotherLine;

//
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
var chopLines = require('lines-self-chop');//'./lines-self-cut.js');

var GENERATE_ROAD_LOOPS = true;

if(GENERATE_ROAD_LOOPS){
    var l2l = require('./lines-to-loops.js');
    boxLines = l2l.lines2LoopsLines_2Lanes(boxLines);
}

var choppedLines = chopLines(boxLines, 0.01);



//test18

var sp = require('./pts-shortest-path.js');
var TWO_WAY_CONNECTIONS = false;
var nres = lu.lines2PtsWithNeighbors(choppedLines, TWO_WAY_CONNECTIONS );
//console.log("LINEs2Pts",nres.map(pt=>pt.neighbors.length));


choppedLines.forEach(function(cl){
    var s = 0.3;
    cl.color=[s,s,s];
})


var numCars = 32;
var cars = [];

var _xs = [];

for(var c=0;c<numCars;c++){
    var roadSize = 0.00000001; //removing the fake "right lane" effect
    var car = tidm.generateCar(nres, TWO_WAY_CONNECTIONS, roadSize);
    cars.push(car);

    // var theXLines = lu.pt2XLines(car.pt_roadRight,car.carSize, [1,0,0]);
    // _xs.push(...theXLines);
}

//var allLines = [].concat(choppedLines,_xs);

//console.log("path total len?",totalPathLength);
choppedLines.forEach(function(cl){
    cl.color=cl.color || [1,1,1]
})

var lastDfUpdate = 0;
var t0=Date.now();
setInterval(function(){
    //var xs = [];
    var timeSinceLastUpdate = Date.now()-t0;
    tidm.updateCars(cars,timeSinceLastUpdate*4);
    t0=Date.now();
    //console.log("car updates time", Date.now()-_t0);


    if(Date.now()-lastDfUpdate>50){

        var xs = [];

        cars.forEach(function(car){
            //l2l.line2TriangleLines(car.dirFwdRight, undefined, car.color)//

            var theXLines = lu.pt2XLines(car.pt_roadRight,car.carSize, car.color);
            xs.push(...theXLines);

            // if(car.dirFwdRight){
            //     car.dirFwdRight.color = car.color;
            //     //xs.push(car.dirFwd);
            // }

        });

        art.updateDfForLines([].concat(choppedLines,xs));
        lastDfUpdate=Date.now();
    }


},1);

var STARTING_COLOR = [1,1,1];
var config = {
    lines: choppedLines,
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