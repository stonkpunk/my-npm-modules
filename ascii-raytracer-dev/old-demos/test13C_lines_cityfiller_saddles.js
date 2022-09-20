var art = require('../index.js');

var trp = require('triangle-random-pts')
var rtu = require('../raytrace-utils.js');
var dfu = require('../distance-function-utils.js');
var lu = require('../lines-utils.js');

var s = 75.0;

var SKIP_SADDLE_CALC = false;
var NUM_ROADS = 10;//1024*4;
var NUM_BUILDINGS = 0;
var PATH_RANDOMIZER = false; //if false, all lines are branching off exisitng lins
var DIRECTION_LIMITER = false; //limit to only directions of starting outline shape
var JITTER_FACTOR = 0.99;
var JITTER_FACTOR_COLOR=0.5;
var ATTEMPTS_TO_FIND_MAXPT=32; //for buildings
var ATTEMPTS_TO_FIND_MAXLINE=1024*10; //for roads , decreases 0.75x w/ each road added
var ATTEMPTS_TO_FIND_MAXLINE_minVal=1024*10; //min val it can decrease to
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

function traceAnotherLine(sol){
    //boostrap 1st step...
    //var startPt, randomPathLine2, _startPt;
    var solDf = dfu.linesDistFast(sol);
    var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(sol), false);

    var resLines = [];

    for(var i=0;(i<ATTEMPTS_TO_FIND_MAXLINE) || resLines.length==0;i++){ //searching for random cut that cuts deepest into the line df ...

        if(i>ATTEMPTS_TO_FIND_MAXLINE+100){
            throw 'something wrong';
        }

        var r =rndPt();
        var randomPathLine2 = PATH_RANDOMIZER ? [r,lu.addPts(r,rndPtSmall()) ] : lu.randomOrthoLineFromSetOfLines(sol, JITTER_FACTOR_COLOR);

        if(DIRECTION_LIMITER){
            randomPathLine2[1]=lu.addPts(randomPathLine2[0],boxLinesDirections[Math.floor(Math.random()*boxLinesDirections.length)][1]);//lu.jitterPt(randomPathLine2[1],0.10);
        }else{
            randomPathLine2[1]=lu.jitterPt(randomPathLine2[1],JITTER_FACTOR);
        }
                //
        var n = lu.normalizeAndCenterLine(randomPathLine2);
        var ray = {
            point:{x:randomPathLine2[0][0],y:randomPathLine2[0][1],z:randomPathLine2[0][2]},
            vector:{x:n[1][0],y:n[1][1],z:n[1][2]},
        };

        var distTraced = tracer(ray);//Math.min(tracer(ray),s/2);
        randomPathLine2[1] = lu.getPointAlongLine_dist(randomPathLine2,/*Math.min(distTraced,1.5*distTraced*(1-Math.random()*Math.random())*/distTraced);
        var lineMidPt = lu.lineMidPt(randomPathLine2);

        //var dfStart = solDf(...lu.getPointAlongLine(randomPathLine2,0.25));
        //var dfEnd = solDf(...lu.getPointAlongLine(randomPathLine2,0.75));


        if(distTraced>0 && lu.lineInsideShape(randomPathLine2,boxLinesOrig) ){//&& dfAtLineMidPt < 4000){
            var dfAtLineMidPt = solDf(...lineMidPt);
            var lineSaddleness = SKIP_SADDLE_CALC ? 1 : dfu.lineSaddleness2d(randomPathLine2,solDf);//*dfu.lineAverageDf(randomPathLine2,solDf);
            //resLines.push([randomPathLine2,dfAtLineMidPt]);
            //var changeIsBadFactor = 1.0/(1.0+Math.abs(dfStart-dfEnd));
            // if(dfAtLineMidPt<2.0){
            //     dfAtLineMidPt=0;
            // }
            //[randomPathLine2[0],lu.lineMidPt(randomPathLine2)]
            resLines.push([randomPathLine2,dfAtLineMidPt*lineSaddleness]); //*Math.sqrt(distTraced)
            //resLines.push([randomPathLine2,changeIsBadFactor*dfAtLineMidPt*dfAtLineMidPt*distTraced]);
        }
    }

    resLines.sort(function(a,b){
        return b[1]-a[1] //desc dist func val
    });

    var winner = resLines[0][0];//[resLines[0][0][0], lu.getPointAlongLine(resLines[0][0],Math.random())];
    //console.log(dfAtLineMidPt);
    boxLines.push(winner);
    boxLinesNoEdges.push(winner);
}

