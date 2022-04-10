const updateCamera = require("./fps-update-camera");
var moveSpeed = 3.0;
var lastTime = Date.now();
var lu = require('./lines-utils.js');
var sos = require('./slide-off-surface.js');

var DO_ENABLE_WALLS = true;

function translateCamera(_cameraEye, pt){
    _cameraEye[0]+=pt[0];
    _cameraEye[1]+=pt[1];
    _cameraEye[2]+=pt[2];
    return _cameraEye;
    // return [
    //     _cameraEye[0]+pt[0],
    //     _cameraEye[1]+pt[1],
    //     _cameraEye[2]+pt[2]
    // ]
}

function processKeys(sdl, cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix, traceFunc, tris){
    var deltaTimeMs = Date.now()-lastTime;
    lastTime=Date.now();

    var t = deltaTimeMs / 1000.0;

    var state = sdl.keyboard.getState();

    var shift = state[225];

    t*=5;
    if(shift){
        t*=5;
    }

    var angles = camera_lookDir;
    var angles2 = camera_lookDir2;

    var oldCameraEye = lu.addPts(cameraEye,[0,0,0]);

    if(state[22]){ //s
        cameraEye = translateCamera(cameraEye,[-angles[0]*moveSpeed*t,-angles[1]*moveSpeed*t,-angles[2]*moveSpeed*t])
    }

    if(state[4]){ //a
        cameraEye = translateCamera(cameraEye,[angles2[0]*moveSpeed*t,angles2[1]*moveSpeed*t,angles2[2]*moveSpeed*t])
    }

    if(state[26]){ //w
        cameraEye = translateCamera(cameraEye,[angles[0]*moveSpeed*t,angles[1]*moveSpeed*t,angles[2]*moveSpeed*t])
    }

    if(state[7]){ //d
        cameraEye = translateCamera(cameraEye,[-angles2[0]*moveSpeed*t,-angles2[1]*moveSpeed*t,-angles2[2]*moveSpeed*t])
    }

    if(state[8]){ //e
        cameraEye = translateCamera(cameraEye,[0,-moveSpeed*t,0])
    }

    if(state[20]){ //q
        cameraEye = translateCamera(cameraEye,[0,moveSpeed*t,0])
    }

    if(state[44]){ //space

        if(sos.gravityEnabled()){
            if(shift){
                t/=5; //cancel out shift effect for jumping
            }

            cameraEye = translateCamera(cameraEye,[0,moveSpeed*t,0])

            if(DO_ENABLE_WALLS){
                if(shift){
                    sos.setFallSpeed(-0.5); //super jump!
                }else{
                    sos.setFallSpeed(-0.1);
                }
            }
        }else{
            cameraEye = translateCamera(cameraEye,[0,moveSpeed*t,0])
        }
    }

    if(DO_ENABLE_WALLS){
        sos.slideOffSurface(cameraEye, oldCameraEye, tris, traceFunc);
    }

    var res = updateCamera(cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix);

    return res;
}

module.exports = {
    processKeys
}
