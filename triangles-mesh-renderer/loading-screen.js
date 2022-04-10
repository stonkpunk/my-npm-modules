const rt = require("./index");
const {drawTextToBuffer} = require("draw-pixel-text");

var LOADING_STR = "";
var LAST_TIME = Date.now();

function renderLoadingScreen(status, imgData, width, height, stride, window){
    var TIME_S = ((Date.now()-LAST_TIME)/1000.0).toFixed(3);
    var thisLine = `+${TIME_S}: ${status}`;
    LOADING_STR+=`${thisLine}\n`;
    console.log(thisLine);
    _renderLoadingScreen(LOADING_STR,imgData, width, height, stride, window);
    LAST_TIME=Date.now();
}

function _renderLoadingScreen(status, imgData, width, height, stride, window){
    rt.clearBuffer(imgData); //reset the buffer to black
    var doExpandText = true;//window.fullscreen; //expand text render by 2x
    var textColor = [255,255,255]; //color [r,g,b]
    var textColor2 = [0,0,0]; //color [r,g,b]
    var textOffset = [5,5];
    var textOffset2 = [6,6];
    var maxLineLen = 50;
    drawTextToBuffer(status, textOffset2,textColor2,imgData,width,height, doExpandText, maxLineLen);
    drawTextToBuffer(status, textOffset,textColor,imgData,width,height, doExpandText, maxLineLen);
    window.render(width, height, stride, 'rgba32', Buffer.from(imgData)) //note - if using an array for the pixel data instead of a buffer, you need to convert to a buffer with Buffer.from(imgData)
}

module.exports = {renderLoadingScreen};
