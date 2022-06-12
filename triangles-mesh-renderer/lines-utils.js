var Chance = require('chance');
// const dfu = require("./distance-function-utils.js");
// const rtu = require("./raycasting-utils");
// const simplify = require("simplify-path");

var chance = new Chance();

function lineMidPt(line){
    return [
        (line[0][0]+line[1][0])/2.0,
        (line[0][1]+line[1][1])/2.0,
        (line[0][2]+line[1][2])/2.0
    ];
}

var centerOfLine = lineMidPt;

function averageOfPts(pts){
    var avPt = [0,0,0];
    for(var i=0; i<pts.length; i++){
        avPt[0]+=pts[i][0];
        avPt[1]+=pts[i][1];
        avPt[2]+=pts[i][2];
    }

    return [avPt[0]/pts.length, avPt[1]/pts.length, avPt[2]/pts.length];
}

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

var lineLengthSquared = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return (a*a+b*b+c*c);
};

function lines2Triangles(lines){ //2d only, triangles go up in y dir
    var s = 1;
    return lines.map(function(line){
        return [line[0],line[1],[line[0][0],line[0][1]+s,line[0][2]]]
    });
}

var getPointAlongLine_dist = function(line, dist){

    var _t = dist/lineLength(line);

    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    //console.log("before array abuse?", arr);
    arr["line"]=line;
    //console.log("after array abuse", arr);
    return arr;
};

var getPointAlongLine = function(line, _t){
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

function sector2LinesEdges(sector){
    //check edges (12) ...
    var s0 = sector[0];
    var s1 = sector[1];
    var topEdge0 = [[s0[0],s0[1],s0[2]],[s0[0],s0[1],s1[2]]];
    var topEdge1 = [[s0[0],s0[1],s1[2]],[s1[0],s0[1],s1[2]]];
    var topEdge2 = [[s1[0],s0[1],s1[2]],[s1[0],s0[1],s0[2]]];
    var topEdge3 = [[s1[0],s0[1],s0[2]],[s0[0],s0[1],s0[2]]];

    var botEdge0 = [[s0[0],s1[1],s0[2]],[s0[0],s1[1],s1[2]]];
    var botEdge1 = [[s0[0],s1[1],s1[2]],[s1[0],s1[1],s1[2]]];
    var botEdge2 = [[s1[0],s1[1],s1[2]],[s1[0],s1[1],s0[2]]];
    var botEdge3 = [[s1[0],s1[1],s0[2]],[s0[0],s1[1],s0[2]]];

    var sideEdge0 = [[s0[0],s0[1],s0[2]],[s0[0],s1[1],s0[2]]];
    var sideEdge1 = [[s0[0],s0[1],s1[2]],[s0[0],s1[1],s1[2]]];
    var sideEdge2 = [[s1[0],s0[1],s1[2]],[s1[0],s1[1],s1[2]]];
    var sideEdge3 = [[s1[0],s0[1],s0[2]],[s1[0],s1[1],s0[2]]];

    var listOfEdges = [
        topEdge0, topEdge1, topEdge2, topEdge3,
        botEdge0, botEdge1, botEdge2, botEdge3,
        sideEdge0, sideEdge1, sideEdge2, sideEdge3,
    ];

    return listOfEdges;
}

//var invSqrt  = require("fast-inv-sqrt").invSqrt;

var normalizeLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var ilen = 1.0/(Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    //var ilen = invSqrt(dx*dx+dy*dy+dz*dz)+0.000001;
    return [line[0],[line[0][0]+dx*ilen, line[0][1]+dy*ilen, line[0][2]+dz*ilen]];
    //return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

var normalizeAndCenterLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var ilen = 1.0/(Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    return [[0,0,0],[dx*ilen, dy*ilen, dz*ilen]];
};

var _nplen = new Float32Array(1);
function normalizePt(pt){ //pt = [x,y,z];
    //var len = ptLength(pt);
    //_nplen[0] = Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2]);
    var ilen = 1.0/Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2])
    return [pt[0]*ilen,pt[1]*ilen,pt[2]*ilen];
    //return [pt[0]/_nplen[0],pt[1]/_nplen[0],pt[2]/_nplen[0]];
}

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function ptLength(pt){
    return lineLength([[0,0,0],pt]);
}

function lineDirection(line){
    return normalizePt(ptDiff(line[1],line[0]));
}

var _crossProduct = function (a, b) { //from gl-vec3 cross
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    var out = [0,0,0];
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out;
};

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

var addPtsXY = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1]];
};


function randomColorF(){
    return [Math.random(),Math.random(),Math.random()];
}

function clampPt(pt){
    pt[0]=Math.max(0,Math.min(pt[0],1));
    pt[1]=Math.max(0,Math.min(pt[1],1));
    pt[2]=Math.max(0,Math.min(pt[2],1));
    return pt;
}

function jitterColorF(c,s=0.1){
    var j = [Math.random()*s-s/2.0,Math.random()*s-s/2.0,Math.random()*s-s/2.0];
    return clampPt(addPts(c,j));
}

function orthoDirs2d(line){
    var dirLineParent = lineDirection(line);
    var dirOrtho0 = _crossProduct(dirLineParent,[0,1,0]);
    var dirOrtho1 = _crossProduct(dirLineParent,[0,-1,0]);
    return [dirOrtho0,dirOrtho1];
}

function orthoLines2d(line){
    var ods = orthoDirs2d(line);
    var mp = lineMidPt(line);
    var orthoLine0 = [mp,addPts(mp,ods[0])];
    var orthoLine1 = [mp,addPts(mp,ods[1])];
    return [orthoLine0,orthoLine1];
}

function randomOrthoLineFromSetOfLines(sol, colorJitter, len=1, forcedColor){
    var res = randomPtFromSetOfLines(sol);
    //var rndPt = res.pt;
    var dirLineParent = lineDirection(res.line);
    var dirOrtho = _crossProduct(dirLineParent,[0,Math.random()>0.5?1:-1,0]);

    var childLine = [res.pt,addPts(res.pt,dirOrtho)];

    childLine.parentLineT = res.t;
    childLine.parentLine = res.line;
    childLine.color = jitterColorF(childLine.parentLine.color || forcedColor || randomColorF(), colorJitter)

    childLine[1]=getPointAlongLine_dist(childLine,len);

    return childLine;
}


