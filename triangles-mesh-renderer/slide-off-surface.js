var sal = require('slide-along-wall');
var lu = require('./lines-utils.js')
var tdf = require('triangles-distance-fast')

var TDF = null;
var mostRecentPtNonNeg = null;
var keepAboveDfZero = true;
var enableGravity = true;
var FALLSPEED = 0.00;

var MIN_VERT_DIST = 4.0;
var MAX_FALL_DIST = 1000; //if vert dist greater than this, disable gravity

function setFallSpeed(_fs){
    FALLSPEED=_fs;
}

function gravityEnabled(){
    return enableGravity;
}

var lastGravityTime = Date.now();
function cameraSlideOffNormals(cameraEye, oldCameraEye, tris, _traceFunc){

    //cameraEye[1]-=0.1;

    //TODO make this based on normals instead ? so that it works with flat geoms...
    //TODO or edit slide-along-wall to check for "secondary hits"
    TDF=TDF || tdf.trianglesDistance_signed(tris, 1.0);

    if(TDF(...cameraEye)>0){
        mostRecentPtNonNeg = lu.addPts(cameraEye,[0,0,0]);
    }
    var forceReset = false;

    if(enableGravity){
        var gravAmt = 0.1;
        var gravDelta = (Date.now()-lastGravityTime)*gravAmt;
        lastGravityTime=Date.now();
        var traceDown = _traceFunc([cameraEye,lu.addPts(cameraEye,[0,-1,0])]);
        if(traceDown.dist<MAX_FALL_DIST){
            if(traceDown.dist<MIN_VERT_DIST){
                cameraEye[1]+=0.1;
                FALLSPEED = 0.00;
            }else if(traceDown.dist>MIN_VERT_DIST+0.2){
                cameraEye[1]-=FALLSPEED*gravDelta;
                FALLSPEED+=0.01*gravDelta;
            }
        }else{
            var traceDown2 = _traceFunc([lu.addPts(cameraEye,[0,1,0]),lu.addPts(cameraEye,[0,-1,0])]);

            if(traceDown2.dist < MAX_FALL_DIST){
                forceReset=true;
            }
        }
    }

     var res0 = sal.slideAlongTriangles(cameraEye, oldCameraEye, tris, _traceFunc);
     var resS = res0;

    cameraEye[0] += (resS[0]-cameraEye[0]);
    cameraEye[1] += (resS[1]-cameraEye[1]);
    cameraEye[2] += (resS[2]-cameraEye[2]);

    if(forceReset || (keepAboveDfZero && mostRecentPtNonNeg && TDF(...cameraEye)<0)){
        //console.log('reset camera!');

        mostRecentPtNonNeg = lu.addPts(mostRecentPtNonNeg, [0,0.1,0]);

        cameraEye[0] += (mostRecentPtNonNeg[0]-cameraEye[0]);
        cameraEye[1] += (mostRecentPtNonNeg[1]-cameraEye[1]);
        cameraEye[2] += (mostRecentPtNonNeg[2]-cameraEye[2]);
    }

    return cameraEye;
}

module.exports.gravityEnabled = gravityEnabled;
module.exports.setFallSpeed = setFallSpeed;
module.exports.slideOffSurface = cameraSlideOffNormals;