# ffmpeg-audio-chop

extract pcm audio data from a video based on start/end time, including spectrum and pitch

## Installation

```sh
npm i ffmpeg-audio-chop
```

## Usage 

```javascript

//getAudioDataFromVideo(fileName, onDone) //onDone(err,{audioDataChannels, audioSampleRate, metaData, durationSeconds})
//getAudioDataFromVideoSync
//extractAudioForTimespan(audioDataObj, timeStartSeconds, timeEndSeconds, includeFft? = false, fftSize? = 1024, includePitch? = false)
//getDuration(fileName, cb) //cb(err, durationSeconds, audioSampleRate, metadata);
//getDurationSync

var ac = require('ffmpeg-audio-chop');
var audioDataObj = ac.getAudioDataFromVideoSync("./music-video.mp4");
var audioForTime = ac.extractAudioForTimespan(audioDataObj, 5, 5.1, true, 1024, true)

console.log(audioForTime);

// {
//     left: [
//         0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//         ...
//     ],
//     right: [
//          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//          ...
//      ],
//     right_pitch: 486.91126777503007, //audio pitch in hertz
//     left_pitch: 486.91127579714805, //audio pitch in hertz
//     right_spectrum: [
//         0.0024631179044465466,   0.002633626820233918,   0.004308997766344232,
//         0.00043984076475247623,  0.0033481802255052296,    0.00837681817671101, ... ]
//     left_spectrum: [
//         0.0024631179044465466,   0.002633626820233918,   0.004308997766344232,
//         0.00043984076475247623,  0.0033481802255052296,    0.00837681817671101, ... ]
//     min: -0.49687185277871027, //this is a global min
//     max: 0.4622638630329295 //this is a global max
// }

console.log(audioDataObj);

// {
//     min: -0.49687185277871027,
//     max: 0.4622638630329295,
//     audioDataChannels: {
//          left: [0,0,0,0....],
//          right: [0,0,0,...]
//      },
//     audioSampleRate: 44100,
//         metaData: {
//     streams: [ [Object], [Object] ],
//         format: {
//         filename: './b12.mp4',
//             nb_streams: 2,
//             nb_programs: 0,
//             format_name: 'mov,mp4,m4a,3gp,3g2,mj2',
//             format_long_name: 'QuickTime / MOV',
//             start_time: 0,
//             duration: 122.949656,
//             size: 17577178,
//             bit_rate: 1143699,
//             probe_score: 100,
//             tags: [Object]
//     },
//     chapters: []
// },
//     durationSeconds: 122.949656
// }
```

## See Also

- [pcm](https://www.npmjs.com/package/pcm) 
- [detect-pitch](https://www.npmjs.com/package/detect-pitch)
- [fourier-transform](https://www.npmjs.com/package/fourier-transform)



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



