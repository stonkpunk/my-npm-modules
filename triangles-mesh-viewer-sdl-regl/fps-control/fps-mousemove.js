const updateCamera = require("./fps-update-camera.js");
module.exports.processMouseMove = function processMouseMove(sdl, window, cameraData, /*cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix,*/ mouseIsCaptured=true){
    var {cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix} = cameraData;
    //var {cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix} = {...cameraData};

    var evt = {
        x: sdl.mouse.position.x-window.x, y: sdl.mouse.position.y-window.y
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

    res.cameraTheta = cameraTheta;
    res.cameraPhi = cameraPhi;

    if(mouseIsCaptured){
        sdl.mouse.setPosition(window.x + window.width/2, window.y + window.height/2)
    }

    Object.assign(cameraData, res);

    return res;
}
