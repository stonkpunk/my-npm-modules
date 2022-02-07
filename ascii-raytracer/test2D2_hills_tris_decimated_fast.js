var art = require('./index.js');

var dfe = require('./distance-function-examples.js');

var s=200;
var res = 256;
var bb = [[-s,-s,-s],[s,s,s]];
var tris = require('./generate-heightmap-mesh.js').generateHeightmapMeshXZ(res,bb,dfe.dfHillsWorld2D,null,100.0,4.00)

//tris = require('./lines-utils.js').remapTrisToSector(tris,bb);

var config = {
    triangles: require('./simplify-tris-fast.js').simplifyTrisFast(tris,0.25,true),//tris,
    cameraPos: [-17.96,8.02,14.72],
    cameraRot: [1.82,-0.40],
    aspectRatio: 4/3,
    mouseControl:true
}

art.runScene(config);