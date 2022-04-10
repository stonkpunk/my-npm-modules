var mat4       = require('gl-matrix').mat4
var vec3       = require('gl-matrix').vec3

function getCorners(_pvMatrix){
    var pvInv = new Float32Array(16)

    mat4.invert(pvInv, _pvMatrix);

    var unitCubePts = [
        [-1,-1,-1],
        [1,-1,-1],
        [-1,1,-1],
        [1,1,-1],
        [-1,-1,1],
        [1,-1,1],
        [-1,1,1],
        [1,1,1]
    ];

    var ptTransf = unitCubePts.map(function(pt){
        var ptTransf = new Float32Array(3)
        return vec3.transformMat4(ptTransf, pt, pvInv);
    });

    return ptTransf;
}

function getOutwardRayXY(_pvMatrix,x=0.5,y=0.5, _pvInv){ //x,y 0...1 going across the screen, 0.5,0.5 in the center
    var pvInv = _pvInv || new Float32Array(16)
    if(!_pvInv){mat4.invert(pvInv, _pvMatrix);}
    var X = x*2-1;
    var Y = y*2-1;
    var resA = new Float32Array(3);
    var resB = new Float32Array(3);
    vec3.transformMat4(resA, [X,Y,-1], pvInv);
    vec3.transformMat4(resB, [X,Y,1], pvInv);
    return [resA,resB];
}

module.exports = {getCorners, getOutwardRayXY}