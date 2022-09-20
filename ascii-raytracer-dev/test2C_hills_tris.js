var art = require('./index.js');

var dfe = require('./distance-function-examples.js');

var s=40;
var res = 256;
var bb = [[-s,-s,-s],[s,s,s]];
var tris = require('./generate-heightmap-mesh.js').generateHeightmapMeshXZ(res,bb,dfe.dfHillsWorld2D)

var config = {
    triangles: tris,
    cameraPos: [-41.46,3.02,-3.93],
    cameraRot: [1.57,-0.90],
    aspectRatio: 4/3,
    mouseControl:true
}




art.runScene(config);