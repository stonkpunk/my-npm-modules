const rt = require("./index");

function anglesToCartesian(r,theta,phi){
    var r = 1.0;
    return[
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    ]
}

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function updateCamera(cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix){
    camera_lookDir = anglesToCartesian(10,cameraTheta, cameraPhi); //angles
    camera_lookDir2 = anglesToCartesian(10,cameraTheta-Math.PI/2.0, Math.PI/2); //angles2
    cameraLookTarget = addPts(cameraEye, camera_lookDir);
    //pvMatrix = rt.buildPVMatrix(cameraEye, cameraLookTarget);
    pvMatrix= rt.buildPVMatrix(cameraEye, cameraLookTarget, [0,1,0]);

    return {
        camera_lookDir,
        camera_lookDir2,
        cameraLookTarget,
        pvMatrix
    }
}

module.exports = updateCamera;