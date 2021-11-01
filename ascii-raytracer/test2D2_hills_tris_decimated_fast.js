var art = require('./index.js');

var dfe = require('./distance-function-examples.js');

var s=20;
var res = 64;
var bb = [[-s,-s,-s],[s,s,s]];
var tris = require('./generate-heightmap-mesh.js').generateHeightmapMeshXZ(res,bb,dfe.dfHillsWorld2D)

var config = {
    triangles: require('./simplify-tris-fast.js').simplifyTrisFast(tris,0.125,true),//tris,
    cameraPos: [-17.96,8.02,14.72],
    cameraRot: [1.82,-0.40],
    aspectRatio: 4/3
}

art.runScene(config);