function lines2ConesTriangles(lines, thickness=0.5, doAddEndCaps=true){
    var res = [];
    lines.forEach(function(line){
        var r = thickness;
        //console.log(line.color);
        res.push(...cone2Triangles({line: line, r0: r, r1: r},3, line.color,doAddEndCaps));
    });
    return res;
}

function randomPtFromSetOfLines(sol){
    //console.log("DO WEIGHTS", sol,sol.map(l=>lineLength(l)));
    var solf = sol.filter(l=>lineLength(l));
    var rndLine = chance.weighted(solf,solf.map(l=>lineLength(l)));// sol[Math.floor(Math.random()*sol.length)];//TODO weight according to line length
    var t =  Math.random();
    var rndPt = getPointAlongLine(rndLine,t);

    return {pt:rndPt,line:rndLine,t:t};
}

function jitterPt(pt, s){
    //return [pt[0]+Math.random()*s-s/2,0,pt[2]+Math.random()*s-s/2];
    return [pt[0]+Math.random()*s-s/2,pt[1]+Math.random()*s-s/2,pt[2]+Math.random()*s-s/2];
}

function jitterPt3d(pt, s){ //2d jitter along x-z
    return [pt[0]+Math.random()*s-s/2,pt[1]+Math.random()*s-s/2,pt[2]+Math.random()*s-s/2];
}

function addExtraPt(sol){
    var _res = [];

    for(var i=0;i<sol.length;i++){
        if(i==sol.length-1){
            // var line = sol[i];
            // var pt0 = line[0];
            // var pt1 = line[1];
            // var mid = getPointAlongLine(line,0.5);
            // var mid2 = getPointAlongLine(line,0.5+0.1);
            // _res.push([pt0,mid]);
            // _res.push([mid,mid2]);
            // _res.push([mid,pt1]);
            _res.push(sol[i]);
            _res.push(sol[0]);
        }else{
            _res.push(sol[i]);
        }
    }

    return _res;
}

function reverseLines(sol) {
    var res = sol.map(l=>[l[1],l[0]]);
    res.reverse();
    return res;
}

var createStarLinesXZ = function(_steps,s=0.25,offset=[0,0,0]){
    var lines = [];
    var steps = _steps || 360;
    //var s= 0.250;
    for(var step = 0;step< steps; step++){
        var rdown = (step%2==0)?1.0:0.5;
        var rdown1 = ((step+1)%2==0)?1.0:0.5;
        var thisPt = [Math.cos(step/steps*Math.PI*2)*s*rdown+offset[0], 0, Math.sin(step/steps*Math.PI*2)*s*rdown+offset[2]];
        var nextPt = [Math.cos((step+1)/steps*Math.PI*2)*s*rdown1+offset[0], 0, Math.sin((step+1)/steps*Math.PI*2)*s*rdown1+offset[2]];
        lines.push([thisPt,nextPt]);
    }
    return lines;
};

var createCircleLinesXZ = function(_steps,s=0.25,offset=[0,0,0]){
    var lines = [];
    var steps = _steps || 360;
    //var s= 0.250;

    for(var step = 0;step< steps; step++){
        var thisPt = [Math.cos(step/steps*Math.PI*2)*s+offset[0], 0, Math.sin(step/steps*Math.PI*2)*s+offset[2]];
        var nextPt = [Math.cos((step+1)/steps*Math.PI*2)*s+offset[0], 0, Math.sin((step+1)/steps*Math.PI*2)*s+offset[2]];
        lines.push([thisPt,nextPt]);
    }
    return lines;
};


