//based on https://github.com/fluent-ffmpeg/node-fluent-ffmpeg/issues/546

var deasync = require('deasync');
var Readable = require('stream').Readable;
var util = require('util');
var spawn = require('child_process').spawn;

var quietMode = false;

function FramesStream(frames, w=128,h=128,opts) {
    Readable.call(this, opts);
    this.frames = frames;
    this.n = 0;
    this.width = w;
    this.height = h;
    if(frames[0].length != w*h*4){
        throw 'wrong frame size';
    }
}

util.inherits(FramesStream, Readable);

FramesStream.prototype._read = function() {
    var ready = true;
    while (ready) {
        this.n++;
        if (this.n > this.frames.length) { //done
            this.push(null);
            return false;
        }
        var numPixels = this.width * this.height;
        var rawImage = new Buffer(this.width * this.height * 3);
        var currentFrame = this.frames[this.n-1];
        for(var i=0;i<numPixels;i++){
            var frameO = i*4;
            var rawO = i*3;
            rawImage[rawO] = currentFrame[frameO];
            rawImage[rawO+1] = currentFrame[frameO+1];
            rawImage[rawO+2] = currentFrame[frameO+2];
        }
        ready = this.push(rawImage);
    }
    return true;
};

function runFfmpegCmd(arr, cb){
    var doPrint = !quietMode;
    var ps = spawn('ffmpeg', arr);
    ps.stdout.on('data', function(data){if(doPrint){console.log(data.toString());}});
    ps.stderr.on('data', function(data){if(doPrint){console.log(data.toString());};});
    ps.on('close', function(code){cb(null,code);});
    return ps;
}

function makeMp4(outputFilename="output.mp4",frames,w,h,fps=1,cb){
    //fps param is in 2 places to avoid err described here https://stackoverflow.com/questions/21059976/ffmpeg-compress-with-wrong-frame-rate-while-sending-raw-pixel-data-from-java-app
    var arr = ['-r', fps,'-y', '-f', 'rawvideo', '-s', `${w}x${h}`, '-pix_fmt', 'rgb24', '-i', '-', '-vcodec', 'libx264', '-f', 'mp4', '-r', fps, outputFilename];
    var ps = runFfmpegCmd(arr, cb)
    new FramesStream(frames, w,h,null).pipe(ps.stdin);
}

var makeMp4Sync = deasync(makeMp4);

function makeGif(outputFilename="output.gif",frames,w,h,fps=1,cb){
    //fps param is in 2 places to avoid err described here https://stackoverflow.com/questions/21059976/ffmpeg-compress-with-wrong-frame-rate-while-sending-raw-pixel-data-from-java-app
    var arr = ['-r', fps,'-y', '-f', 'rawvideo', '-s', `${w}x${h}`, '-pix_fmt', 'rgb24', '-i', '-', '-f', 'gif', '-r', fps, outputFilename];
    var ps = runFfmpegCmd(arr, cb)
    new FramesStream(frames, w,h,null).pipe(ps.stdin);
}

var makeGifSync = deasync(makeGif);

function makeQuiet(quiet=true){
    quietMode=quiet;
}

module.exports = {
    makeQuiet,
    makeMp4, makeGif,
    makeMp4Sync, makeGifSync
}