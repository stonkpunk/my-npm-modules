
var mat4       = require('gl-matrix').mat4
//todo refactor these 2 together
function buildPVMatrix(cameraEye, target=[0,0,0], up=[0, 1, 0], cameraFovRadians=Math.PI/4, aspect=320/240, _viewMatrix=null, NEAR=0.1, FAR=1000){
    var pvMatrix   = new Float32Array(16)
    var projection = new Float32Array(16)
    var viewMatrix   = new Float32Array(16)

    if(_viewMatrix){
        viewMatrix = _viewMatrix
    }else{
        mat4.lookAt(viewMatrix, cameraEye, target, up);
    }

    mat4.perspective(projection
        , cameraFovRadians                  // field of view
        , aspect //width / height // aspect ratio
        , NEAR
        , FAR
    )
    mat4.mul(pvMatrix, projection, viewMatrix)

    // these should be the same:
    // console.log("matrix dir is", normalizePt( ptDiff(target,cameraEye)) );
    // console.log("extracted dir is", [pvMatrix[2],pvMatrix[6],pvMatrix[10]]);

    return pvMatrix;
}

//todo refactor these 2 together
function buildPVMatrix_parts(cameraEye, target=[0,0,0], up=[0, 1, 0], cameraFovRadians=Math.PI/4, aspect=320/240, _viewMatrix=null, NEAR=0.1, FAR=1000){
    var pvMatrix   = new Float32Array(16)
    var projection = new Float32Array(16)
    var viewMatrix   = new Float32Array(16)

    if(_viewMatrix){
        viewMatrix = _viewMatrix
    }else{
        mat4.lookAt(viewMatrix, cameraEye, target, up);
    }

    mat4.perspective(projection
        , cameraFovRadians                  // field of view
        , aspect //width / height // aspect ratio
        , NEAR
        , FAR
    )

    return {projection, viewMatrix};
}

module.exports = {buildPVMatrix, buildPVMatrix_parts};