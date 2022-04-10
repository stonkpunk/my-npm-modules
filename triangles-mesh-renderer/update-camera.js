var mat4       = require('gl-matrix').mat4

function updateCamera(cameraEye, target=[0,0,0], up=[0, 1, 0], cameraFovRadians=Math.PI/4, aspect=320/240){
    var pvMatrix   = new Float32Array(16)
    var projection = new Float32Array(16)
    var viewMatrix   = new Float32Array(16)
    mat4.lookAt(viewMatrix, cameraEye, target, up);
    mat4.perspective(projection
        , cameraFovRadians                  // field of view
        , aspect //width / height // aspect ratio
        , 0.001
        , 1000
    )
    mat4.mul(pvMatrix, projection, viewMatrix)
    return {pvMatrix, viewMatrix};
}

module.exports = updateCamera;