function distanceSquared(x1, y1, x2, y2) //why sqrt then?
{
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

/**
 * line-point collision
 * from https://stackoverflow.com/a/17693146/1955997
 * @param {number} x1 first point in line
 * @param {number} y1 first point in line
 * @param {number} x2 second point in line
 * @param {number} y2 second point in line
 * @param {number} xp point
 * @param {number} yp point
 * @param {number} [tolerance=1]
 * @return {boolean}
 */
function linePoint(x1, y1, x2, y2, xp, yp, tolerance)
{
    tolerance = tolerance || 1
    return Math.abs(distanceSquared(x1, y1, x2, y2) - (distanceSquared(x1, y1, xp, yp) + distanceSquared(x2, y2, xp, yp))) <= tolerance
}

//https://github.com/davidfig/intersects/blob/master/polygon-point.js
/**
 * polygon-point collision
 * based on https://stackoverflow.com/a/17490923/1955997
 * @param {number[]} points [x1, y1, x2, y2, ... xn, yn] of polygon
 * @param {number} x of point
 * @param {number} y of point
 * @param {number} [tolerance=1] maximum distance of point to polygon's edges that triggers collision (see pointLine)
 */
function polygonPoint(points, x, y, tolerance)
{
    var length = points.length
    var c = false
    var i, j
    for (i = 0, j = length - 2; i < length; i += 2)
    {
        if (((points[i + 1] > y) !== (points[j + 1] > y)) && (x < (points[j] - points[i]) * (y - points[i + 1]) / (points[j + 1] - points[i + 1]) + points[i]))
        {
            c = !c
        }
        j = i
    }
    if (c)
    {
        return true
    }
    for (i = 0; i < length; i += 2)
    {
        var p1x = points[i]
        var p1y = points[i + 1]
        var p2x, p2y
        if (i === length - 2)
        {
            p2x = points[0]
            p2y = points[1]
        }
        else
        {
            p2x = points[i + 2]
            p2y = points[i + 3]
        }
        if (linePoint(p1x, p1y, p2x, p2y, x, y, tolerance))
        {
            return true
        }
    }
    return false
}

function ptsXZInPolygonXY(sop0,sop1){ //sop0 is list of 3d pts, sop1 is 2d polygon shape2d
    var parr1 = [];
    sop1.forEach(function(p){parr1.push(p[0],p[1]);});
    return sop0.filter(function(p){
        return polygonPoint(parr1,p[0],p[2],0.0001);
    });
}

function ptsXZInPolygonXZ(sop0,sop1){ //sop0 is list of 3d pts, sop1 is 2d polygon shape2d
    var parr1 = [];//sop1.reverse();
    sop1.forEach(function(p,i){
        parr1.push(p[0],p[2]);

        // if(i==1){//sop1.length-1){
        //     var _p = jitterPt(p,1.1);
        //     parr1.push(_p[0],_p[2]);
        //     var _p = jitterPt(p,1.1);
        //     parr1.push(_p[0],_p[2]);
        //     var _p = jitterPt(p,1.1);
        //     parr1.push(_p[0],_p[2]);
        // }
    });
    return sop0.filter(function(p){
        return polygonPoint(parr1,p[0],p[2],0.0001);
    });
}

function caliPts2d(){ //cali pts from threejs

    var s = 32/1000*3;
    var californiaPts = [];

    californiaPts.push( [610*s,0, 320*s ] );
    californiaPts.push( [450*s,0, 300*s ] );
    californiaPts.push( [392*s,0, 392*s ] );
    californiaPts.push( [266*s,0, 438*s ] );
    californiaPts.push( [190*s,0, 570*s ] );
    californiaPts.push( [190*s,0, 600*s ] );
    californiaPts.push( [160*s,0, 620*s ] );
    californiaPts.push( [160*s,0, 650*s ] );
    californiaPts.push( [180*s,0, 640*s ] );
    californiaPts.push( [165*s,0, 680*s ] );
    californiaPts.push( [150*s,0, 670*s ] );
    californiaPts.push( [ 90*s,0, 737*s ] );
    californiaPts.push( [ 80*s,0, 795*s ] );
    californiaPts.push( [ 50*s,0, 835*s ] );
    californiaPts.push( [ 64*s,0, 870*s ] );
    californiaPts.push( [ 60*s,0, 945*s ] );
    californiaPts.push( [300*s,0, 945*s ] );
    californiaPts.push( [300*s,0, 743*s ] );
    californiaPts.push( [600*s,0, 473*s ] );
    californiaPts.push( [626*s,0, 425*s ] );
    californiaPts.push( [600*s,0, 370*s ] );
    californiaPts.push( [610*s,0, 320*s ] );

    return californiaPts;
}

function caliLines2d(){
    var pts = caliPts2d();
    var res = [];
    for(var i=0;i<pts.length;i++){
        var pt = pts[i];
        var nextPt = pts[(i+1)%pts.length];
        res.push([pt,nextPt]);
    }
    return res;
}

function lineIntersectsShape(line,shapeLines,_tracer){
    var tracer = _tracer || rtu.trianglesTraceFast(lines2Triangles(shapeLines), false);
    var d = lineDirection(line);
    var ray = {
        point:{x:line[0][0],y:line[0][1],z:line[0][2]},
        vector:{x:d[0],y:d[1],z:d[2]},
    };
    var dist = tracer(ray);
    return dist < lineLength(line);
}

function lineInsideShape(line,shapeLines){
    return ptsXZInPolygonXZ([line[0],line[1],lineMidPt(line)],shapeLines.map(l=>l[0])).length==3;//ptInsideShape(line[0],boxSize) && ptInsideShape(line[1], boxSize);
}


function ptInsideShape(pt,shapeLines){
    return ptsXZInPolygonXZ([pt],shapeLines.map(l=>l[0])).length==1;
}
//
// function lineCones2Df(lcs,tree) {
//     var lct = tree || linesCones2RTree(lcs,2);
//     return function(x,y,z){
//         var minRadius = 0.01;
//         var closeLines = lct.search(sector2RTreeObj([[x,y,z],[x,y,z]], minRadius)).map(function(treeObj){return treeObj.origLine;});
//         return linesetConeDistance_C(x,y,z, closeLines,true);
//     }
// }

// dfv = distanceFromLineSegmentThickCone_pts_TURBO([x,y,z], [lines[i][0][0],lines[i][0][1],lines[i][0][2]], [lines[i][1][0],lines[i][1][1],lines[i][1][2]], lines[i].r0, -lines[i].r1);
//
//
// function distanceFromLineSegmentThickCone_pts(p, a, b, r0, r1){ //turbo-ish
//
//     //return 5.0;
//
//     //var sector = getSectorPadded(boundingBlockOfBlocks([[a,b]]),0.42);
//     //return sectorDistFast(sector,p[0],p[1],p[2]);
//
//     var pax = p[0]-a[0];
//     var pay = p[1]-a[1];
//     var paz = p[2]-a[2];
//     var bax = b[0]-a[0];
//     var bay = b[1]-a[1];
//     var baz = b[2]-a[2];
//     //var paDotBa = pax*bax+pay*bay+paz*baz;
//     //var baDotBa = bax*bax+bay*bay+baz*baz;
//     //var dotQuot = paDotBa / baDotBa;
//     //var dotQuot = (pax*bax+pay*bay+paz*baz) / (bax*bax+bay*bay+baz*baz);
//     //var clampedQuot = Math.max(0.0,Math.min(1.0,dotQuot)); //h
//     var clampedQuot =  Math.max(0.0,Math.min(1.0,(pax*bax+pay*bay+paz*baz) / (bax*bax+bay*bay+baz*baz))); //h
//     //var baScaled = [clampedQuot*bax, clampedQuot*bay, clampedQuot*baz];
//     //var paSubBS = [pax-baScaled[0], pay-baScaled[1], paz-baScaled[2]];
//     //var paSubBS = [p[0]-a[0]-clampedQuot*bax, pay-clampedQuot*bay, paz-clampedQuot*baz];
//     var paSubBS = [pax-clampedQuot*bax, pay-clampedQuot*bay, paz-clampedQuot*baz];
//     var lenSquared = paSubBS[0]*paSubBS[0]+paSubBS[1]*paSubBS[1]+paSubBS[2]*paSubBS[2];
//
//     //return Math.sqrt(lenSquared) - (r0+(r1-r0)*clampedQuot);
//     return Math.sqrt(lenSquared) - r0 - (r1-r0)*clampedQuot;
//
//     /*var p = new THREE.Vector3(_p[0],_p[1],_p[2]);
//     var a = new THREE.Vector3(_a[0],_a[1],_a[2]);
//     var b = new THREE.Vector3(_b[0],_b[1],_b[2]);
//
//     var pa = new THREE.Vector3().copy(p).sub(a);
//     var ba = new THREE.Vector3().copy(b).sub(a);
//     var h = Math.clamp01(pa.dot(ba)/ba.dot(ba));
//     return (pa.sub(ba.multiplyScalar(h))).length() - (r0+(r1-r0)*h);*/
// }
//
//
// var linesetConeDistance = function(lines, pt){
//     var dist = 999999.9;
//     for(var i=0; i<lines.length; i++){
//         dist = Math.min(dist, distanceFromLineSegmentThickCone_pts(pt, [lines[i][0][0],lines[i][0][1],lines[i][0][2]], [lines[i][1][0],lines[i][1][1],lines[i][1][2]], lines[i].r0, lines[i].r1));
//     }
//     return dist;
// };

var crossProductLines = function (a, b) {
    return _crossProduct(
        [a[1][0]-a[0][0], a[1][1]-a[0][1], a[1][2]-a[0][2]],
        [b[1][0]-b[0][0], b[1][1]-b[0][1], b[1][2]-b[0][2]]
    );
};

var dotProductLines = function (a, b) {
    return _dotProduct(
        [a[1][0]-a[0][0], a[1][1]-a[0][1], a[1][2]-a[0][2]],
        [b[1][0]-b[0][0], b[1][1]-b[0][1], b[1][2]-b[0][2]]
    );
};

var rescaleLine = function(scale,line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var len = (Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001)/scale;
    return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

var _rescaleLine = rescaleLine;

var scaleLine = function(line,scale){
    return rescaleLine(scale,line);
};

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3];
}

