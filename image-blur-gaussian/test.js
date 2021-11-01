var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var blur = require('./index.js');
var filedata = fs.readFileSync("./cat.png");

readimage(filedata, function (err, image) {
    var w = image.width; //should be power of 2
    var h = image.height;
    var d = image.frames[0].data; //format [r,g,b,a, r,g,b,a ... ] in range 0...255

    var rad = 16; //blur 2 pixel radius
    var blurred = blur.blurTexture(d,h,w,rad); //data is dilated in-place

    //save result
    var fileData = png.encode({width: w, height: h, data: blurred});
    fs.writeFileSync(`./test_out_rad${rad}.png`, fileData);
});