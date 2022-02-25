var cc = require("connected-components")

function geomFaceIslands(geom){ //geomFaceIslands geomTriangleIslands triangle islands
    var facesByVertNumber = {};
    geom.faces.forEach(function(cell, i){
        facesByVertNumber[cell.a+""] = facesByVertNumber[cell.a+""] || [];
        facesByVertNumber[cell.a+""].push(i);
        facesByVertNumber[cell.b+""] = facesByVertNumber[cell.b+""] || [];
        facesByVertNumber[cell.b+""].push(i);
        facesByVertNumber[cell.c+""] = facesByVertNumber[cell.c+""] || [];
        facesByVertNumber[cell.c+""].push(i);
    });

    var adjArray = []
    geom.faces.forEach(function(cell, i){
        var allFacesHere = _.uniq([].concat(facesByVertNumber[cell.a+""],facesByVertNumber[cell.b+""],facesByVertNumber[cell.c+""]))
        adjArray.push(allFacesHere);
    });

    //console.log(adjArray, "CCCCC",window.cc(adjArray));

    return cc(adjArray);
}

function faceIdsToTris(idList,geom){
    var res = [];
    idList.forEach(function(triId){
        var face = geom.faces[triId];
        var triA = [geom.vertices[face.a].x,geom.vertices[face.a].y,geom.vertices[face.a].z];
        var triB = [geom.vertices[face.b].x,geom.vertices[face.b].y,geom.vertices[face.b].z];
        var triC = [geom.vertices[face.c].x,geom.vertices[face.c].y,geom.vertices[face.c].z];
        var tri = [triA,triB,triC];
        res.push(tri);
    });
    return res;
}

function faceIdsToGeom(idList,geom){
    var geomTris = faceIdsToTris(idList,geom);
    return tris2Geom(geomTris);
}

function geomBreakIntoIslands(geom){
    var faceIslands = geomFaceIslands(geom);
    var res = [];
    faceIslands.forEach(function(faceIdArray){
        res.push(faceIdsToGeom(faceIdArray,geom));
    });
    return res;
}

module.exports = {geomBreakIntoIslands};