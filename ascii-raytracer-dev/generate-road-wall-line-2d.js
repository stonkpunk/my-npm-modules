const dfu = require("./distance-function-utils");
const rtu = require("./raycasting-utils");
const lu = require("./lines-utils");
const {jitterPt} = require("./lines-utils");

//take set of lines in xz plane sol, add well-place road/wall to divide it. searches for deep saddle point thingies.

function boundingBlockOfBlocks(blocks){
    var eps = 0.001;
    var bb = [blocks[0][0], blocks[0][1]];

    for(var i=0; i<blocks.length;i++){
        var b = blocks[i];
        var xLo = Math.min(Math.min(b[0][0],bb[0][0]), Math.min(b[1][0],bb[0][0]));
        var xHi = Math.max(Math.max(b[0][0],bb[1][0]), Math.max(b[1][0],bb[1][0]));
        var yLo = Math.min(Math.min(b[0][1],bb[0][1]), Math.min(b[1][1],bb[0][1]));
        var yHi = Math.max(Math.max(b[0][1],bb[1][1]), Math.max(b[1][1],bb[1][1]));
        var zLo = Math.min(Math.min(b[0][2],bb[0][2]), Math.min(b[1][2],bb[0][2]));
        var zHi = Math.max(Math.max(b[0][2],bb[1][2]), Math.max(b[1][2],bb[1][2]));
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }

    return bb;
};

var randomPtsInsideSector = function(numPts, sector){
    var ptSet = [];
    for(var i=0; i<numPts; i++){//console.log("BOUNDS", sector);
        ptSet.push(
            [
                sector[0][0]+Math.random()*(sector[1][0]-sector[0][0]),
                sector[0][1]+Math.random()*(sector[1][1]-sector[0][1]),
                sector[0][2]+Math.random()*(sector[1][2]-sector[0][2])
            ]
        );
    };

    return ptSet;
};

function rndPt(bb){
    var rp = randomPtsInsideSector(1,bb)[0]
    return [rp[0],0,rp[2]];
}

function rndPtSmall(){
    var d = 1;
    return [Math.random()*d-d/2,0,Math.random()*d-d/2];
}

function traceAnotherLine(sol, solNoEdges, solOrig, config){
    var winner = findMaxPartitionLine(sol, solNoEdges, solOrig, config);//[resLines[0][0][0], lu.getPointAlongLine(resLines[0][0],Math.random())];
    winner.isLeaf = true;
    sol.push(winner);
    solNoEdges.push(winner);
}

function findMaxPartitionLine(sol, solNoEdges, solOrig, config){
    //boostrap 1st step...
    //var startPt, randomPathLine2, _startPt;
    var solDf = dfu.linesDistFast(sol);
    var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(sol), false);
    var bb = boundingBlockOfBlocks(sol);
    var resLines = [];

    for(var i=0;(i<config.ATTEMPTS_TO_FIND_MAXLINE) || resLines.length==0;i++){ //searching for random cut that cuts deepest into the line df ...

        if(i>config.ATTEMPTS_TO_FIND_MAXLINE+100){
            throw 'something wrong';
        }

        var r =rndPt(bb);
        var randomPathLine2 = config.PATH_RANDOMIZER ? [r,lu.addPts(r,rndPtSmall()) ] : lu.randomOrthoLineFromSetOfLines(sol, config.JITTER_FACTOR_COLOR);



        //if(DIRECTION_LIMITER){
        //    randomPathLine2[1]=lu.addPts(randomPathLine2[0],boxLinesDirections[Math.floor(Math.random()*boxLinesDirections.length)][1]);//lu.jitterPt(randomPathLine2[1],0.10);
        //}else{
        randomPathLine2[1]=lu.jitterPt(randomPathLine2[1],config.JITTER_FACTOR);
        //}
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

        if(distTraced>0 && lu.lineInsideShape(randomPathLine2,solOrig) ){//&& dfAtLineMidPt < 4000){
            var dfAtLineMidPt = solDf(...lineMidPt);
            var lineSaddleness = config.SKIP_SADDLE_CALC ? 1 : dfu.lineSaddleness2d(randomPathLine2,solDf);
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

    var winner = resLines[0][0];

    return winner;
}

function traceAnotherLine_curvy(sol, solNoEdges, solOrig, config){
    //boostrap 1st step...
    //var startPt, randomPathLine2, _startPt;
    var solDf = dfu.linesDistFast(sol);
    var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(sol), false);
    var bb = boundingBlockOfBlocks(sol);
    var resLines = [];

    var startingLine = findMaxPartitionLine(sol, solNoEdges, solOrig, config);

    var segLen = 1.0;

    var randomPathLine2 = [startingLine[0],lu.getPointAlongLine_dist(startingLine,segLen)];//lu.randomOrthoLineFromSetOfLines(sol, config.JITTER_FACTOR_COLOR,segLen);
    //randomPathLine2[1] = lu.jitterPt(randomPathLine2[1], config.JITTER_FACTOR);

    var startingColor = jitterPt(startingLine.color,config.JITTER_FACTOR_COLOR);

    //console.log("COLOR",startingColor);

    var numSteps = 100;
    for(var i=0;i<numSteps;i++){

        var n = lu.normalizeAndCenterLine(randomPathLine2);
        var ray = {
            point:{x:randomPathLine2[0][0],y:randomPathLine2[0][1],z:randomPathLine2[0][2]},
            vector:{x:n[1][0],y:n[1][1],z:n[1][2]},
        };

        var distTraced = tracer(ray);//Math.min(segLen,);//Math.min(tracer(ray),s/2);

        if(distTraced<segLen){
            i=numSteps+1; //break the loop after the next iter
        }else{
            distTraced=segLen;
        }

        randomPathLine2[1] = lu.getPointAlongLine_dist(randomPathLine2,/*Math.min(distTraced,1.5*distTraced*(1-Math.random()*Math.random())*/distTraced);
        var lineMidPt = lu.lineMidPt(randomPathLine2);

        //clone the current line, add back params not stored in json
        var randomPathLine2_old = JSON.parse(JSON.stringify(randomPathLine2));
        randomPathLine2_old.parentLineT = randomPathLine2.parentLineT;
        randomPathLine2_old.parentLine = randomPathLine2.parentLine;
        randomPathLine2_old.color = JSON.parse(JSON.stringify(startingColor));//randomPathLine2.color;

        if(distTraced>0 && lu.lineInsideShape(randomPathLine2,solOrig) ){//&& dfAtLineMidPt < 4000){
            sol.push(randomPathLine2_old);
            solNoEdges.push(randomPathLine2_old);
        }

        startingColor=jitterPt(startingColor, config.JITTER_FACTOR_COLOR);
        randomPathLine2[0] = randomPathLine2_old[1]
        randomPathLine2[1] = jitterPt(lu.getPointAlongLine_dist(randomPathLine2_old, segLen*2),config.JITTER_FACTOR_CURVES);
        randomPathLine2 = lu.normalizeLine(randomPathLine2);
    }


}

module.exports = {traceAnotherLine, traceAnotherLine_curvy};