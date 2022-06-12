var fs = require("fs")
var png = require('fast-png');
var jpeg = require('jpeg-js');
var readimage = require("readimage")
var deasync = require('deasync');
var readImgSync = deasync(readimage);

function read(path){
    var filedata = fs.readFileSync(path);
    var image = readImgSync(filedata);
    image.data = image.frames[0].data;
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

module.exports = {read};

