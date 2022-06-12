var sdl = require('@kmamal/sdl');
var td = require('./index.js');
var drawTriangleColored = td.drawTriangleColored;
var drawTriangleColored_flat = td.drawTriangleColored_flat;
var drawTriangleTextured_flat = td.drawTriangleTextured_flat;

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
        drawTriangleColored(triangle, colors, buffer, width, height, true);
        drawTriangleColored_flat([].concat(...triangle).concat(...triangle), 1, colors, buffer, width, height, true);
        //drawTriangleColored_flat([].concat(...triangle).concat(...triangle), 1, colors, buffer, width, height, true);
    }
    window.render(width, height, stride, 'rgba32', buffer)
}

renderTriangles();
