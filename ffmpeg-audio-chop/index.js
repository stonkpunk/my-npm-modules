var pcm = require('pcm');
var ffmpeg = require('fluent-ffmpeg');
var deasync = require('deasync');

function getDuration(fileName, cb){
    ffmpeg.ffprobe(fileName, function(err, metadata) {
        var audioSampleRate = metadata.streams.filter(s=>s.codec_type=='audio')[0].sample_rate;
        var durationSeconds = metadata.format.duration;
        cb(err, durationSeconds, audioSampleRate, metadata);
    });
}

var getDurationSync = deasync(getDuration);

function getAudioDataFromVideo(fileName, onDone){
    var audioDataArrs = [[],[]];
    var audioDataChannels = {
        left: null,
        right: null
    };
    var min = 1.0;
    var max = -1.0;
    getDuration(fileName, function(err,durationSeconds,audioSampleRate,metaData){
        pcm.getPcmData(fileName, { stereo: true, sampleRate: audioSampleRate },
            function(sample, channel) {
                // Sample is from [-1.0...1.0], channel is 0 for left and 1 for right
                min = Math.min(min, sample);
                max = Math.max(max, sample);
                audioDataArrs[channel].push(sample);
            },
            function(err, output) {
                if (err)
                    throw new Error(err);
               //console.log('min=' + min + ', max=' + max);
                audioDataChannels.left = audioDataArrs[0];
                audioDataChannels.right = audioDataArrs[1];
                onDone(err,{
                    min,max, audioDataChannels, audioSampleRate, metaData, durationSeconds
                })
            }
        );
    })
}

var getAudioDataFromVideoSync = deasync(getAudioDataFromVideo);

var ft = require('fourier-transform');
var dp = require('detect-pitch');

function extractAudioForTimespan(audioDataObj, timeStartSeconds, timeEndSeconds, includeFft=false, fftSize = 1024, includePitch=false){
    var res = {};
    for(var channel in audioDataObj.audioDataChannels){
        var audioDataArr = audioDataObj.audioDataChannels[channel];
        var indexStart = audioDataArr.length * timeStartSeconds / audioDataObj.durationSeconds
        var indexEnd = audioDataArr.length * timeEndSeconds / audioDataObj.durationSeconds
        res[channel] = audioDataArr.slice(indexStart,indexEnd+1);
        var waveform = res[channel].slice(0,fftSize);
        if(includeFft){
            //get normalized magnitudes for frequencies from 0 to 22050 with interval 44100/1024 ≈ 43Hz
            var spectrum = ft(waveform);
            res[channel+"_spectrum"] = spectrum;
        }
        if(includePitch){
            res[channel+"_pitch"] = audioDataObj.audioSampleRate / dp(waveform)
        }
    }
    res.min = audioDataObj.min;
    res.max = audioDataObj.max;
    return res;
}

module.exports = {extractAudioForTimespan, getAudioDataFromVideo, getAudioDataFromVideoSync, getDuration, getDurationSync};



