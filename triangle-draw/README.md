# triangle-draw

quickly draw a filled triangle directly onto a RGBA pixel buffer, filled with interpolated vertex colors.

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

## See Also

- [points-in-triangle](https://www.npmjs.com/package/points-in-triangle) 