function invertPt(p){
    return [-p[0],-p[1],-p[2]];
}

function scalePt(pt,s){
    return [pt[0]*s,pt[1]*s,pt[2]*s];
}

function triangleNormalLines(tri, scale){
    var p0 = tri[0];
    var p1 = tri[1];
    var p2 = tri[2];
    var faceCenterA = averagePts3(p0, p1, p2);
    var normalA = crossProductLines([p0, p1], [p0, p2]);
    var normalLineA = _rescaleLine(scale || 1.0, normalizeLine([faceCenterA, addPts(faceCenterA,normalA)]));

    var antiNormalA=invertPt(normalA);
    antiNormalA = _rescaleLine(scale || 1.0, normalizeLine([faceCenterA, addPts(faceCenterA,antiNormalA)]));

    return [normalLineA, antiNormalA];
}

function lineDFHighPt(line, df, _iter){
    _iter = _iter || 0;

    var MAX_ITER = 64.0;
    var s0 = line[0];
    var sHalf = [
        (line[0][0]+line[1][0])*0.5,
        (line[0][1]+line[1][1])*0.5,
        (line[0][2]+line[1][2])*0.5
    ];
    var s1 = line[1];

    var p0 = [s0[0],s0[1],s0[2]];
    var phalf = [sHalf[0], sHalf[1], sHalf[2]];
    var p1 = [s1[0], s1[1], s1[2]];

    var ds0 = df(...p0);
    var dsHalf =df(...phalf);
    var ds1 = df(...p1);

    var largestPt = phalf;

    var eps = 0.01;

    var largest = Math.max(Math.max(ds0,dsHalf),ds1);

    if(_iter<MAX_ITER){
        var s0IsLargest =    ds0>=dsHalf && ds0>=ds1;
        var sHalfIsLargest = dsHalf>=ds0 && dsHalf>=ds1;
        var s1IsLargest =    ds1>=dsHalf && ds1>=ds0;

        if(s0IsLargest){
            largestPt = p0;
            var hp = lineDFHighPt([s0, sHalf], df, _iter+1);
            if(largest>hp.v){
                return {v:largest, pt: largestPt};
            }else{
                return {v:hp.v, pt: hp.pt};
            }
        }else if(s1IsLargest){
            largestPt = p1;
            var hp = lineDFHighPt([sHalf,s1], df, _iter+1);
            if(largest>hp.v){
                return {v:largest, pt: largestPt};
            }else{
                return {v:hp.v, pt: hp.pt};
            }
        }else if(sHalfIsLargest){
            largestPt = phalf;
            if(ds0>=ds1){
                var hp = lineDFHighPt([s0, sHalf], df, _iter+1);
                if(largest>hp.v){
                    return {v:largest, pt: largestPt};
                }else{
                    return {v:hp.v, pt: hp.pt};
                }
            }else{
                var hp = lineDFHighPt([sHalf,s1], df, _iter+1);
                if(largest>hp.v){
                    return {v:largest, pt: largestPt};
                }else{
                    return {v:hp.v, pt: hp.pt};
                }
            }
        }
        //throw "wtf?";
        console.log("LINE INT ERR?", ds0,ds1,dsHalf);
        return {v:largest, pt: largestPt};
    }else{
        return {v:largest, pt: largestPt};
    }
}


function lineDFLowPt(line, df, _iter){
    var antidf = function(x,y,z){
        return -df(x,y,z);
    }
    return lineDFHighPt(line,antidf,_iter);
    // _iter = _iter || 0;
    // var MAX_ITER = 16.0;
    // var s0 = line[0];
    // var sHalf = [
    //     (line[0][0]+line[1][0])*0.5,
    //     (line[0][1]+line[1][1])*0.5,
    //     (line[0][2]+line[1][2])*0.5
    // ];
    // var s1 = line[1];
    //
    // var ds0 = (df(s0[0],s0[1],s0[2]));
    // var dsHalf =(df(sHalf[0], sHalf[1], sHalf[2]));
    // var ds1 = (df(s1[0], s1[1], s1[2]));
    //
    // var eps = 0.01;
    //
    // var smallest = Math.min(Math.min(ds0,dsHalf),ds1);
    //
    // if(_iter<MAX_ITER){
    //     var s0IsSmallest =    ds0<=dsHalf && ds0<=ds1;
    //     var sHalfIsSmallest = dsHalf<=ds0 && dsHalf<=ds1;
    //     var s1IsSmallest =    ds1<=dsHalf && ds1<=ds0;
    //
    //     if(s0IsSmallest){
    //         return Math.min(smallest,lineDFLowPt([s0, sHalf], df, _iter+1));
    //     }else if(s1IsSmallest){
    //         return Math.min(smallest,lineDFLowPt([sHalf,s1], df, _iter+1));
    //     }else if(sHalfIsSmallest){
    //         if(ds0<=ds1){
    //             return Math.min(smallest,lineDFLowPt([s0, sHalf], df, _iter+1));
    //         }else{
    //             return Math.min(smallest,lineDFLowPt([sHalf,s1], df, _iter+1));
    //         }
    //     }
    //     //throw "wtf?";
    //     console.log("LINE INT ERR?");
    //     return smallest;
    // }else{
    //     return smallest;
    // }
}

