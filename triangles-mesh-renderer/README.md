# triangles-mesh-renderer

simple software renderer. render an image of a triangle mesh with textures or vertex colors directly to a pixel buffer without using the GPU.  

## Installation

```sh
npm i triangles-mesh-renderer
```

## Usage 

Minimal usage
```javascript
 var tmr = require('triangles-mesh-renderer');

 //build camera matrix
 var cameraEye = [64,64,64]; //camera position
 var cameraTarget = [0,0,0]; //camera looking point
 var pvMatrix = tmr.buildPVMatrix(cameraEye, cameraTarget, up=[0, 1, 0], cameraFovRadians=Math.PI/4, aspect=320/240)

 //get triangles of stanford bunny
 var bunny = require('bunny'); //{cells, positions}
 var triangles = require('triangles-index').deindexTriangles_meshView(bunny); //list of raw triangles, each one [[x,y,z],[x,y,z],[x,y,z]]

 var config = {
    pixelBuffer:pixelBuffer, //flat pixel buffer [r,g,b,a,  r,g,b,a,  r,g,b,a, ... ]
    width:width, //buffer width
    height:height, //buffer height
    triangles:triangles, //list of triangles, each one has format [[x,y,z],[x,y,z],[x,y,z]]
    triangleColors: colors, //array of colors -- if flatShading=true, [r,g,b] per triangle -- if false, [[r,g,b],[r,g,b],[r,g,b]] for each triangle
    //rendering textures:
    //if you include all these commented fields, triangles will be rendered with textures:
    //triangleUvs: uvList, //each triangle gets 3 uv's , [ [[u,v],[u,v],[u,v]],  [[u,v],[u,v],[u,v]], ...]
    //textureBuffer: textureBuffer, //same format as pixelBuffer
    //textureWidth: textureWidth, //texture width in pixels 
    //textureHeight: textureHeight, //texture height in pixels 
    cameraEye:cameraEye, //[x,y,z]
    pvMatrix:pvMatrix, //4x4 matrix representing camera 
    edgesOnly:edgesOnly, //default false, wireframe more
    doUpscale4x: doUpscale4x, //default fault, 4x EPX upscale [4x smaller render]
    //doUpscale2x: doUpscale2x, //similar to doUpscale4x
    //doAntiAlias: doAntiAlias, //default false, 2x EPX anti-aliasing [render size unchanged. can be used at same time as doUpscale4x/2x]
    flatShading: flatShading, //default false, flat shading / vertex shading - default false
    doFastSort: doFastSort //default false, enable pigeonhole sort -- faster, less accurate
     //backfaceCulling: true, //default true - skip triangles facing away from camera
     //frontfaceCulling: false //default false - skip triangles facing camera ["invert" the space] - note - this is ignored if backfaceCulling=true
 }

 var imgData = rt.renderTriangles(config);
```

Complete example with SDL - spinning bunny viewer 

```javascript
var windowWidth = 640;
var windowHeight = 480;
var doUpscale4x = false; //if true, renders at 1/4 resolution then upscales with EPX algorithm
var doAntiAlias = false;
var edgesOnly = false; //if true, renders wireframe

var rt = require('triangles-mesh-renderer');
var bunny = require('bunny'); //{cells, positions}
var triangles = require('triangles-index').deindexTriangles_meshView(bunny); //list of raw triangles, each one [[x,y,z],[x,y,z],[x,y,z]]

var triangleColorsFlat = triangles.map(rt.randomColor); //1 color per triangle [r,g,b] -- [255, 255, 255] for white etc
var triangleColorsVerts = triangles.map(t=>[rt.randomColor(),rt.randomColor(),rt.randomColor()]); //1 color per vert, each triangle gets [[r,g,b],[r,g,b],[r,g,b]]

//basic SDL window
var sdl = require('@kmamal/sdl');
var window = sdl.video.createWindow({ resizable: true, width: windowWidth, height: windowHeight })
var { width, height } = window
var stride = width * 4
var pixelBuffer = Buffer.alloc(width*height*4);

//loading texture data...
var textureData = require('image-sync').read('./earth.png'); //{width, height, data, saveAs}

function renderOne(){
    var radius = 16; //camera spin radius
    var targetPt = [0,5,0]; //point the camera is looking at
    var autoRes = rt.autoRotateCamera(radius, targetPt); //generates a camera spinning around the origin
    var pvMatrix = autoRes.pvMatrix; //find projected view matrix for camera
    var cameraEye = autoRes.cameraEye;

    var flatShading = true; //if false, use per-vertex coloring system, otherwise each triangle is a solid color
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
        // triangleUvs: triangles.map(tri=>[[0,1],[1,0],[1,1]]), //each triangle gets 3 uv's , [ [[u,v],[u,v],[u,v]],  [[u,v],[u,v],[u,v]], ...]
        // textureBuffer: textureData.data, //same format as pixelBuffer
        // textureWidth: textureData.width, //texture width in pixels
        // textureHeight: textureData.height, //texture height in pixels
        cameraEye:cameraEye, //[x,y,z]
        pvMatrix:pvMatrix, //4x4 matrix
        edgesOnly:edgesOnly, //default false, wireframe more
        doUpscale4x: doUpscale4x, //default fault, 4x EPX upscale [4x smaller render]
        //doUpscale2x: doUpscale2x, //similar to doUpscale4x
        doAntiAlias: doAntiAlias, //default false, 2x EPX anti-aliasing [render size unchanged. can be used at same time as doUpscale4x/2x]
        flatShading: flatShading, //default false, flat shading / vertex shading - default false
        doFastSort: doFastSort //default false, enable pigeonhole sort -- faster, less accurate
        //backfaceCulling: true, //default true - skip triangles facing away from camera
        //frontfaceCulling: false //default false - skip triangles facing camera ["invert" the space] - note - this is ignored if backfaceCulling=true
    }

    var imgData = rt.renderTriangles(config);

    //render result with SDL
    window.render(width, height, stride, 'rgba32', imgData)

    setTimeout(function(){
        renderOne();
    },10)
}
renderOne();



```

Result - flatShading = true

![bunny1](https://i.imgur.com/Hl9KmI5.png)

Result - flatShading = false

![bunny2](https://i.imgur.com/3xey2ch.png)

Result - flatShading = true, doUpscale2x = true

![bunny3](https://i.imgur.com/vXLSY4Y.png)

Result - flatShading = true, doUpscale4x = true

![bunny3](https://i.imgur.com/40UMem1.png)

Result - edgesOnly = true

![bunny4](https://i.imgur.com/Ts5WMCe.png)

Result - edgesOnly = true, doAntiAlias = true

![bunny4](https://i.imgur.com/hfSuzvj.png)

Result - textures [image of earth on each triangle]

![bunny5](https://i.imgur.com/JGEDjgF.png)

## See Also

- [triangles-mesh-viewer-sdl-regl](https://www.npmjs.com/package/triangles-mesh-viewer-sdl-regl) - very simple openGL mesh viewer for node.js 



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

