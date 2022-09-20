//from https://github.com/phaux/node-ffmpeg-stream
//see also beamcoder https://github.com/Streampunk/beamcoder/blob/master/examples/jpeg_filter_app.js

const { Transform } = require("stream")

class ExtractFrames extends Transform {
    constructor(magicNumberHex) {
        super({ readableObjectMode: true })
        this.magicNumber = Buffer.from(magicNumberHex, "hex")
        this.currentData = Buffer.alloc(0)
    }

    _transform(newData, encoding, done) {
        // Add new data
        this.currentData = Buffer.concat([this.currentData, newData])

        // Find frames in current data
        while (true) {
            // Find the start of a frame
            const startIndex = this.currentData.indexOf(this.magicNumber)
            if (startIndex < 0) break // start of frame not found

            // Find the start of the next frame
            const endIndex = this.currentData.indexOf(
                this.magicNumber,
                startIndex + this.magicNumber.length
            )
            if (endIndex < 0) break // we haven't got the whole frame yet

            // Handle found frame
            this.push(this.currentData.slice(startIndex, endIndex)) // emit a frame
            this.currentData = this.currentData.slice(endIndex) // remove frame data from current data
            if (startIndex > 0) console.error(`Discarded ${startIndex} bytes of invalid data`)
        }

        done()
    }

    // TODO: Fix not emitting the last frame in a stream
}

class ExtractFramesRaw extends Transform {
    constructor(width,height) {
        super({ readableObjectMode: true })
        //this.magicNumber = Buffer.from(magicNumberHex, "hex")
        this.width = width;
        this.height = height;
        this.currentData = Buffer.alloc(0)
    }

    _transform(newData, encoding, done) {
        // Add new data
        this.currentData = Buffer.concat([this.currentData, newData])

        // Find frames in current data
        while (true) {

            var intsPerFrame = this.width*this.height*4;
            var fullFramesSoFar = Math.floor(this.currentData.length/intsPerFrame);
            var startIndex = (fullFramesSoFar-1)*intsPerFrame;
            var endIndex = (fullFramesSoFar)*intsPerFrame;

            if(fullFramesSoFar>0){
                this.push(this.currentData.slice(startIndex, endIndex)) // emit a frame
                this.currentData = this.currentData.slice(endIndex) // remove frame data from current data
                break;
            }else{
                break;
            }
            if (startIndex > 0) console.error(`Discarded ${startIndex} bytes of invalid data`)
        }

        done()
    }

    // TODO: Fix not emitting the last frame in a stream
}

const { Converter } = require("ffmpeg-stream")


var getDimensions = require('get-video-dimensions');
var deasync = require('deasync');
var getDimensionsSync = deasync(function(videoFile, cb){
    getDimensions(videoFile).then(function (dimensions) {
        cb(null,dimensions);
    })
});

var decode = require('image-decode')

function videoToPixelsJPG(videoFile, onGotPixelsData=function(dataArray,w,h){}, onDone=function(){}){
    const converter = new Converter()

    converter
        .createOutputStream({i:videoFile, f: "image2pipe", vcodec: "mjpeg" })
        .pipe(new ExtractFrames("FFD8FF")) // use jpg magic number as delimiter
        .on("data", frameData => {
            var decoded = decode(frameData,'jpg'); //{data, width, height}
            onGotPixelsData(decoded.data, decoded.width, decoded.height);
        }).on("end", onDone)
    converter.run()
}

function videoToPixels(videoFile, onGotPixelsData=function(dataBuffer,w,h){}, onDone=function(){}){
    var videoDimensions = getDimensionsSync(videoFile);

    const converter = new Converter()

    converter
        .createOutputStream({i:videoFile, f: "rawvideo", pix_fmt: "rgba" })
        .pipe(new ExtractFramesRaw(videoDimensions.width,videoDimensions.height)) // use jpg magic number as delimiter
        .on("data", frameData => {
            onGotPixelsData(frameData,videoDimensions.width,videoDimensions.height);
        }).on("end", onDone)
    converter.run()
}

var videoToPixelsSync = deasync(function(videoFile,cb){
    var res = [];
    var w = -1;
    var h = -1;
    videoToPixels(videoFile, function(data,_w,_h){
        w=_w;
        h=_h;
        res.push(data)
    }, function(){
        cb(null,res);
    });
})

function scaleDownByN(n,buffer, w, h){
    var res = [];
    for(var y=0;y<h;y+=n){
        for(var x=0;x<w;x+=n){
            res.push(buffer[4*(x+y*w)+0], buffer[4*(x+y*w)+1], buffer[4*(x+y*w)+2], 255);
        }
    }
    return res;
}

module.exports = {
    getDimensions,getDimensionsSync,
    videoToPixelsJPG,videoToPixels,
    videoToPixelsSync,
    scaleDownByN
}