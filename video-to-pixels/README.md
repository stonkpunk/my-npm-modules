# video-to-pixels

stream raw pixel data from a video, frame by frame

## Installation

```sh
npm i video-to-pixels
```

## Usage 

```javascript
var v2p = require('video-to-pixels');

//https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4
var videoFile = './Big_Buck_Bunny_360_10s_1MB.mp4'

//stream raw unit8 data from video, frame by frame
v2p.videoToPixels(videoFile, function(frameData,width,height){
    //frameData is raw buffer like <Buffer 51 50 37 ff 4e 4d 34 ff 4d 4b 35 ff 4d 4b 35 ff 4e 4c 3 ...
    var rgbaArr = [...frameDataBuffer]; //now it is uint8 array [r,g,b,a,r,g,b,a...]
}, function(){
    console.log('done');
})

//syncronous version
var frameData = v2p.videoToPixelsSync(videoFile);
//^ array of raw buffers, one buffer for each frame


// similar but uses mjpeg vcodec [slower]
// v2p.videoToPixelsJPG(videoFile, function(frameData,width,height){
//     //frameData for mjpg is already uint8 array [r,g,b,a,r,g,b,a...]
// }, function(){
//     console.log('done');
// })
```

## Example - play video in terminal 

```javascript
var v2p = require('video-to-pixels');
var adi = require('ascii-data-image');

//https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4
var videoFile = './Big_Buck_Bunny_360_10s_1MB.mp4'

v2p.videoToPixels(videoFile, function(frameData,width,height){
    //frameData -- <Buffer 51 50 37 ff 4e 4d 34 ff 4d 4b 35 ff 4d 4b 35 ff 4e 4c 3 ...

    //reduce video frame by factor of 16:
    var scaleDown = 16;
    var scaledDownData = v2p.scaleDownByN(scaleDown, frameData, width, height);

    //print to console with ascii-data-image
    var imgStrAscii = adi.buffer2Img(scaledDownData, width/scaleDown);
    adi.writeSelfOverwrite(imgStrAscii);
}, function(){
    console.log('done');
})
```

![terminal video frame](https://i.imgur.com/AdpUg19.png)

## See Also

- [pixels-to-video](https://www.npmjs.com/package/pixels-to-video) - the opposite of this tool, converts raw pixels into videos


<br/><br/>

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



