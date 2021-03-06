var lu = require('./lines-utils-basic.js');
var tn = require('./triangle-normal.js');
var rcu = require('raycasting-utils');

var RECENT_TRACE_FUNC = null;

function getRecentTracingFunction(){
    return RECENT_TRACE_FUNC;
}

function generateTracingFunction(tris){
    return rcu.trianglesTraceFast_returnIndex_useLine(tris);
}

function cameraSlideOffNormals_triangles(_cameraEye, oldCameraEye, tris, _traceFunc){
    var cameraEye = lu.addPts(_cameraEye,[0,0,0]);

    var traceFunc = _traceFunc || generateTracingFunction(tris);
    RECENT_TRACE_FUNC=traceFunc;

    var movDir = lu.ptDiff(cameraEye,oldCameraEye);
    var moveLine = lu.normalizeLine([oldCameraEye,cameraEye]);

    var traceRes = traceFunc(moveLine) //{dist: dist, index: minIndex, raw: minRes};

    var MIN_DIST = 1.0; //1.0 is reasonable.

    if(traceRes.dist<9999 &&
        (traceRes.dist<MIN_DIST || traceRes.dist<lu.lineLength([oldCameraEye,cameraEye]))){ //lu.lineLength([oldCameraEye,cameraEye])

        var normalPt = lu.scalePt( tn(tris[traceRes.index]),1);

        var dotScale = lu.dotProductLines([[0,0,0],movDir],[[0,0,0],normalPt])

        //reset camera pos...
        cameraEye[0]-=movDir[0];
        cameraEye[1]-=movDir[1];
        cameraEye[2]-=movDir[2];

        //adjust according to normal slide...
        movDir = lu.ptDiff(movDir, lu.scalePt(normalPt, dotScale));

        cameraEye[0]+=movDir[0];
        cameraEye[1]+=movDir[1];
        cameraEye[2]+=movDir[2];
    }

    return cameraEye;
}

var normalAtPt = require('./df-normal-at-pt.js').normalAtPt;

function cameraSlideOffNormals_df(_cameraEye, oldCameraEye, df){
    var cameraEye = lu.addPts(_cameraEye,[0,0,0]);
    //var traceFunc = rcu.traceDf_useLine();
    var movDir = lu.ptDiff(cameraEye,oldCameraEye);
    var moveLine = lu.normalizeLine([oldCameraEye,cameraEye]);

    var traceRes =  rcu.traceDf_useLine(moveLine, df);//traceFunc(moveLine) //{dist: dist, index: minIndex, raw: minRes};

    var MIN_DIST = 1.0; //1.0 is reasonable.

    if(traceRes<9999 &&
        (traceRes<MIN_DIST || traceRes<lu.lineLength([oldCameraEye,cameraEye]))){ //lu.lineLength([oldCameraEye,cameraEye])

        var thePt = lu.getPointAlongLine_dist(moveLine,traceRes); //pt of intersection with df
        var normalPt = lu.scalePt( normalAtPt(df, thePt) ,1); //direction of normal at the intersection pt
        var dotScale = lu.dotProductLines([[0,0,0],movDir],[[0,0,0],normalPt])

        //reset camera pos...
        cameraEye[0]-=movDir[0];
        cameraEye[1]-=movDir[1];
        cameraEye[2]-=movDir[2];

        //adjust according to normal slide...
        movDir = lu.ptDiff(movDir, lu.scalePt(normalPt, dotScale));

        cameraEye[0]+=movDir[0];
        cameraEye[1]+=movDir[1];
        cameraEye[2]+=movDir[2];
    }

    return cameraEye;
}

module.exports = {
    generateTracingFunction,
    getRecentTracingFunction,
    slideAlongTriangles: cameraSlideOffNormals_triangles,
    slideAlongDistanceFunction: cameraSlideOffNormals_df
}