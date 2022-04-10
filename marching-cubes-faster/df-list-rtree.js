var getPointsetBoundsSector = require('./bb-pts.js');

var rTreeObjForTriangle = function(triangle, rad=0.0001){
    var sector = getPointsetBoundsSector(triangle);
    var type="triangle";
    const item = {
        minX: sector[0][0]-rad,
        minY: sector[0][1]-rad,
        minZ: sector[0][2]-rad,
        maxX: sector[1][0]+rad,
        maxY: sector[1][1]+rad,
        maxZ: sector[1][2]+rad,
        orig: {triangle, rad, type},
        type: type
    };
    return item;
}

var rTreeObjForSector = function(sector,rad=0.0001){
    var minX = Math.min(sector[0][0],sector[1][0]);
    var maxX = Math.max(sector[0][0],sector[1][0]);
    var minY = Math.min(sector[0][1],sector[1][1]);
    var maxY = Math.max(sector[0][1],sector[1][1]);
    var minZ = Math.min(sector[0][2],sector[1][2]);
    var maxZ = Math.max(sector[0][2],sector[1][2]);
    var type = "sector";
    const item = {
        minX: minX-rad,
        minY: minY-rad,
        minZ: minZ-rad,
        maxX: maxX+rad,
        maxY: maxY+rad,
        maxZ: maxZ+rad,
        orig: {sector,rad,type},
        type: type
    };
    return item;
}

var rTreeObjForLineCone =
    function lineCone2RTreeObj(lc){
        var {line,r0,r1} = lc;
        //var rad = radius || 0;
        var _line = getPointsetBoundsSector(line.filter(pt=>pt.length==3)); //only take 3d pts not radius pairs
        var maxRad = Math.max(Math.abs(r0), Math.abs(r1));
        var type = "linecone";
        return {
            minX: _line[0][0]-maxRad,
            minY: _line[0][1]-maxRad,
            minZ: _line[0][2]-maxRad,
            maxX: _line[1][0]+maxRad,
            maxY: _line[1][1]+maxRad,
            maxZ: _line[1][2]+maxRad,
            orig: {line,r0,r1,type},
            type: type
        };
    }

var rTreeObjForTetra =
    function lineCone2RTreeObj(tet,rad=0.0001){
        var _line = getPointsetBoundsSector(tet);
        var maxRad = rad;
        var type = "tetrahedron";
        return {
            minX: _line[0][0]-maxRad,
            minY: _line[0][1]-maxRad,
            minZ: _line[0][2]-maxRad,
            maxX: _line[1][0]+maxRad,
            maxY: _line[1][1]+maxRad,
            maxZ: _line[1][2]+maxRad,
            orig: {tet,rad,type},
            type: type
        };
    }

module.exports = {
        rTreeObjForTriangle, rTreeObjForSector, rTreeObjForLineCone, rTreeObjForTetra
};