
var gen = require('./index.js');

var resolution = 256;
var size = 64;
var boundingBox_XZ = [[-size,0,-size],[size,0,size]];
var df = gen.dfHillsWorld2D; //default distance function - see also dfHillsWorld2D_smooth
var yCoordinate=-10.0; //y-coord to use in 3d distance function sampler
var df_scaleXZ=100.0; //scale df along x-z, default 100 -- you can leave this constant to have the bounding box reveal more land as it expands, OR make this value proportional to the bounding box, to have the result expand to the same size as the bounding box
var df_scaleY=4; //scale result height, default 4
var postSimplifyFactor=0.25; //default 1 [no simplify] -- if less than 1, decimate triangles to the fraction indicated

var doAddSkirt = true;
var skirtY = -10;
var triangles = gen.generateHeightmapMeshXZ(resolution, boundingBox_XZ, df, yCoordinate, df_scaleXZ, df_scaleY, postSimplifyFactor, doAddSkirt, skirtY);

//view result with ascii-raytracer
var art = require('ascii-raytracer');
var config = {
    triangles:triangles,
    //triangleColors: triangles.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    cameraMode: 0,
    mouseControl:true,
    antiAlias: true
}

art.runScene(config);