var crossProduct = _crossProduct;//for pts

function brightenColor(c,amount){
    return getPointAlongLine([c,[1,1,1]],amount);
}

function pt2XLines(pt,s, color){
    var sol = [];
    var l0 = [addPts(pt,[-s,0,-s]),addPts(pt,[s,0,s])];
    var l1 = [addPts(pt,[s,0,-s]),addPts(pt,[-s,0,s])];
    if(color || pt.color){
        l0.color = color || pt.color;
        l1.color = color || pt.color;
    }
    sol.push(l0,l1);
    return sol;
}

if(!Math.clamp01){
    (function(){Math.clamp01=function(a/*,b,c*/){return Math.max(0.0,Math.min(1.0,a));}})();
}

var _dotProduct = function(a, b){
    return  a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
};

function lineLineClosestPtsLine(line0,line1, doClamp=true){ //get shortest line joining line0, line1 , closest approach
    //rays a,b [init pt A, direction a]
    //http://morroworks.palitri.com/Content/Docs/Rays%20closest%20point.pdf
    // D = A + a* (-(a.b)(b.c)+(a.c)(b.b) / ((a.a)(b.b) - (a.b)(a.b))
    // E = B + b* ((a.b)(a.c) - (b.c)(a.a)) / ((a.a)(b.b) - (a.b)(a.b))

    //t0 =  (-(a.b)(b.c) + (a.c)(b.b) / ((a.a)(b.b) - (a.b)(a.b))
    //t1 =  ((a.b)(a.c) - (b.c)(a.a)) / ((a.a)(b.b) - (a.b)(a.b))

    // where D is point along line a
    //   and E is point along line b

    var c = ptDiff(line1[0], line0[0]);//centerLi([line0[0],line1[0]])[1]; //c= AB
    var a = ptDiff(line0[1], line0[0]);//normalizeAndCenterLine(line0)[1];
    var b = ptDiff(line1[1], line1[0]); //normalizeAndCenterLine(line1)[1];

    //var A = line0[0];
    //var B = line1[0];


    var t0 =  (-_dotProduct(a,b)*_dotProduct(b,c)+_dotProduct(a,c)*_dotProduct(b,b)) / (_dotProduct(a,a)*_dotProduct(b,b) - _dotProduct(a,b)*_dotProduct(a,b));
    var t1 =  (_dotProduct(a,b)*_dotProduct(a,c) -_dotProduct(b,c)*_dotProduct(a,a)) / (_dotProduct(a,a)*_dotProduct(b,b) - _dotProduct(a,b)*_dotProduct(a,b));

    if(doClamp){
        t0 = Math.clamp01(t0);
        t1 = Math.clamp01(t1);
    }

    var line = [getPointAlongLine(line0, t0),getPointAlongLine(line1, t1)];
    line[0].t=t0;
    line[1].t=t1;

    return line;
}

function lineClosestTForPt(line,pt){
    var res = lineLineClosestPtsLine(line, [pt,jitterPt3d(pt,0.0001)],false);
    return res[0].t;
}

function removeDuplicateLines(sol){ //lineconesremoveduplicates
    const hashSize = 1000;
    function _ptHash3(x,y,z){
        return Math.floor(x*hashSize) + Math.floor(y*hashSize)*hashSize + Math.floor(z*hashSize)*hashSize*hashSize;//hashBy100(x) +"_" +hashBy100(y) + "_" + hashBy100(z); //hashByTenthR actually hashes by 1000
    }

    function lcHash(lc){
        var h0 = _ptHash3(lc[0][0],lc[0][1],lc[0][2]);
        var h1 = _ptHash3(lc[1][0],lc[1][1],lc[1][2]);
        var _h0 = Math.min(h0,h1);
        var _h1 = Math.max(h0,h1);
        // var _r0 = Math.min(lc.r0,lc.r1);
        // var _r1 = Math.max(lc.r0,lc.r1);
        return `${_h0}_${_h1}`;//_${_r0}_${_r1}`
    }

    var lcMap = {};
    var lcUniq = [];

    sol.forEach(function(lc){
        var h = lcHash(lc);
        if(!lcMap[h]){
            lcMap[h]=true;
            lcUniq.push(lc);
        }
    });

    console.log("DUPLICATES REMOVED", sol.length-lcUniq.length, "of",sol.length);

    return lcUniq;
}

function lines2PtsWithNeighbors(sol, twoWayConnections=true, r=0.001){

    var dfu = require("./distance-function-utils.js"); //TODO -- no idea why we need to re-declare this to avoid function not found error
    var linesNearby = dfu.linesNearbyPtFunc(sol,r);

    var ptsInOrder = [];

    function getCloserPtFromLine(pt,line){
        return lineLength([pt,line[0]])<lineLength([pt,line[1]]) ? line[0] : line[1];
    }

    var currentPtIndex = 1; //TODO re-arrange / re-name index at end to correspond with the actual array index?
    sol.forEach(function(line){
        line.forEach(function(linePt){
            if(!linePt.ptIndex){
                linePt.ptIndex = currentPtIndex+"";
                linePt.origPt = linePt;
                //linePt.isOrigPt = true;
                var linesNearLinePt = linesNearby(linePt);
                var ptsNearLinePt = linesNearLinePt.map(_line => getCloserPtFromLine(linePt,_line)).filter(p=>lineLength([linePt,p])<r);

                ptsNearLinePt.forEach(function(ptOnNearbyLine){
                    ptOnNearbyLine.ptIndex=linePt.ptIndex;
                    ptOnNearbyLine.origPt = linePt;
                });
                ptsInOrder.push(linePt);
                currentPtIndex++;
            }
        });
    });

    var neighborsPerIndex = {};
    var ptPerIndex = {};

    sol.forEach(function(line){
        neighborsPerIndex[line[0].ptIndex+""] = neighborsPerIndex[line[0].ptIndex+""] || [];
        neighborsPerIndex[line[0].ptIndex+""].push(line[1].origPt);

        neighborsPerIndex[line[1].ptIndex+""] = neighborsPerIndex[line[1].ptIndex+""] || [];

        if(twoWayConnections){
            neighborsPerIndex[line[1].ptIndex+""].push(line[0].origPt);
        }

        ptPerIndex[line[0].ptIndex+""]=line[0].origPt;
        ptPerIndex[line[1].ptIndex+""]=line[1].origPt;
    });

    var res = [];
    for(var index in ptPerIndex){
        ptPerIndex[index+""].neighbors = neighborsPerIndex[index];
        ptPerIndex[index+""].i = index + "";
        //ptPerIndex[index+""].finalIndex = res.length;
        res.push(ptPerIndex[index+""]);
    }

    //re-naming index so that index = array index
    res = res.map(function(pt,i){
        pt.ptIndex = i+"";
        pt.i = i+"";//pt.finalIndex+"";
        //delete pt.finalIndex;
        return pt;
    });

    return res;
}

