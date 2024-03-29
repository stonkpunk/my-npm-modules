//todo make candles animation -- wrap up test.js as make-candles-image-buffer.js or something
var p2v = require('pixels-to-video');

var fps = 2; //frames per second
var width = 128;
var height = 128;
var numFrames = 10;

//create flat pixel buffer with random colors [r,g,b,a,r,g,b,a ... ]
function randomColorsBuffer(w,h){
    var arr = [];
    for(var i=0;i<w*h;i++){
        arr.push(
            Math.floor(Math.random()*255), //r
            Math.floor(Math.random()*255), //g
            Math.floor(Math.random()*255), //b
            255 //a [ignored]
        );
    }
    return arr;
}

//////////////////////////////////////////////
//you can load an array of pre-rendered frames
//////////////////////////////////////////////

var frames = [];
for(var i=0;i<numFrames;i++){
    var frame = randomColorsBuffer(width,height);
    frames.push(frame);
}

//p2v.makeQuiet(true); //disable ffmpeg logging

p2v.makeMp4Sync('./output.mp4',frames,width,height,fps)