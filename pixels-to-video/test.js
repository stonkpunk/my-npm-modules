var p2v = require('./index.js');

var fps = 2; //frames per second
var width = 128;
var height = 128;
var frames = [];
var numFrames = 10;

function randomColorsBuffer(w,h){ //create flat pixel buffer with random colors [r,g,b,a,r,g,b,a ... ]
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

for(var i=0;i<numFrames;i++){
    var frame = randomColorsBuffer(width,height);
    frames.push(frame);
}

//p2v.makeQuiet(true); //disable logging

p2v.makeMp4Sync('./output.mp4',frames,width,height,fps)
p2v.makeGifSync('./output.gif',frames,width,height,fps)

var framesSoFar = 0;
function getNextFrame(){
    framesSoFar++;
    if(framesSoFar>10){return null;} //return null to end the stream
    return randomColorsBuffer(width,height);//return
}

p2v.makeMp4StreamedSync('./output2.mp4',getNextFrame,width,height,fps)
framesSoFar = 0;
p2v.makeGifStreamedSync('./output2.gif',getNextFrame,width,height,fps)


//console.log(p2v.makeGifStreamedSync('./output2.gif',getNextFrame,width,height,fps))