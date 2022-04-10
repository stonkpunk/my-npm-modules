var sdl = require('@kmamal/sdl')

var td = require('./index.js');
var drawTriangle = td.drawTriangle;
var drawTriangleColored = td.drawTriangleColored;
var drawTriangleTextured = td.drawTriangleTextured;
var drawTriangleTextured_flat = td.drawTriangleTextured_flat;

var imageSync = require('image-sync');
//read the image data
var textureData = imageSync.read('./uv-test-tile.png'); //{width, height, data, saveAs}


const window = sdl.video.createWindow({ resizable: true })
var { width, height } = window
var stride = width * 4
var buffer = Buffer.alloc(stride * height)

function rndPt2d(){ //create random 2d point
    return [
        Math.floor(Math.random()*width*1.5-width*0.25),
        Math.floor(Math.random()*height*1.5-height*0.25)
    ]
}

window.on('resize', () => {
     width = window.width;
     height = window.height;
     stride = width * 4
     buffer = Buffer.alloc(stride * height)
    renderOne();
})

setInterval(function(){
    console.log(frames);
    window.setTitle(`FPS: ${frames}`)
    frames=0;
},1000);

var frames=0;
function renderOne(){
    frames++;

    var numTris = 25;
    for(var i=0;i<numTris;i++){
        var triangle = [rndPt2d(),rndPt2d(),rndPt2d()];
        var color = [255,0,0]//[Math.random()*255,Math.random()*255,Math.random()*255];
        var color2 = [0,255,0]//[Math.random()*255,Math.random()*255,Math.random()*255];
        var color3 = [0,0,255]//[Math.random()*255,Math.random()*255,Math.random()*255];
        var colors = [color, color2, color3];

        var uvs = [[0,0,0],[0,1,0],[1,1,0]]; //z coord is ignored

        //drawTriangle(triangle, color, buffer, width, height);
        //drawTriangleColored(triangle, colors, buffer, width, height);
        //drawTriangleTextured(triangle, uvs, buffer, width, height, textureData.data, textureData.width, textureData.height);
        //drawTriangleTextured_flat([].concat(...triangle),0, uvs, buffer, width, height, textureData.data, textureData.width, textureData.height);

        //module.exports.drawTriangleTextured_flatB = function(triArrFlat, triangleIndex, triVertUVs, screenBuffer, screenWidth, screenHeight, texBuffer, texWidth, texHeight, edgesOnly = false){

        drawTriangleTextured_flat([].concat(...triangle),0, uvs, buffer, width, height, textureData.data, textureData.width, textureData.height);

    }

    window.render(width, height, stride, 'rgba32', buffer)

    //renderOne();
    setTimeout(renderOne,1);
}

renderOne();