// function lines2PtsWithNeighbors_oneWay(sol,r=0.001){
//
//     var dfu = require("./distance-function-utils.js"); //TODO -- no idea why we need to re-declare this to avoid function not found error
//     var linesNearby = dfu.linesNearbyPtFunc(sol,r);
//
//     //var ptsInOrder = [];
//
//     function getCloserPtIFromLine(pt,line){
//         return lineLengthSquared([pt,line[0]])<lineLengthSquared([pt,line[1]]) ? 0 : 1;
//     }
//
//     function getCloserPtFromLine(pt,line){
//         var I = getCloserPtIFromLine(pt,line);
//         return line[I];
//     }
//
//
//     var currentPtIndex = 1; //TODO re-arrange / re-name index at end to correspond with the actual array index?
//     sol.forEach(function(line){
//         line.forEach(function(linePt){
//             if(!linePt.ptIndex){
//                 linePt.ptIndex = currentPtIndex+"";
//                 linePt.origPt = linePt;
//                 //linePt.isOrigPt = true;
//                 var linesNearLinePt = linesNearby(linePt);
//                 var ptsNearLinePt = linesNearLinePt.map(_line => getCloserPtFromLine(linePt,_line)).filter(p=>lineLength([linePt,p])<r);
//
//                 ptsNearLinePt.forEach(function(ptOnNearbyLine){
//                     ptOnNearbyLine.ptIndex=linePt.ptIndex;
//                     ptOnNearbyLine.origPt = linePt;
//                 });
//                 //ptsInOrder.push(linePt);
//                 currentPtIndex++;
//             }
//         });
//     });
//
//     var neighborsPerIndex = {};
//     var ptPerIndex = {};
//
//     sol.forEach(function(line){
//
//         //connect line[0] to line[1] but NOT vice-versa
//
//         neighborsPerIndex[line[0].ptIndex+""] = neighborsPerIndex[line[0].ptIndex+""] || [];
//         neighborsPerIndex[line[0].ptIndex+""].push(line[1].origPt);
//
//         //neighborsPerIndex[line[1].ptIndex+""] = neighborsPerIndex[line[1].ptIndex+""] || [];
//         //neighborsPerIndex[line[1].ptIndex+""].push(line[0].origPt);
//
//         ptPerIndex[line[0].ptIndex+""]=line[0].origPt;
//         ptPerIndex[line[1].ptIndex+""]=line[1].origPt;
//     });
//
//     var res = [];
//     for(var index in ptPerIndex){
//         ptPerIndex[index+""].neighbors = neighborsPerIndex[index];
//         ptPerIndex[index+""].i = index + "";
//         //ptPerIndex[index+""].finalIndex = res.length;
//         res.push(ptPerIndex[index+""]);
//     }
//
//     //re-naming index so that index = array index
//     res = res.map(function(pt,i){
//         pt.ptIndex = i+"";
//         pt.i = i+"";//pt.finalIndex+"";
//         //delete pt.finalIndex;
//         return pt;
//     });
//
//     return res;
// }


var shiftLines = function(lineset, shift){
    var scaled = [];

    lineset.map(function(line){
        scaled.push([[
            line[0][0]+shift[0],
            line[0][1]+shift[1],
            line[0][2]+shift[2]
        ],[
            line[1][0]+shift[0],
            line[1][1]+shift[1],
            line[1][2]+shift[2]
        ]]);
    });

    return scaled;
};

var shiftLine = function(line, shift){return shiftLines([line], shift)[0]};


function lines2PrismTris(lines, color, height){ //prism of shape on xz plane extruded in y direction
    return lines2PrismWallTris(lines,color,height).concat(lines2PrismCapTris(lines,color,height));
}


function line2PrismTris(line,color,height){ //wall of prism only
    var tri0 = [line[1],line[0],addPts(line[0],[0,height,0])]
    var upperLine = [addPts(line[0],[0,height,0]),addPts(line[1],[0,height,0])] //TODO shift line func
    var tri1 = [upperLine[0],upperLine[1],line[1]]
    var tris = [tri0,tri1];
    if(color){
        tri0.color=color;
        tri1.color=color;
    }
    return tris;
}

function line2PrismCapTris(line,center,color,doFlip){
    var tri = doFlip ?  [line[1],line[0],center] : [line[0],line[1],center];
    if(color){
        tri.color=color;
    }
    return [tri];
}

function averageOfPts(pts){
    var avPt = [0,0,0];
    pts.forEach(function(pt){
        avPt[0]+=pt[0];
        avPt[1]+=pt[1];
        avPt[2]+=pt[2];
    });
    avPt[0]/=pts.length;
    avPt[1]/=pts.length;
    avPt[2]/=pts.length;
    return avPt;
}


function lines2PrismWallTris(lines,color,height){ //walls of prism only
    var res = [];
    lines.forEach(function(line){
        res.push(...line2PrismTris(line,color,height));
    });
    return res;
}

