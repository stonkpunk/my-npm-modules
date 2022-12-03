
var ttt = require('./index.js');

var res = ttt.renderTextAsTrianglesAndLines("H?@終極鴨醬");
var mesh = res.tris;
//mesh.push(...res.linesTris);

// res = {
//     tris: meshTrisRemapped, //triangles raw
//     lines: lines2, //edge line segments
//     linesTris: linesTris  //triangles representing edge-beams
// }

var config = {
    tris:mesh,
    triangleColors: mesh.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    cameraPos: [22,29,-12],
    cameraRot: [2.37,-4.5]
}

var art = require('ascii-raytracer');
art.runScene(config);

//update the triangles in the scene...
var t0=Date.now();
setInterval(function(){
    var res = ttt.renderTextAsTrianglesAndLines((Date.now()-t0)+"");
    var mesh = res.tris;
    art.updateDfForTris(mesh);
},1000);