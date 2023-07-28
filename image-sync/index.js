var fs = require("fs")
var png = require('fast-png');
var jpeg = require('jpeg-js');
var readimage = require("readimage")
var deasync = require('deasync');
var readImgSync = deasync(readimage);

function getPixel(image, _x, _y){
    var x = Math.floor(Math.max(0,Math.min(_x, image.width-1)));
    var y = Math.floor(Math.max(0,Math.min(_y,image.height-1)));
    var o = (x+y*image.width)*4;
    var r = image.data[o];
    var g = image.data[o+1];
    var b = image.data[o+2];
    var a = image.data[o+3];
    return [r,g,b,a];
}

function getPixelBilinear(image, x, y) {
    var x1 = Math.floor(x);
    var y1 = Math.floor(y);
    var x2 = x1 + 1;
    var y2 = y1 + 1;

    var p1 = getPixel(image, x1, y1);
    var p2 = getPixel(image, x2, y1);
    var p3 = getPixel(image, x1, y2);
    var p4 = getPixel(image, x2, y2);

    var fractionX = x - x1;
    var fractionY = y - y1;

    var interpolatedR = bilinearInterpolation(p1[0], p2[0], p3[0], p4[0], fractionX, fractionY);
    var interpolatedG = bilinearInterpolation(p1[1], p2[1], p3[1], p4[1], fractionX, fractionY);
    var interpolatedB = bilinearInterpolation(p1[2], p2[2], p3[2], p4[2], fractionX, fractionY);
    var interpolatedA = bilinearInterpolation(p1[3], p2[3], p3[3], p4[3], fractionX, fractionY);

    return [interpolatedR, interpolatedG, interpolatedB, interpolatedA];
}

function bilinearInterpolation(p1, p2, p3, p4, fractionX, fractionY) {
    var interpolatedValue = (1 - fractionX) * (1 - fractionY) * p1 +
        fractionX * (1 - fractionY) * p2 +
        (1 - fractionX) * fractionY * p3 +
        fractionX * fractionY * p4;

    return Math.round(interpolatedValue);
}

function blank(width,height, colorRGB= [255,255,255], rawData=null){
    var image = {width:width,height:height};

    if(rawData){
        image.data = rawData;
    }else{
        image.data = Array(width*height*4).fill(255);

        for(var i=0;i<image.data.length;i+=4){
            image.data[i] = colorRGB[0];
            image.data[i+1] = colorRGB[1];
            image.data[i+2] = colorRGB[2];
        }
    }

    image.getPixel = function(x,y){return getPixel(image,x,y);}
    image.getPixelBilinear = function(x,y){return getPixelBilinear(image,x,y);}

    image.saveAs = function(name, quality=95){

        var ext = name.split('.').pop().toLowerCase();
        var isJpg = ext == "jpg" || ext == "jpeg";
        var isPng = ext == "png";

        if(!isJpg && !isPng){
            throw 'saved image must be .png or .jpg';
        }

        var fileData = isPng ?
            png.encode({width: image.width, height: image.height, data: image.data}) :
            jpeg.encode({width: image.width, height: image.height, data: image.data}, quality).data
        fs.writeFileSync(name, fileData);
    }
    return image;
}

function read(path){
    var filedata = fs.readFileSync(path);
    var image = readImgSync(filedata);
    image.data = image.frames[0].data;

    image.getPixel = function(x,y){return getPixel(image,x,y);}
    image.getPixelBilinear = function(x,y){return getPixelBilinear(image,x,y);}

    image.saveAs = function(name, quality=95){

        var ext = path.split('.').pop().toLowerCase();
        var isJpg = ext == "jpg" || ext == "jpeg";
        var isPng = ext == "png";

        if(!isJpg && !isPng){
            throw 'saved image must be .png or .jpg';
        }

        var fileData = isPng ?
            png.encode({width: image.width, height: image.height, data: image.data}) :
            jpeg.encode({width: image.width, height: image.height, data: image.data}, quality).data
        fs.writeFileSync(name, fileData);
    }
    return image;
}

module.exports = {read, blank};

