//TODO benchmark triangleInterpolateNormals

// function triangleInterpolateNormals(pt, tri, normalA, normalB, normalC){
//     var bc = triangleBarycentricCoords(pt,tri);
//     return triangleCartesianCoords(bc,[normalA, normalB, normalC])
// }

//record 254ms [999x999] for triangleInterpolateNormalsC

var numberTriangles = 9999;
var randomTriangleList = [];
var randomColorList = [];
var randomTriPts = [];
var ptsPerTri = 999;

var rndPt = function(S=255){
    return [
        Math.random()*S,
        Math.random()*S,
        Math.random()*S
    ]
}

var tin = require('./index.js');
var trp = require('triangle-random-pts');


function integerifyTri(tri){
    tri[0][0] = tri[0][0] << 0;
    tri[0][1] = tri[0][1] << 0;
    tri[0][2] = tri[0][2] << 0;

    tri[1][0] = tri[1][0] << 0;
    tri[1][1] = tri[1][1] << 0;
    tri[1][2] = tri[1][2] << 0;

    tri[2][0] = tri[2][0] << 0;
    tri[2][1] = tri[2][1] << 0;
    tri[2][2] = tri[2][2] << 0;
    return tri;
}

for(var i=0; i<numberTriangles; i++){
    var colors = [rndPt(),rndPt(),rndPt()];
    var tri = [rndPt(),rndPt(),rndPt()];
    var triRndPts = trp.randomPointsInTriangle(tri,ptsPerTri)
    randomTriPts.push(triRndPts);
    randomTriangleList.push(tri);
    randomColorList.push(colors); //integerifyTri
}

var resList = [];
var resListB = [];
var t0=Date.now();
for(var i=0; i<numberTriangles; i++){
    var tri = randomTriangleList[i];
    var colors = randomColorList[i];
    var pts = randomTriPts[i];
    var l = pts.length;

    for(var j=0; j<l; j++){
        var pt = pts[j];
        var res = tin.triangleInterpolateNormals(pt, tri, colors[0],  colors[1],  colors[2]);
        //var resB = tin.triangleInterpolateNormals_old(pt, tri, colors[0],  colors[1],  colors[2]);
        // resList.push(res);
        // resListB.push(resB);
    }
}

console.log(Date.now()-t0,"done");

// var ri = Math.floor(Math.random()*resListB.length);
// console.log(resList[ri],resListB[ri]);

