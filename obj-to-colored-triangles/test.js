var TEX = '/Users/user/Documents/datasets/models3d/uploads_files_719569_Satsuki-Bonsai-Collection_OBJ/Ficus Carica_OBJ/Ficus-Carica-Texture-8k.jpg';
var OBJ = '/Users/user/Documents/datasets/models3d/uploads_files_719569_Satsuki-Bonsai-Collection_OBJ/Ficus Carica_OBJ/Ficus-Carica.OBJ';
var SMOOTH_COLORS = false;

var res = require('./index.js').obj2ColoredTrianglesSync(TEX,OBJ,SMOOTH_COLORS)[0];
var rt = require('./index.js').rescaleTris;
var TRIS = rt.rescaleTrisForLargestDimSize(res.tris);
var cellFlatColors = res.cellFlatColors;
//var cellVertsColors = res.cellVertsColors;

var art = require('ascii-raytracer');

var config = {
    tris:TRIS,
    triangleColors: cellFlatColors.map(function(c){return c.map(rgbc=>rgbc/255)}),//tris1.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:false,
    cameraPos: [-3.76,10.20,-8.55],
    cameraRot: [1.95,1.00],
    screenShotScaleUp: 8

}
art.runScene(config);
