var pixelDrawing = require('./index.js');

var width = 512;
var height = 512;
var pd = pixelDrawing(width,height);

var thicknessStartEnd = [2,32]
var lineEndCaps = true; //circular endCaps, otheriwse square endCaps
pd.drawLine([[20,20],[280,280]], [[255,0,0],[0,255,0]], thicknessStartEnd, lineEndCaps); //thick line with linear gradient colors and different start/end thickness
pd.drawLine([[20,20],[280,280]], [0,0,0], 4, lineEndCaps); //thick line, thickness=4, solid colors

lineEndCaps=false;
pd.drawLine([[280,20],[20,280]], [0,255,0], 15, lineEndCaps); //thick green line, thickness=15, no end caps

pd.drawLine([[20,20],[280,280]], [255,0,0], 0, lineEndCaps); //thin line, thickness=0, [solid colors only for 0 thickness]


pd.drawText("ok", [5,5]); //draw text at offset [5,5]
var tri = [[256,256],[256+40,256+Math.floor(Math.random()*256)],[256-40,256]];
pd.drawTriangle(tri, [255,0,0]); //draw red triangle
var tri2 = [[256,256],[256+40,256+Math.floor(Math.random()*256)],[256-40,256]];
pd.drawTriangle(tri2,[[255,0,0],[0,255,0],[0,0,255]]); //draw triangle with vertex colors
pd.drawRectangle(50,50,10,100,[0,0,255]); //draw filled rectangle
pd.drawRectangle(150,150,40,40,[[0,0,0],[255,0,0],[0,255,0],[0,0,255]]); //draw rectangle with vertex colors
pd.drawRectangle(150,150,10,100,[0,255,255], false, 2.0); //draw rectangle outline with thickness 2.0, filled=false
pd.drawCircle(300,300, 64, [255,0,0],false, 2.0) //draw circle with thickness 2, filled=false

//put pixel
pd.putPixel(256,256, [1,2,3]);

//get pixel
console.log(pd.getPixel(256,256)); //[1,2,3]

//faster pixel puts and gets:
//use ._getPixel and ._putPixel to skip bounds check

//pc.image = {data = [r,g,b,a,r,g,b,a... int8s], width, height, saveAs} like from require('image-sync')

pd.saveAs('./test.png');