# triangle-draw

quickly draw a filled triangle directly onto a RGBA pixel buffer, filled with interpolated vertex colors, or textures.

uses a modified version of `npm points-in-triangle` to efficiently enumerate points in the triangle.

you can use this to render basic graphics without involving the GPU. 

## Installation

```sh
npm i triangle-draw
```

## Usage 

minimal usage

```javascript
var td = require('triangle-draw');
//triangle = [[x,y],[x,y],[x,y]]
//color = [255,255,255] for white etc
//buffer = RGBA pixel int array[width*height*4] 


//draw solid color triangle
td.drawTriangle(triangle, color, buffer, width, height, edgesOnly=false);

//draw triangle with vertex colors [fill colors are interpolated via barycentric coordinates]
td.drawTriangleColored(triangle, colors, buffer, width, height, edgesOnly=false);

//draw triangle with texture 
td.drawTriangleTextured(triangle, uvs, buffer, width, height, textureBuffer, texWidth, texHeight, edgesOnly=false);


//if you have a flattened arr of 2d triangles...
//trianglesArr = [x,y, x,y, x,y,  x,y, x,y, x,y ... ]
td.drawTriangle_flat(trianglesArr, triangleIndex, color, buffer, width, height, edgesOnly=false);
td.drawTriangleColored_flat(trianglesArr, triangleIndex, colors, buffer, width, height, edgesOnly=false);
td.drawTriangleTextured_flat(trianglesArr, triangleIndex, uvs, buffer, width, height, textureBuffer, texWidth, texHeight, edgesOnly=false);

//using a depth buffer... 
//drawTriangleColored_flat_depth(triArrFlat, triangleIndex, triangleDepths, triangleVertexColors, bufferDepth, w, h, callback, edgesOnly=false)

//set edgesOnly=true to render wireframes...
```

```javascript
//here we draw 100 random triangles and display the result with SDL
var td = require('triangle-draw');
var drawTriangleColored = td.drawTriangleColored;

var sdl = require('@kmamal/sdl')
var window = sdl.video.createWindow({ resizable: true })
var { width, height } = window
var stride = width * 4
var buffer = Buffer.alloc(stride * height)

function rndPt2d(){ //create random 2d point
    return [
        Math.floor(Math.random()*width*1.5-width*0.25),
        Math.floor(Math.random()*height*1.5-height*0.25)
    ]
}

function renderTriangles(){
    var numTris = 100;
    for(var i=0;i<numTris;i++){
        var triangle = [rndPt2d(),rndPt2d(),rndPt2d()];
        var colorA = [255,0,0];
        var colorB = [0,255,0];
        var colorC = [0,0,255];
        var colors = [colorA, colorB, colorC];
        td.drawTriangleColored(triangle, colors, buffer, width, height);
    }
    window.render(width, height, stride, 'rgba32', buffer)
}

renderTriangles();
```

result

![result](https://i.imgur.com/TBxJSVa.png)

Drawing triangles with textures

```javascript
var imageSync = require('image-sync');
//read the image data
var textureData = imageSync.read('./earth.png'); //{width, height, data, saveAs}

//textureData is flat pixels buffer [r,g,b,a, r,g,b,a ...] 

var uvs = [[0,0],[0,1],[1,1]];
td.drawTriangleTextured(triangle, uvs, buffer, width, height, textureData.data, textureData.width, textureData.height);
```

Result
![textured triangles](https://i.imgur.com/jY8aVQq.png)

Texture
![earth texture](https://i.imgur.com/Ebw0kUl.png)

## See Also

- [points-in-triangle](https://www.npmjs.com/package/points-in-triangle) 



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