function lines2PrismCapTris(lines,color,height){

    var linesUpper = shiftLines(lines,[0,height,0])

    var centerBottom = averageOfPts(lines.map(l=>l[0]));
    var centerTop = averageOfPts(linesUpper.map(l=>l[0]));
    var resBottom = [];
    var resTop = [];
    lines.forEach(function(line){
        resBottom.push(...line2PrismCapTris(line,centerBottom,color,false));
    });
    linesUpper.forEach(function(line){
        resTop.push(...line2PrismCapTris(line,centerTop,color,true));
    });
    var res = [];
    res.push(...resBottom);
    res.push(...resTop);
    return res;
}

function boundingBlockOfBlocks(blocks){
    // var eps = 0.001;
    // var bb = [blocks[0][0], blocks[0][1]];
    //
    // for(var i=0; i<blocks.length;i++){
    //     var b = blocks[i];
    //     var xLo = Math.min(Math.min(b[0][0],bb[0][0]), Math.min(b[1][0],bb[0][0]));
    //     var xHi = Math.max(Math.max(b[0][0],bb[1][0]), Math.max(b[1][0],bb[1][0]));
    //     var yLo = Math.min(Math.min(b[0][1],bb[0][1]), Math.min(b[1][1],bb[0][1]));
    //     var yHi = Math.max(Math.max(b[0][1],bb[1][1]), Math.max(b[1][1],bb[1][1]));
    //     var zLo = Math.min(Math.min(b[0][2],bb[0][2]), Math.min(b[1][2],bb[0][2]));
    //     var zHi = Math.max(Math.max(b[0][2],bb[1][2]), Math.max(b[1][2],bb[1][2]));
    //     bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    // }
    //
    // return bb;

    return boundingBlockOfPts([].concat(...blocks))
};

var boundingBlockOfLines = boundingBlockOfBlocks;

function boundingBlockOfPts(sop){
    //var eps = 0.001;
    //var L = 9999999;
    var bb = [sop[0],sop[0]];//[[L,L,L],[-L,-L,-L]];//[sop[0],sop[0]];

    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        var xLo = Math.min(Math.min(p[0],bb[0][0]), Math.min(p[0],bb[0][0]));
        var xHi = Math.max(Math.max(p[0],bb[1][0]), Math.max(p[0],bb[1][0]));
        var yLo = Math.min(Math.min(p[1],bb[0][1]), Math.min(p[1],bb[0][1]));
        var yHi = Math.max(Math.max(p[1],bb[1][1]), Math.max(p[1],bb[1][1]));
        var zLo = Math.min(Math.min(p[2],bb[0][2]), Math.min(p[2],bb[0][2]));
        var zHi = Math.max(Math.max(p[2],bb[1][2]), Math.max(p[2],bb[1][2]));
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }

    return bb;
};

function boundingBlockOfTriangles(tris){
    return boundingBlockOfPts([].concat(...tris))
}

function sectorRelativeCoordinates(sector, pos){ //get coords relative to sector s, 0...1 if inside
    //var c = [pos[0]-sector[0][0],pos[1]-sector[0][1],pos[2]-sector[0][2]]; //coords moved to origin but not scaled
    //var dims = sectorDimensions(sector);
    var esp = 0.000001;
    return [(pos[0]-sector[0][0])/(sector[1][0] - sector[0][0]+esp), (pos[1]-sector[0][1])/(sector[1][1] - sector[0][1]+esp),(pos[2]-sector[0][2])/(sector[1][2] - sector[0][2]+esp)];
}

function sectorDimensions(s){
    return [
        s[1][0] - s[0][0],
        s[1][1] - s[0][1],
        s[1][2] - s[0][2]
    ];
}

function sectorRelativeCoordinatesInverse(sector,pt){ //inverse of above
    var dims = sectorDimensions(sector);
    return [
        sector[0][0]+dims[0]*pt[0],
        sector[0][1]+dims[1]*pt[1],
        sector[0][2]+dims[2]*pt[2],
    ];
}

function remapTrisToSector(tris,sector){

    var trisBounds = boundingBlockOfTriangles(tris);
    var relativeTris = tris.map(function(tri){
        return tri.map(pt=>sectorRelativeCoordinates(trisBounds,pt))
    });

    return relativeTris.map(function(tri){
        return tri.map(pt=>sectorRelativeCoordinatesInverse(sector,pt))
    });
}

function remapLinesToSector(lines,sector){
    var linesBounds = boundingBlockOfLines(lines);
    var relativeLines = lines.map(function(line){
        return line.map(pt=>sectorRelativeCoordinates(linesBounds,pt));
    });
    return relativeLines.map(function(line){
        return line.map(pt=>sectorRelativeCoordinatesInverse(sector,pt));
    });
}

function linesetFlipAlongZ(sol){
    var bb = boundingBlockOfLines(sol);

    var bbFlippedZ = [bb[0],bb[1]];
    var oldZ =  bbFlippedZ[0][2];
    bbFlippedZ[0][2] = bbFlippedZ[1][2];
    bbFlippedZ[1][2] = oldZ;

    return remapLinesToSector(sol,bbFlippedZ);
}

function simplifyLines2d(lines,tol){ //xz
    var simplify = require('simplify-path');

//our input polyline
    var path = lines.map(l=>[l[0][0],l[0][2]]); //[ [250, 150], [250, 150], [25, 25], [24, 25], [10, 10] ]
    var tolerance = tol || 0.01;

//result
    path = simplify(path, tolerance)
    var simpLines = [];
    path.forEach(function(pt2d,i){
        var nextPt = path[(i+1)%path.length];
        simpLines.push([[pt2d[0],0,pt2d[1]],[nextPt[0],0,nextPt[1]]]);
    });
    return simpLines;
}

function pts2Lines(sop,ids){
    var res = [];
    for(var i=0;i<ids.length-1;i++){
        res.push([
            sop[parseInt(ids[i])],
            sop[parseInt(ids[i+1])]
        ]);
    }
    return res;
}

function linesLength(lines){
    var total = 0;
    lines.forEach(function(line){
        total+=lineLength(line);
    });
    return total;
}


if(!Math.clamp01){
    (function(){Math.clamp01=function(a/*,b,c*/){return Math.max(0.0,Math.min(1.0,a));}})();
}

