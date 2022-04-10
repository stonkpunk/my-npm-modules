var windowWidth = 640;
var windowHeight = 480;
var doUpscale4x = false; //if true, renders at 1/4 resolution then upscales with EPX algorithm
var doAntiAlias = false;
var edgesOnly = false; //if true, renders wireframe

var is = require('image-sync');

var rt = require('./index.js');

var bunny = require('bunny'); //{cells, positions}
var triangles = require('triangles-index').deindexTriangles_meshView(bunny); //list of raw triangles, each one [[x,y,z],[x,y,z],[x,y,z]]
//
var textureData = is.read('./cat64.png'); //{width, height, data, saveAs}
//
// var imgTris = require('./image-to-triangles.js').image2Triangles(textureData.data,textureData.width,textureData.height);
//
// console.log(imgTris.tris);
//
// var triangles = imgTris.tris;

var triangleColorsFlat = triangles.map(rt.randomColor); //1 color per triangle [r,g,b] -- [255, 255, 255] for white etc
var triangleColorsVerts = triangles.map(t=>[rt.randomColor(),rt.randomColor(),rt.randomColor()]); //1 color per vert, each triangle gets [[r,g,b],[r,g,b],[r,g,b]]

//basic SDL window
var sdl = require('@kmamal/sdl');
var window = sdl.video.createWindow({ resizable: true, width: windowWidth, height: windowHeight })

var { width, height } = window
var stride = width * 4
var pixelBuffer = Buffer.alloc(width*height*4);

window.on('resize', () => {
    width = window.width;
    height = window.height;
    stride = width * 4;
    pixelBuffer = Buffer.alloc(width*height*4);
})

var fps =0;

//var textureData = require('image-sync').read('./uv-test-tile.png'); //{width, height, data, saveAs}


function renderOne(){
    fps++;
    var radius = 16; //camera spin radius
    var targetPt = [0,5,0]; //point the camera is looking at
    var autoRes = rt.autoRotateCamera(radius, targetPt); //generates a camera spinning around the origin
    var pvMatrix = autoRes.pvMatrix; //find projected view matrix for camera
    var cameraEye = autoRes.cameraEye;

    var flatShading = false; //if false, use per-vertex coloring system, otherwise each triangle is a solid color
    var doFastSort = false; //if true, uses pigeonhole sort to sort triangles by depth - faster but less accurate
    var colors = flatShading ? triangleColorsFlat : triangleColorsVerts;

    rt.clearBuffer(pixelBuffer); //reset the buffer to black

    var config = {
        pixelBuffer:pixelBuffer, //flat pixel buffer [r,g,b,a,  r,g,b,a,  r,g,b,a, ... ]
        width:width, //buffer width
        height:height, //buffer height
        triangles:triangles, //list of triangles, each one has format [[x,y,z],[x,y,z],[x,y,z]]
        triangleColors: colors, //array of colors -- if flatShading=true, [r,g,b] per triangle -- if false, [[r,g,b],[r,g,b],[r,g,b]] for each triangle
        //if you include all these fields, triangles will be rendered with textures:
        triangleUvs: triangles.map(tri=>[[0,1],[1,0],[1,1]]), //each triangle gets 3 uv's , [ [[u,v],[u,v],[u,v]],  [[u,v],[u,v],[u,v]], ...]
        textureBuffer: textureData.data, //same format as pixelBuffer
        textureWidth: textureData.width, //texture width in pixels
        textureHeight: textureData.height, //texture height in pixels
        cameraEye:cameraEye, //[x,y,z]
        pvMatrix:pvMatrix, //4x4 matrix
        edgesOnly:false, //default false, wireframe more
        doUpscale4x: false, //default fault, 4x EPX upscale [4x smaller render]
        doUpscale2x: false,
        doAntiAlias: false, //default false, 2x EPX anti-aliasing [render size unchanged. can be used at same time as upsacle4x.]
        flatShading: flatShading, //default false, flat shading / vertex shading - default false
        doFastSort: doFastSort, //default false, enable pigeonhole sort -- faster, less accurate
        backfaceCulling: true, //default true - skip triangles facing away from camera
        frontfaceCulling: false //default false - skip triangles facing camera ["invert" the space] - note - this is ignored if backfaceCulling=true
    }

    var imgData = rt.renderTriangles(config);

    //render result with SDL
    window.render(width, height, stride, 'rgba32', Buffer.from(imgData)) //note - if using an array for the pixel data instead of a buffer, you need to convert to a buffer with Buffer.from(imgData)

    setTimeout(function(){
        renderOne();
    },1)
}
renderOne();

setInterval(function(){
    window.setTitle(fps+" fps");
    fps=0;
},1000)
