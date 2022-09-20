var art = require('./index.js');
var dfu = require('./distance-function-utils.js');
var ttt = require('./text-to-triangles.js');

var res = ttt.renderTextAsTrianglesAndLines("H?@大馬");
var mesh = res.tris;
//mesh.push(...res.linesTris);

var config = {
    tris:mesh,
    triangleColors: mesh.map(t=>[Math.random(),Math.random(),Math.random()]),
    //lines: lines2,
    //lineColors: lines2.map(l=>[Math.random(),Math.random(),Math.random()]), //TODO why color ignored? must be present but always green ....
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    cameraPos: [22,29,-12],
    cameraRot: [2.37,-4.5]
}

art.runScene(config);

//update the triangles in the scene...
var t0=Date.now();
setInterval(function(){
    var res = ttt.renderTextAsTrianglesAndLines((Date.now()-t0)+"");
    var mesh = res.tris;
    art.updateDfForTris(mesh);
},1000);