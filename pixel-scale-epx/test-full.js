var path = require('path');
var fs = require("fs")
var readimage = require("readimage")

var upscale = require('./index.js');
var filedata = fs.readFileSync(path.resolve(__dirname, "./test-epx.png"))

readimage(filedata, function (err, image) {
    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data;

    var use8bit = false;

    var D2x = upscale.upscaleRgba2x(d,w,h,use8bit)
    var D3x = upscale.upscaleRgba3x(d,w,h,use8bit)
    var D4x = upscale.upscaleRgba4x(d,w,h,use8bit)
    var D6x = upscale.upscaleRgba6x(d,w,h,use8bit)
    var D8x = upscale.upscaleRgba8x(d,w,h,use8bit)
    var D9x = upscale.upscaleRgba9x(d,w,h,use8bit)

    var png = require('fast-png');
    var fileData2x = png.encode({width: w*2, height: h*2, data: D2x});
    fs.writeFileSync(`./test_out_2x.png`, fileData2x);

    var fileData3x = png.encode({width: w*3, height: h*3, data: D3x});
    fs.writeFileSync(`./test_out_3x.png`, fileData3x);

    var fileData4x = png.encode({width: w*4, height: h*4, data: D4x});
    fs.writeFileSync(`./test_out_4x.png`, fileData4x);

    var fileData6x = png.encode({width: w*6, height: h*6, data: D6x});
    fs.writeFileSync(`./test_out_6x.png`, fileData6x);

    var fileData8x = png.encode({width: w*8, height: h*8, data: D8x});
    fs.writeFileSync(`./test_out_8x.png`, fileData8x);
});