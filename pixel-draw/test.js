var pixelDrawing = require('./index.js');

var width = 512;
var height = 512;
var pd = new pixelDrawing(width,height);

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

var transparentColor = [255,255,255]; //default [255,255,255]
var enableTransparency = true; //default true
pd.drawCanvas(256,256, pd, transparentColor, enableTransparency);


pd.drawCanvas(256,256, pd, transparentColor, enableTransparency);


//drawing using functions:

function invertColorsFunction(x,y,existingColor){
    var invertedColor = [255-existingColor[0],255-existingColor[1],255-existingColor[2]];
    return invertedColor;
}

function replaceWhiteWithNoiseFunction(x,y,existingColor){
    var noise = [1,2,3].map(n=>Math.floor(Math.random()*255))
    var colorIsWhite = existingColor[0]==255 && existingColor[1]==255 && existingColor[2]==255;
    if(colorIsWhite){return noise;}
    return existingColor;
}

//draw filled rectangle with color per-pixel defined by function color(x,y,existingColorRGB_uInt8s) => [R,G,B] uInt8's
pd.drawFunction(5,50,140,40, invertColorsFunction);
pd.drawFunction(5,150,140,40, replaceWhiteWithNoiseFunction);


//get pixel
console.log(pd.getPixel(256,256)); //[1,2,3]

//faster pixel puts and gets:
//use ._getPixel and ._putPixel to skip bounds check

//pc.image = {data = [r,g,b,a,r,g,b,a... int8s], width, height, saveAs} like from require('image-sync')

//resize/crop/"uncrop" the canvas (x,y,w,h,bgColor)
//pd.crop(-20,-20,640,640,[255,0,0]);

//get cropped version of canvas without changing the original canvas
//var cropped = pd.getCropped(-20,-20,640,640,[255,0,0])

pd.saveAs('./test.png');