const updateCamera = require("./fps-update-camera.js");
var matrixFrustrumCorners = require('./matrix-frustrum-corners.js');
module.exports.processMouseMove = function processMouseMove(sdl, window, cameraData, mouseIsCaptured=true){
    var {cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix} = cameraData;

    var evt = {
        x: sdl.mouse.position.x-window.x, y: sdl.mouse.position.y-window.y
    }

    var evtNormalized = {
        x: (sdl.mouse.position.x-window.x)/window.width, y: (sdl.mouse.position.y-window.y)/window.height
    }

    var evtCentered = {
        x: sdl.mouse.position.x-window.x-window.width/2, y: sdl.mouse.position.y-window.y-window.height/2
    }

    sdl.mouse.showCursor(!mouseIsCaptured);

    if(mouseIsCaptured){
        cameraTheta+=(evt.x-window.width/2)/window.width;//,
        cameraPhi+=(evt.y-window.height/2)/window.height;

        cameraTheta = Math.max(0,Math.min((cameraTheta+2*Math.PI*100)%(2*Math.PI),2*Math.PI));
        cameraPhi = Math.max(0,Math.min(cameraPhi,Math.PI));
    }

    var res = updateCamera(cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix);

    res.evt = evt;
    res.evtCentered = evtCentered;
    res.evtNormalized = evtNormalized;

    res.cameraTheta = cameraTheta;
    res.cameraPhi = cameraPhi;

    res.outwardMouseRay = matrixFrustrumCorners.getOutwardRayXY(res.pvMatrix,evtNormalized.x,1.0-evtNormalized.y);

    //console.log(evtNormalized);

    if(mouseIsCaptured){
        sdl.mouse.setPosition(window.x + window.width/2, window.y + window.height/2)
    }

    Object.assign(cameraData, res);

    return cameraData;
}