function traceBuildingPts(sol){
    //var solDf = dfu.linesDistFast(sol);

    // get 2 midpt ortho-lines for each leaf,
    // trace them both then return the midpts of the results, add them all to a list

    var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(sol), false);
    var leaves = sol.filter(l=>l.isLeaf).map(function(leaf){
        leaf.orthoLines = lu.orthoLines2d(leaf);
        leaf.orthoDirs = lu.orthoDirs2d(leaf);
        return leaf;
    });

    var res = [];

    leaves.forEach(function(leaf){
        var mp = lu.lineMidPt(leaf); //or leaf.orthoLines[0][0]
        var ray0 = {point:{x:mp[0],y:mp[1],z:mp[2]}, vector:{x:leaf.orthoDirs[0][0],y:leaf.orthoDirs[0][1],z:leaf.orthoDirs[0][2]},};
        var ray1 = {point:{x:mp[0],y:mp[1],z:mp[2]}, vector:{x:leaf.orthoDirs[1][0],y:leaf.orthoDirs[1][1],z:leaf.orthoDirs[1][2]},};
        var distTraced0 = tracer(ray0);
        var distTraced1 = tracer(ray1);
        var resPt0 = mp;//lu.getPointAlongLine_dist(leaf.orthoLines[0], distTraced0/2);
        var resPt1 = mp;//lu.getPointAlongLine_dist(leaf.orthoLines[1], distTraced1/2);
        if(lu.ptInsideShape(resPt0,boxLinesOrig)){res.push(resPt0);}
        if(lu.ptInsideShape(resPt1,boxLinesOrig)){res.push(resPt1);}
    });

    console.log("LEAVES?",leaves.length, "buildings?", res.length);

    return res;
}

function rndPt(){
    return [Math.random()*s*2,0,Math.random()*s*2];
}

function rndPtSmall(){
    var d = 1;
    return [Math.random()*d-d/2,0,Math.random()*d-d/2];
}

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
    var resLines = sample2dcircle(32,pt || rndPt(),boxLines.concat(resLinesAccum),null,0.5);
    var resLinesLoop = resLines.map(function(line,i){
        var nextLine = resLines[(i+1)%resLines.length];
        return [line[1],nextLine[1]];
    });
    resLinesAccum.push(...resLinesLoop);
    boxLines.push(...resLinesAccum.filter(line=>lu.lineInsideShape(line,boxLinesOrig)));
}


// var hipt = getHiPt();
// addRndLoop(hipt);
// traceAnotherLine(boxLines);



for(var i=0;i<NUM_ROADS;i++){

    traceAnotherLine(boxLines);
    console.log('added',i, ATTEMPTS_TO_FIND_MAXLINE)
    ATTEMPTS_TO_FIND_MAXLINE*=0.75;
    ATTEMPTS_TO_FIND_MAXLINE=Math.floor(Math.max(ATTEMPTS_TO_FIND_MAXLINE_minVal,ATTEMPTS_TO_FIND_MAXLINE));

}

//
// for(var i=0;i<NUM_BUILDINGS;i++){
//     //var ol = lu.randomOrthoLineFromSetOfLines(boxLines);
//     hipt = getHiPt();
//     addRndLoop(hipt);
// }

//boxLines.push(...resLinesAccum.filter(line=>lu.lineInsideShape(line,boxLinesOrig)));





//TODO x10 -- pick random pt from lines existing so far, trace new line
//
// var buildingPts = traceBuildingPts(boxLines);
//
// buildingPts.forEach(function(bp){
//     boxLines.push(...lu.pt2XLines(bp,4.0))
// })

var STARTING_COLOR = [1,1,1];
var config = {
    lines: boxLines.map(function(line){
        line.color = lu.brightenColor(line.color || STARTING_COLOR,0.5);//[Math.random(),Math.random(),Math.random()];
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
}

art.runScene(config);