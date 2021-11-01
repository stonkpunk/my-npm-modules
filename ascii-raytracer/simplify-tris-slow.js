const tti = require("./triangles-to-index.js");
const meshSimplify = require("mesh-simplify"); //very slow

var expandFactor = 10000.0;

function expandPts(pts){
    var S = expandFactor;
    return pts.map(function(pt){
        return [pt[0]*S,pt[1]*S,pt[2]*S];
    });
}

function contractPts(pts){
    var S = 1.0/expandFactor;
    return pts.map(function(pt){
        return [pt[0]*S,pt[1]*S,pt[2]*S];
    });
}

function simplifyTrisSlow(tris, percent, maxDist){
    var index = tti.indexTriangles(tris);
    var simplified     = meshSimplify(index.cells, expandPts(index.pts))(index.cells.length*percent,maxDist);
    simplified.positions = contractPts(simplified.positions);
    var trisSimple = tti.deIndexTriangles(simplified);
    return trisSimple;
}

module.exports = {simplifyTris: simplifyTrisSlow};