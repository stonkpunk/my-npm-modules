///based on geometry islands

var _ = require('underscore');
var ti = require("triangles-index")
var cc = require("connected-components")

function trianglesIslands(trisIndexed){ //geomFaceIslands geomTriangleIslands triangle islands
    var facesByVertNumber = {};
    trisIndexed.cells.forEach(function(cell, i){
        facesByVertNumber[cell[0]+""] = facesByVertNumber[cell[0]+""] || [];
        facesByVertNumber[cell[0]+""].push(i);
        facesByVertNumber[cell[1]+""] = facesByVertNumber[cell[1]+""] || [];
        facesByVertNumber[cell[1]+""].push(i);
        facesByVertNumber[cell[2]+""] = facesByVertNumber[cell[2]+""] || [];
        facesByVertNumber[cell[2]+""].push(i);
    });

    var adjArray = []
    trisIndexed.cells.forEach(function(cell, i){
        var allFacesHere = _.uniq([].concat(facesByVertNumber[cell[0]+""],facesByVertNumber[cell[1]+""],facesByVertNumber[cell[2]+""]))
        adjArray.push(allFacesHere);
    });

    //console.log(adjArray, "CCCCC",window.cc(adjArray));

    return cc(adjArray);
}


function faceIdsToTris(idList,trisIndex){
    var res = [];
    idList.forEach(function(triId){
        var face = trisIndex.cells[triId];
        var triA = [trisIndex.pts[face[0]][0],trisIndex.pts[face[0]][1],trisIndex.pts[face[0]][2]];
        var triB = [trisIndex.pts[face[1]][0],trisIndex.pts[face[1]][1],trisIndex.pts[face[1]][2]];
        var triC = [trisIndex.pts[face[2]][0],trisIndex.pts[face[2]][1],trisIndex.pts[face[2]][2]];
        var tri = [triA,triB,triC];
        res.push(tri);
    });
    return res;
}

function trianglesIndexBreakIntoIslands(trisIndexed){
    var faceIslands = trianglesIslands(trisIndexed);
    var res = [];
    faceIslands.forEach(function(faceIdArray){
        res.push(faceIdsToTris(faceIdArray,trisIndexed));
    });
    return res;
}

function trianglesBreakIntoIslands(tris){
    var trisI = ti.indexTriangles(tris);
    return trianglesIndexBreakIntoIslands(trisI);
}

var geomBreakIntoIslands = require('./geometry-islands.js').geomBreakIntoIslands;

module.exports = {trianglesBreakIntoIslands, trianglesIndexBreakIntoIslands, geomBreakIntoIslands}