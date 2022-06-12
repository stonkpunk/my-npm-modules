# pixel-draw

draw stuff directly onto a pixel buffer similar to a canvas

draw pixel text, lines, triangles, circles, rectangles, crop the results

## Installation

```sh
npm i pixel-draw
```

## Usage 

```javascript
var pixelDrawing = require('pixel-draw');

var width = 512;
var height = 512;
//pixelCanvas(w=512,h=512,bg=[255,255,255])
var pd = new pixelDrawing(width,height);

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

//put pixel
pd.putPixel(256,256, [1,2,3]);

//get pixel
var c = pd.getPixel(256,256);
console.log(c); //[1,2,3]

//faster pixel puts and gets:
//use ._getPixel and ._putPixel to skip bounds check

//pc.image = {data = [r,g,b,a,r,g,b,a... int8s], width, height, saveAs} like from require('image-sync')

//resize/crop/"uncrop" the canvas (x,y,w,h,bgColor)
//pd.crop(-20,-20,640,640,[255,0,0]);

//get cropped version of canvas without changing the original canvas
//var cropped = pd.getCropped(-20,-20,640,640,[255,0,0])

pd.saveAs('./test.png');

//clear the image
//pd.clear(color=[255,255,255]);
```

![test.png](https://i.imgur.com/oVmTVQQ.png)






[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



