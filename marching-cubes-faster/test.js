var mfc = require('./index.js');
var mb = mfc.meshBuilder;
var dfb = mfc.dfBuilder;

var t0=Date.now();
var theList = [];


for(var i=0; i<1000; i++){
    var radius = 8;
    //dfb.addBrick(theList, dfb.randomBrick(), radius); //add an aabb [[x,y,z],[x,y,z]] with radius padding
    //dfb.addTriangle(theList, dfb.randomTriangle(), radius); //add a triangle [[x,y,z],[x,y,z],[x,y,z]] with radius padding [thickness]
    //dfb.addTetra(theList, dfb.randomTetrahedron(), radius); //add a tetrahedron [[x,y,z],[x,y,z],[x,y,z],[x,y,z]] with radius padding
    dfb.addLine(theList, dfb.randomLine(), radius); //add a line segment [[x,y,z],[x,y,z]] with radius thickness
    //dfb.addLineCone(theList, dfb.randomLineCone()); //add a line segment with different end radii r0 and r1 {line:[[x,y,z],[x,y,z]], r0, r1}

    //simmilar functions for subtracting
    //dfb.subtractBrick(theList, dfb.randomBrick(), radius);
    //dfb.subtractTriangle(theList, dfb.randomTriangle(), radius);
    //dfb.subtractTetra(theList, dfb.randomTetrahedron(), radius);
    //dfb.subtractLine(theList, dfb.randomLine(), radius);
    //dfb.subtractLineCone(theList, dfb.randomLineCone(), radius);
}

var res = mb.buildForList(theList,6); //{cells, positions, dfBuilderResult}
var res = mb.buildForBlock()

console.log("build took", (Date.now()-t0), res.cells.length, "tris");

var lu = require('./lines-utils-basic.js');
var ti = require('triangles-index');
var art = require('ascii-raytracer');
var tris1 = ti.deindexTriangles_meshView(res);

var tn = require('./triangle-normal.js');
var triangleNormalsColors = tris1.map(tn).map(norm => lu.scalePt(lu.normalizePt(lu.addPts(norm,[1,1,1])), 1))

var config = {
    tris:tris1,
    triangleColors: triangleNormalsColors,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:false,
    cameraPos: [22,29,-12],
    cameraRot: [2.2,-4.4]
}
art.runScene(config);
