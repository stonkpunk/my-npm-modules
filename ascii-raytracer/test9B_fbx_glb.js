var art = require('./index.js');

//convert fbx to glb...
//this works:
// const convert = require('fbx2gltf');
// convert('./park.fbx', './park.glb', ['--khr-materials-unlit']).then(
//     destPath => {
//         // yay, do what we will with our shiny new GLB file!
//         console.log("OK",destPath);
//     },
//     error => {
//         // ack, conversion failed: inspect 'error' for details
//         console.log("ERR",error)
//     }
// );
//preview result withwith https://gltf-viewer.donmccurdy.com/

//then parse glb...
//works but obtuse results: //TODO maybe try traverse func? -- flatten it like this ! https://github.com/donmccurdy/glTF-Transform/issues/11
const { Document, Scene, WebIO, NodeIO } = require('@gltf-transform/core');
const { inspect } = require('@gltf-transform/functions');
const io = new NodeIO();
var res = inspect(io.read('./park.glb'));
console.log("READ MODEL", res.meshes.properties);//.json.meshes.map(m=>m.primitives.map(p=>p.attributes)));

var config = {
    stl: "./Bitey_Reconstructed_5k.stl",
    mouseControl:true,
    // stlRandomColors:true,
    // cameraPos: [129.49,42.19,22.64],
    // cameraRot: [1.7,-5.64]
}

art.runScene(config);