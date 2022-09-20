var v2p = require('./index.js');
var adi = require('ascii-data-image');

//https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4
var videoFile = './Big_Buck_Bunny_360_10s_1MB.mp4'

v2p.videoToPixels(videoFile, function(frameData,width,height){
    //frameData -- <Buffer 51 50 37 ff 4e 4d 34 ff 4d 4b 35 ff 4d 4b 35 ff 4e 4c 3 ...
    //var rgbaArr = [...frameDataBuffer];

    //reduce video frame by factor of 16:
    var scaleDown = 16;
    var scaledDownData = v2p.scaleDownByN(scaleDown, frameData, width, height);

    //print to console with ascii-data-image
    var imgStrAscii = adi.buffer2Img(scaledDownData, width/scaleDown);
    adi.writeSelfOverwrite(imgStrAscii);
}, function(){
    console.log('done');
})

// v2p.videoToPixelsJPG(videoFile, function(frameData,width,height){
//     //frameData -- Uint8Array(921600) [ 69, 72, 51, 255, 69, 72, 51, 255, 69, 72, 51, 255, ...
//     var scaleDown = 16;
//     //get video frame reduced by factor of 16
//     var scaledDownData = v2p.scaleDownByN(scaleDown, frameData, width, height);
//     var imgStrAscii = adi.buffer2Img(scaledDownData, width/scaleDown);
//     adi.writeSelfOverwrite(imgStrAscii);
// }, function(){
//     console.log('done');
// })

// var frameData = v2p.videoToPixelsSync(videoFile);
// console.log(frameData.length,frameData[0].length, frameData[0]);


