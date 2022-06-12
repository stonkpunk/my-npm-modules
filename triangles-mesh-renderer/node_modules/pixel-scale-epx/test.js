var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var upscale = require('./index.js');
var filedata = fs.readFileSync("./test-epx.png");

readimage(filedata, function (err, image) {
    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data;

    var D4x = upscale.upscaleRgba4x(d,w,h)
    var D3x = upscale.upscaleRgba3x(d,w,h,true)

    // upscale.antiAliasRgba2x_inPlace(d,w,h);
    // var fileDataAA2x = png.encode({width: w*1, height: h*1, data: d});
    // fs.writeFileSync(`./test_out_AA2x.png`, fileDataAA2x);

    // upscale.antiAliasRgba4x_inPlace(d,w,h);
    // var fileDataAA4x = png.encode({width: w*1, height: h*1, data: d});
    // fs.writeFileSync(`./test_out_AA4x.png`, fileDataAA4x);

    var D2xAA = upscale.expandAndAntiAliasRgba2x(d,w,h);
    var fileDataD2XAA2X = png.encode({width: w*2, height: h*2, data: D2xAA});
    fs.writeFileSync(`./test_out_D2XAA2X.png`, fileDataD2XAA2X);



    var fileData4x = png.encode({width: w*4, height: h*4, data: D4x});
    fs.writeFileSync(`./test_out_4x.png`, fileData4x);

    var fileData3x = png.encode({width: w*3, height: h*3, data: D3x});
    fs.writeFileSync(`./test_out_3x.png`, fileData3x);
});