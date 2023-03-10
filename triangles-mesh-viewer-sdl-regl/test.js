var tmv = require('./index.js');

//modelViewer(theModel? = bunny); //default model is require('bunny')

var bunny = require('bunny');

//example with smooth vertex colors
//bunny.vertexColors = bunny.positions.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

//example with discontinuous vertex colors -- force each tri to have its own verts
bunny = require('triangles-index').demergeMeshTriangles_meshView(require('bunny'));
bunny.vertexColors = bunny.positions.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

//face colors
//bunny.faceColors = bunny.cells.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

//todo stress test - tile the bunnys -- use utils/grid-repeat-triangles.js

var meshViewer = tmv.meshViewer.modelViewer(bunny);

//change the model:
//var newModel = require('bitey'); //note that bitey has much bigger scale than bunny
//meshViewer.updateModel(newModel);

//just for hacking/fun/experimentation -- can also launch regl raytracing test scene
//var meshViewer = tmv.raytraceBvhViewer.modelViewer(); //this is just a static test scene, model cannot be updated
