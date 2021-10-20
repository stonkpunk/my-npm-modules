var chalk = require('chalk');
var grayScaleStr = ' .:-=+*#%@'; //http://paulbourke.net/dataformats/asciiart/

function data2Img(pixelDataArrs, options){
    var simpleAsciiMode = (options || {}).simpleAsciiMode;
    var resolution = {x:pixelDataArrs[0].length, y:pixelDataArrs.length};
    var asciiStr = "";
    var maxVal=-9999;
    var minVal=9999;
    for(var y=0;y<resolution.y-1;y+=2){
        var thisRow = pixelDataArrs[y];
        var nextRow = pixelDataArrs[y+1];
        //var thisRowStr = "";
        for(var x=0;x<resolution.x;x++){
            var val = thisRow[x];
            var val1 = nextRow[x];
            maxVal=Math.max(maxVal,val,val1);
            minVal=Math.min(minVal,val,val1);
        }
    }

    for(var y=0;y<resolution.y-1;y+=2){
        var thisRow = pixelDataArrs[y];
        var nextRow = pixelDataArrs[y+1];
        var thisRowStr = "";
        for(var x=0;x<resolution.x;x++){
            var val = thisRow[x];
            var val1 = nextRow[x];
            var relativeBright = (val-minVal)/(maxVal-minVal) || 0.0000001;
            var relativeBright1 = (val1-minVal)/(maxVal-minVal) || 0.0000001;
            var R = Math.floor(relativeBright*255);
            var R1 = Math.floor(relativeBright1*255);
            if(simpleAsciiMode){
                thisRowStr+=grayScaleStr.charAt(Math.floor(relativeBright1*grayScaleStr.length));
            }else{
                thisRowStr+=chalk.bgRgb(R,R,R).rgb(R1,R1,R1)('\u2584');
            }
        }
        thisRowStr+="\n";
        asciiStr+=thisRowStr;
    }
    return asciiStr;
}

function data2Img_rgb(pixelDataArrs){
    var resolution = {x:pixelDataArrs[0].length, y:pixelDataArrs.length};
    var asciiStr = "";

    for(var y=0;y<resolution.y-1;y+=2){
        var thisRow = pixelDataArrs[y];
        var nextRow = pixelDataArrs[y+1];
        var thisRowStr = "";
        for(var x=0;x<resolution.x;x++){
            var valr = thisRow[x][0];
            var val1r = nextRow[x][0];
            var valg = thisRow[x][1];
            var val1g = nextRow[x][1];
            var valb = thisRow[x][2];
            var val1b = nextRow[x][2];
            var R = Math.floor(valr*255);
            var R1 = Math.floor(val1r*255);
            var G = Math.floor(valg*255);
            var G1 = Math.floor(val1g*255);
            var B = Math.floor(valb*255);
            var B1 = Math.floor(val1b*255);
            thisRowStr+=chalk.bgRgb(R,G,B).rgb(R1,G1,B1)('\u2584');
        }
        thisRowStr+="\n";
        asciiStr+=thisRowStr;
    }
    return asciiStr;
}


function data2Animation(animationFrames, options){
    var strs = animationFrames.map(pixelDataArrSingleFrame => data2Img(pixelDataArrSingleFrame, options));
    return strs;
}

function data2Animation_rgb(animationFrames){
    var strs = animationFrames.map(pixelDataArrSingleFrame => data2Img_rgb(pixelDataArrSingleFrame));
    return strs;
}

var animationTimeout=null;
var currentAnimationFrameNumber=0;
function playAnimation(asciiStrsArr, millisecondsPerFrame){
    if(animationTimeout){
        clearInterval(animationTimeout);
    }

    animationTimeout = setInterval(function(){
        currentAnimationFrameNumber++;
        currentAnimationFrameNumber=currentAnimationFrameNumber%asciiStrsArr.length;
        writeSelfOverwrite(asciiStrsArr[currentAnimationFrameNumber]);
    },millisecondsPerFrame || 100);
}

function stopAnimation(){
    clearInterval(animationTimeout);
}

function generateRandomImgData(resolution){
    return new Array(resolution.y).fill([]).map(function(arr){
        return new Array(resolution.x).fill(1).map(function(){return Math.random();});
    });
}

function generateRandomImgData_rgb(resolution){
    return new Array(resolution.y).fill([]).map(function(arr){
        return new Array(resolution.x).fill(1).map(function(){return [Math.random(),Math.random(),Math.random()];});
    });
}

function generateRandomAnimationData(resolution, numberFrames){
    return new Array(numberFrames).fill(1).map(i=>generateRandomImgData(resolution));
}

function generateRandomAnimationData_rgb(resolution, numberFrames){
    return new Array(numberFrames).fill(1).map(i=>generateRandomImgData_rgb(resolution));
}

function writeSelfOverwrite(str){ //print and replace
    process.stdout.clearLine();
    process.stdout.write(str);
    process.stdout.moveCursor(0, -str.split('\n').length+1);
}

module.exports.generateRandomImgData = generateRandomImgData;
module.exports.generateRandomAnimationData = generateRandomAnimationData;

module.exports.generateRandomImgData_rgb = generateRandomImgData_rgb;
module.exports.generateRandomAnimationData_rgb = generateRandomAnimationData_rgb;

module.exports.playAnimation = playAnimation;
module.exports.stopAnimation = stopAnimation;

module.exports.writeSelfOverwrite = writeSelfOverwrite;
module.exports.data2Img = data2Img;
module.exports.data2Animation = data2Animation;

module.exports.data2Img_rgb = data2Img_rgb;
module.exports.data2Animation_rgb = data2Animation_rgb;
