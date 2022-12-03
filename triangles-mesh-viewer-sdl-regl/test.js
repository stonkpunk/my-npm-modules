var tmv = require('./index.js');

//modelViewer(theModel? = bunny); //default model is require('bunny')
var meshViewer = tmv.meshViewer.modelViewer();

//change the model:
//var newModel = require('bitey'); //note that bitey has much bigger scale than bunny
//meshViewer.updateModel(newModel);

//just for hacking/fun/experimentation -- can also launch regl raytracing test scene
//var meshViewer = tmv.raytraceBvhViewer.modelViewer(); //this is just a static test scene, model cannot be updated
