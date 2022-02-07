const lf = require("./line-funcs.js");
var ti = require('triangles-index');

function getTrianglesMeshEdges(triangles, cutoffAngleDegrees=45){
    var trianglesIndex = ti.indexTriangles(triangles);
    var triangleNormals = triangles.map(triangle2NormalLine);
    var edgeMap = triangleIndexToEdgeMap(trianglesIndex);
    var edgeList = Object.entries(edgeMap).map(function(ent){
        var ptsIndices = ent[0].split("_").map(int=>parseInt(int));
        var pts = ptsIndices.map(i=>trianglesIndex.pts[i])
        var trisNorms = ent[1].map(i=>triangleNormals[i]);
        var edge_angle = lf.angleBetweenLines(trisNorms[0],trisNorms[1]); //radians
        var edge_angle_degrees = edge_angle / Math.PI / 2.0 * 360.0;
        ent.push(pts);
        ent.push(edge_angle_degrees);
        return ent; //  example [ '58_84', [ 33, 90 ], [ [Array], [Array] ], 15.0250600107909 ],
    }).filter(function(ent){
        return ent[3] > cutoffAngleDegrees;
    }).map(ent => ent[2]); //return only the lines
    return edgeList;
}

function triangleIndexToEdgeMap(index){
    var edgeMap = {};
    index.cells.forEach(function(cell, i){
        var e0 = [cell[0],cell[1]].sort().join("_");
        var e1 = [cell[1],cell[2]].sort().join("_");
        var e2 = [cell[2],cell[0]].sort().join("_");
        edgeMap[e0] = edgeMap[e0] || []; edgeMap[e0].push(i);
        edgeMap[e1] = edgeMap[e1] || []; edgeMap[e1].push(i);
        edgeMap[e2] = edgeMap[e2] || []; edgeMap[e2].push(i);
    });
    return edgeMap;
}

function triangle2NormalLine(tri){
    var triCenter = lf.averagePts3(tri[0],tri[1],tri[2]);
    var sideA = lf.ptDiff(tri[2], tri[0]);
    var sideB = lf.ptDiff(tri[1], tri[0]);
    var normal = lf.normalizeLine([[0,0,0],lf._crossProduct(sideA, sideB)]);
    var ap = lf.addPts(triCenter, normal[1]);
    return [triCenter, ap];
}

module.exports = getTrianglesMeshEdges;