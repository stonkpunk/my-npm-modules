var art = require('./index.js');

var dfe = require('./distance-function-examples.js');

var s=20;
var res = 64;
var bb = [[-s,-s,-s],[s,s,s]];
var tris = require('./generate-heightmap-mesh.js').generateHeightmapMeshXZ(res,bb,dfe.dfHillsWorld2D)
console.log("decimating triangles, may take a while...");
var trisSimple = require('./simplify-tris-slow.js').simplifyTris(tris,0.25);//, s*2/res*4);


var config = {
    triangles: trisSimple,
    cameraPos: [-41.46,3.02,-3.93],
    cameraRot: [1.57,-0.90],
    aspectRatio: 4/3,
    mouseControl:true,
}




art.runScene(config);