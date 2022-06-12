# pixels-to-video

convert raw pixel data into GIFs or MP4s

pipes image data directly into ffmpeg - no need for temporary image files

much of the code is based on [this thread](https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/546)

## Installation

First install [ffmpeg](https://ffmpeg.org/download.html)

Then
```sh
npm i pixels-to-video
```

## Usage 

Here we create a GIF and MP4 with random colors
```javascript
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
p2v.makeGifSync('./output.gif',frames,width,height,fps)

//async versions of these functions
//p2v.makeMp4('./output.mp4',frames,width,height,fps,cb)
//p2v.makeGif('./output.gif',frames,width,height,fps,cb)

///////////////////////////////////////////////
//or you can "stream" the frames in 1 at a time
///////////////////////////////////////////////

var framesSoFar = 0;
function getNextFrame(){
    framesSoFar++;
    if(framesSoFar>10){return null;} //return null to end the stream
    return randomColorsBuffer(width,height);//return 
}

p2v.makeMp4StreamedSync('./output2.mp4',getNextFrame,width,height,fps)

framesSoFar = 0;
p2v.makeGifStreamedSync('./output2.gif',getNextFrame,width,height,fps)

// async versions of these functions
// p2v.makeMp4Streamed('./output2.mp4',getNextFrame,width,height,fps,cb)
// p2v.makeGifStreamed('./output2.gif',getNextFrame,width,height,fps,cb)
```

The resulting GIF:

![result](https://i.imgur.com/n1NOrhi.gif)
