var asciiDataImage = require('./index.js');
var resolution = {x: 20, y: 20};

var data = asciiDataImage.generateRandomImgData(resolution);
//data is array of arrays -- data[y][x] = float value

var imgStr = asciiDataImage.data2Img(data);
//image is automatically normalized for data

//console.log(imgStr);

var imgStrAscii = asciiDataImage.data2Img(data, {simpleAsciiMode: true});
//image is automatically normalized for data

//console.log(imgStrAscii);

var animationData = asciiDataImage.generateRandomAnimationData(resolution, 10);
var animationStrs = asciiDataImage.data2Animation(animationData, {simpleAsciiMode: false});

//asciiDataImage.playAnimation(animationStrs);

//rgb:

var dataRgb = asciiDataImage.generateRandomImgData_rgb(resolution);
// data[y][x] = [float,float,float] - each channel range is 0...1

var imgStrRgb = asciiDataImage.data2Img_rgb(dataRgb);
//rgb image is NOT normalized

//console.log(imgStrRgb);

var animationDataRgb = asciiDataImage.generateRandomAnimationData_rgb(resolution, 10);
var animationStrsRgb = asciiDataImage.data2Animation_rgb(animationDataRgb, {simpleAsciiMode: false});

asciiDataImage.playAnimation(animationStrsRgb);