var normalizeLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var len = (Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

function pointNearStartOfLine(line){
    return interpAlongLine(line, 0.001);
}

var interpAlongLine = function(line, t){ //TODO make version with "thickness"?
    var p0=line[0];
    var p1=line[1];
    return [
        p0[0]+(p1[0]-p0[0])*t,
        p0[1]+(p1[1]-p0[1])*t,
        p0[2]+(p1[2]-p0[2])*t
    ];
};


function linePointingTowardsPt(line, p){
    return distPt2PtSq(line[1],p) < distPt2PtSq(line[0],p); //eg returns if end of line is closer than base of line to pt
}

function distPt2PtSq(p0,p1){
    var x=(p0[0]-p1[0]);
    var y=(p0[1]-p1[1]);
    var z=(p0[2]-p1[2]);
    return x*x+y*y+z*z;
}

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

var crossProductLines = function (a, b) {
    return _crossProduct(
        [a[1][0]-a[0][0], a[1][1]-a[0][1], a[1][2]-a[0][2]],
        [b[1][0]-b[0][0], b[1][1]-b[0][1], b[1][2]-b[0][2]]
    );
};

var _crossProduct = function (a, b) { //from gl-vec3 cross
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    var out = [0,0,0];
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out;
};

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3];
}


function averagePts4(p0, p1, p2, p3){
    return [(p0[0]+p1[0]+p2[0]+p3[0])/4, (p0[1]+p1[1]+p2[1]+p3[1])/4, (p0[2]+p1[2]+p2[2]+p3[2])/4];
}

function invertPt(p){
    return [-p[0],-p[1],-p[2]];
}

function tetraNormalLines(p0, p1, p2, p3){ //TODO make faster version no need for face centers for most uses
    //layout of verts:

    //  p0
    //  |\ \
    // d| \b \p3
    //  |a \ / |
    //  |   \  |
    //  | / c\ |
    //  p1----p2

    var faceCenterA = averagePts3(p0, p1, p2);
    var faceCenterB = averagePts3(p0, p3, p2);
    var faceCenterC = averagePts3(p1, p2, p3);
    var faceCenterD = averagePts3(p0, p1, p3);

    var normalA = crossProductLines([p0, p1], [p0, p2]);
    var normalB = crossProductLines([p0, p2], [p0, p3]);
    var normalC = crossProductLines([p1, p3], [p1, p2]);
    var normalD = crossProductLines([p0, p3], [p0, p1]);

    var s = 1.0;

    var normalLineA = normalizeLine([faceCenterA, addPts(faceCenterA,normalA)]);
    var normalLineB = normalizeLine([faceCenterB, addPts(faceCenterB,normalB)]);
    var normalLineC = normalizeLine([faceCenterC, addPts(faceCenterC,normalC)]);
    var normalLineD = normalizeLine([faceCenterD, addPts(faceCenterD,normalD)]);

    var centerPt = averagePts4(p0,p1,p2,p3);

    //simple hacky reliable
    if(linePointingTowardsPt([normalLineA[0], pointNearStartOfLine(normalLineA)], centerPt)){normalA=invertPt(normalA); normalLineA = normalizeLine([faceCenterA, addPts(faceCenterA,normalA)]); normalLineA.flipped=true; /*console.log("flipA");*/}
    if(linePointingTowardsPt([normalLineB[0], pointNearStartOfLine(normalLineB)], centerPt)){normalB=invertPt(normalB); normalLineB = normalizeLine([faceCenterB, addPts(faceCenterB,normalB)]); normalLineB.flipped=true; /*console.log("flipB");*/}
    if(linePointingTowardsPt([normalLineC[0], pointNearStartOfLine(normalLineC)], centerPt)){normalC=invertPt(normalC); normalLineC = normalizeLine([faceCenterC, addPts(faceCenterC,normalC)]); normalLineC.flipped=true; /*console.log("flipC");*/}
    if(linePointingTowardsPt([normalLineD[0], pointNearStartOfLine(normalLineD)], centerPt)){normalD=invertPt(normalD); normalLineD = normalizeLine([faceCenterD, addPts(faceCenterD,normalD)]); normalLineD.flipped=true; /*console.log("flipD");*/}

    /*
    // "should" work but not reliable...
    if(ptIsInsideTetra(pointNearStartOfLine(normalLineA), p0, p1, p2, p3)){normalA=invertPt(normalA); normalLineA = rescaleLine(s,[faceCenterA, addPts(faceCenterA,normalA)]); console.log("flipA");}
    if(ptIsInsideTetra(pointNearStartOfLine(normalLineB), p0, p1, p2, p3)){normalB=invertPt(normalB); normalLineB = rescaleLine(s,[faceCenterB, addPts(faceCenterB,normalB)]); console.log("flipB");}
    if(ptIsInsideTetra(pointNearStartOfLine(normalLineC), p0, p1, p2, p3)){normalC=invertPt(normalC); normalLineC = rescaleLine(s,[faceCenterC, addPts(faceCenterC,normalC)]); console.log("flipC");}
    if(ptIsInsideTetra(pointNearStartOfLine(normalLineD), p0, p1, p2, p3)){normalD=invertPt(normalD); normalLineD = rescaleLine(s,[faceCenterD, addPts(faceCenterD,normalD)]); console.log("flipD");}
    */

    return [normalLineA, normalLineB, normalLineC, normalLineD];
}


function tetraTrisWithFlips(tet){ //TODO add colors
    var p0=tet[0];
    var p1=tet[1];
    var p2=tet[2];
    var p3=tet[3];//

    var norms = tetraNormalLines(p0,p1,p2,p3);
    var vertices = [];
    var trisI = [];
    vertices.push([p0[0], p0[1], p0[2]]);
    vertices.push([p1[0], p1[1], p1[2]]);
    vertices.push([p2[0], p2[1], p2[2]]);
    vertices.push([p3[0], p3[1], p3[2]]);
    trisI.push( norms[0].flipped ? [ 0, 2, 1 ] : [ 0, 1, 2 ] );
    trisI.push( norms[1].flipped ? [ 0, 3, 2 ] : [ 0, 2, 3 ] );
    trisI.push( norms[2].flipped ? [ 1, 2, 3 ] : [ 1, 3, 2 ] );
    trisI.push( norms[3].flipped ? [ 0, 1, 3 ] : [ 0, 3, 1 ] );

    var res=[];
    for(var i=0; i<trisI.length;i++){
        res.push([vertices[trisI[i][0]],vertices[trisI[i][1]],vertices[trisI[i][2]]]);
    }
    return res;
}


module.exports = {tetraTrisWithFlips, tetraNormalLines}