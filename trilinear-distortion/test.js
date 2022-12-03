var bunny = require('bunny'); //bunny mesh {cells, positions}
var tmv = require('triangles-mesh-viewer-sdl-regl'); //triangle mesh viewer
var meshViewer = tmv.meshViewer.modelViewer(bunny); //load bunny into viewer

var distort = require('./index.js');

//create distortion object from corners of mesh bounding box
var distortionObj = distort.distortionObjFromMesh(bunny);

//add extra triangles to mesh to make bounding box visible
distort.addBoundingBoxLinesToMesh(bunny);

//distortionObj has format:
// {
//     p000: [x,y,z], //lower xyz corner
//     p001: [x,y,z],
//     p010: [x,y,z],
//     p011: [x,y,z],
//     p100: [x,y,z],
//     p101: [x,y,z],
//     p110: [x,y,z],
//     p111: [x,y,z], //upper xyz corner
// }

//randomly jitter the corners of the distortion object
setInterval(function(){
    //distortionObj = distort.jitterDistortionObjectCopy(distortionObjOrig, 0.50); //jitter a copy instead of modifying orig
    distortionObj = distort.jitterDistortionObjectInPlace(distortionObj, 0.50); //randomly jitter corners
    var newModel = distort.distortedMeshCopy(bunny, distortionObj);
    meshViewer.updateModel(newModel); //update the model in the mesh viewer
},100);


//all functions:
//distortionObjUnit() ==> distortionObj at corners of unit cube [[0,0,0],[1,1,1]]
//distortionObjFromAABB(boundingBox=[[x,y,z],[x,y,z]]) ==> distortionObj
//distortionObjFromMesh(bunny)
//distortPtTrilinear(pt, aabbStarting, distortionObj)
//distortPtsTrilinear(pts, aabbStarting, distortionObj)
//meshBoundingBox(bunny = {cells,positions}) ==> [[x,y,z],[x,y,z]] = [minCorner,maxCorner] //aka aabb
//boundingBoxOfPts(pts = [[x,y,z] ... ])
//addBoundingBoxLinesToMesh(bunny)
//jitterDistortionObjectInPlace(distortionObj, amt)
//jitterDistortionObjectCopy(distortionObj, amt)
//distortMeshInPlace(bunny, distortionObj)
//distortedMeshCopy(bunny, distortionObj)