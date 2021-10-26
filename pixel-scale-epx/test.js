var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var upscale = require('./index.js');
var filedata = fs.readFileSync("./test-epx.png");

readimage(filedata, function (err, image) {
    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data;

    var D2x = upscale.upscaleRgba4x(d,w,h)
    var D3x = upscale.upscaleRgba3x(d,w,h,true)

    var fileData2x = png.encode({width: w*4, height: h*4, data: D2x});
    fs.writeFileSync(`./test_out_4x.png`, fileData2x);

    var fileData3x = png.encode({width: w*3, height: h*3, data: D3x});
    fs.writeFileSync(`./test_out_3x.png`, fileData3x);
});