var _t_typed = new Float32Array(16);
function distanceFromLineSegmentThickCone_pts(p, a, b, r0, r1){
    _t_typed[0] = p[0]-a[0];
    _t_typed[1] = p[1]-a[1];
    _t_typed[2] = p[2]-a[2];
    _t_typed[3] = b[0]-a[0];
    _t_typed[4] = b[1]-a[1];
    _t_typed[5] = b[2]-a[2];
    _t_typed[6] = Math.clamp01((_t_typed[0]*_t_typed[3]+_t_typed[1]*_t_typed[4]+_t_typed[2]*_t_typed[5]) / (_t_typed[3]*_t_typed[3]+_t_typed[4]*_t_typed[4]+_t_typed[5]*_t_typed[5])); //h
    _t_typed[7] = _t_typed[0]-_t_typed[6]*_t_typed[3]; //[, , _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[8] = _t_typed[2]-_t_typed[6]*_t_typed[5];//[_t_typed[0]-_t_typed[6]*_t_typed[3], _t_typed[1]-_t_typed[6]*_t_typed[4], _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[9] = _t_typed[1]-_t_typed[6]*_t_typed[4]; //[ _t_typed[1]-_t_typed[6]*_t_typed[4],];
    return Math.sqrt(_t_typed[7]*_t_typed[7]+_t_typed[9]*_t_typed[9]+_t_typed[8]*_t_typed[8]) - r0 - (r1-r0)*_t_typed[6];
}

function distanceFromLineSegmentThickCone_pts_squared(p, a, b, r0, r1){
    _t_typed[0] = p[0]-a[0];
    _t_typed[1] = p[1]-a[1];
    _t_typed[2] = p[2]-a[2];
    _t_typed[3] = b[0]-a[0];
    _t_typed[4] = b[1]-a[1];
    _t_typed[5] = b[2]-a[2];
    _t_typed[6] = Math.clamp01((_t_typed[0]*_t_typed[3]+_t_typed[1]*_t_typed[4]+_t_typed[2]*_t_typed[5]) / (_t_typed[3]*_t_typed[3]+_t_typed[4]*_t_typed[4]+_t_typed[5]*_t_typed[5])); //h
    _t_typed[7] = _t_typed[0]-_t_typed[6]*_t_typed[3]; //[, , _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[8] = _t_typed[2]-_t_typed[6]*_t_typed[5];//[_t_typed[0]-_t_typed[6]*_t_typed[3], _t_typed[1]-_t_typed[6]*_t_typed[4], _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[9] = _t_typed[1]-_t_typed[6]*_t_typed[4]; //[ _t_typed[1]-_t_typed[6]*_t_typed[4],];
    return (_t_typed[7]*_t_typed[7]+_t_typed[9]*_t_typed[9]+_t_typed[8]*_t_typed[8]) - r0 - (r1-r0)*_t_typed[6];
}

function lineDistanceSquared(pt,line, lineRadius=0.0){
    return distanceFromLineSegmentThickCone_pts_squared(pt,line[0],line[1],lineRadius,lineRadius);
}

function lineDistance(pt,line, lineRadius=0.0){
    return distanceFromLineSegmentThickCone_pts(pt,line[0],line[1],lineRadius,lineRadius);
}

function lineDirection(line){
    return normalizePt(ptDiff(line[1],line[0]));
}

function angleBetweenRadians(ray0, ray1){ //https://math.stackexchange.com/questions/974178/how-to-calculate-the-angle-between-2-vectors-in-3d-space-given-a-preset-function
    //var dotRays = Vector.dotProduct(ray0.vector, ray1.vector);
    var dotRays = ray0.vector.x*ray1.vector.x + ray0.vector.y*ray1.vector.y + ray0.vector.z*ray1.vector.z;
    //var lenProd = Vector.length(ray0.vector)*Vector.length(ray1.vector);
    var lenProd = Math.sqrt((ray0.vector.x*ray0.vector.x+ray0.vector.y*ray0.vector.y+ray0.vector.z*ray0.vector.z)*(ray1.vector.x*ray1.vector.x+ray1.vector.y*ray1.vector.y+ray1.vector.z*ray1.vector.z));
    var cosQuot = dotRays/lenProd;
    var angleBeRadians = Math.acos(cosQuot);

    return angleBeRadians; //this by itself seems to do same as below...

    //if(dotRays<0){return angleBeRadians+Math.PI;} //obtuse
    //else if(dotRays>0){return angleBeRadians;} //acute
    //return 0; //parallel
}

function angleBetweenLines_radians(line0, line1){
    var lineRay0 = lineDirection(line0);
    var lineRay1 = lineDirection(line1);
    var vec0 = {vector:{x:lineRay0[0],y:lineRay0[1],z:lineRay0[2]}};
    var vec1 = {vector:{x:lineRay1[0],y:lineRay1[1],z:lineRay1[2]}};
    return angleBetweenRadians(vec0,vec1);
}

function angleBetweenLines_degrees(line0, line1){
    return angleBetweenLines_radians(line0, line1)/Math.PI*180.0;
}

module.exports = {addPtsXY, averagePts3, dotProduct: _dotProduct, ptLength, lineClosestTForPt, lineDistanceSquared, lineLengthSquared, angleBetweenLines_degrees,angleBetweenLines_radians,lineDistance,scaleLine, linesLength, pts2Lines, simplifyLines2d,lineIntersectsShape,linesetFlipAlongZ, sector2LinesEdges, remapTrisToSector, boundingBlockOfTriangles, boundingBlockOfPts, boundingBlockOfLines, boundingBlockOfBlocks, lines2PrismTris, lines2ConesTriangles, jitterColorF, shiftLine, shiftLines,lines2PtsWithNeighbors, removeDuplicateLines, lineLineClosestPtsLine, averageOfPts, pt2XLines,ptInsideShape, orthoLines2d, orthoDirs2d, brightenColor,crossProductLines,dotProductLines,crossProduct, lineDirection,reverseLines, ptDiff,addExtraPt, lineDFHighPt, lineDFLowPt, normalizePt, scalePt,triangleNormalLines, lineLength, lineMidPt, centerOfLine, randomPtFromSetOfLines, normalizeLine,addPts, createStarLinesXZ, lineInsideShape, caliLines2d, caliPts2d, ptsXZInPolygonXZ, ptsXZInPolygonXY, getPointAlongLine_dist, lines2Triangles, createCircleLinesXZ, getPointAlongLine, randomOrthoLineFromSetOfLines, jitterPt, jitterPt3d, normalizeAndCenterLine};