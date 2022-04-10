var trid = require('triangle-distance');
//var trisd = require('triangles-distance-fast');
var sectorsd = require('./sector-dist-fast.js');
var lineconesd = require('round-cone-distance');
var tetd = require('tetrahedron-distance');

var dfForTriangle = function(tri, radius=1.0){
    return function(x,y,z){
        return trid.triangleDistance_arr([x,y,z],tri)-radius;
    }
};

var dfForSector = function(s, radius=0.0001){
    return sectorsd.dfForSector(s,radius);
};

var dfForLineCone = function(lc){
    var {line, r0, r1} = lc;
    return function(x,y,z){
        return lineconesd.roundConeDistance([x,y,z], line[0], line[1], r0,r1);
    }
}

//var dfForTriangles = require('triangles-distance-fast');

var dfForTetra = function(tet,radius=0){
    return function(x,y,z){
        return tetd.signedDistanceTetrahedron([x,y,z],tet)-radius;
    }
};

module.exports = {
    dfForTriangle, dfForSector, dfForLineCone, dfForTetra
}




