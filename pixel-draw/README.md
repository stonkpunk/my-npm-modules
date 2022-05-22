# pixel-draw

draw stuff directly onto a pixel buffer similar to a canvas

draw pixel text, lines, triangles, circles, rectangles

## Installation

```sh
npm i pixel-draw
```

## Usage 

```javascript
var pixelDrawing = require('pixel-draw');

var width = 512;
var height = 512;
var pd = pixelDrawing(width,height);

//pd.image = {data = [r,g,b,a,r,g,b,a... int8s], width, height, saveAs} -- as from require('image-sync')
//pd.image.data is the pixel data ^^^

//drawText(text, offset, color=[0,0,0], doExpandText=true, maxLineLen=50)
pd.drawText("ok", [5,5], [0,0,0]); //draw text at offset [5,5]

//drawTriangle(tri, color=[255,0,0], edgesOnly=false)
var triangle = [[256,256],[256+40,256+Math.floor(Math.random()*256)],[256-40,256]];
pd.drawTriangle(triangle, [255,0,0]); //draw red triangle 
var triangle2 = [[256,256],[256+40,256+Math.floor(Math.random()*256)],[256-40,256]];
pd.drawTriangle(triangle2,[[255,0,0],[0,255,0],[0,0,255]]); //draw triangle with vertex colors

//drawRectangle(x,y,_w,_h, color=[255,0,0], filled=true, thickness=2.0)
pd.drawRectangle(50,50,10,100,[0,0,255]); //draw filled rectangle
pd.drawRectangle(150,150,40,40,[[0,0,0],[255,0,0],[0,255,0],[0,0,255]]); //draw rectangle with vertex colors
pd.drawRectangle(150,150,10,100,[0,255,255], false, 2.0); //draw rectangle outline with thickness 2.0, filled=false

// drawCircle(x,y,radius,color=[255,0,0], filled=true, thickness=2.0)
pd.drawCircle(300,300, 64, [255,0,0],false, 2.0) //draw circle with thickness 2, filled=false

//drawLine(line,color=[0,255,0],thickness=2,endcaps=true)
var thicknessStartEnd = [2,32]
var lineEndCaps = true; //circular endCaps, otheriwse square endCaps 
pd.drawLine([[20,20],[280,280]], [[255,0,0],[0,255,0]], thicknessStartEnd, lineEndCaps); //thick line with linear gradient colors and different start/end thickness 
pd.drawLine([[20,20],[280,280]], [255,0,0], 16, lineEndCaps); //thick line, thickness=16, solid colors
pd.drawLine([[20,20],[280,280]], [255,0,0], 0, lineEndCaps); //thin line, thickness=0, solid colors only 

pd.saveAs('./test.png');
```
![test.png](https://i.imgur.com/oVmTVQQ.png)
result





[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



