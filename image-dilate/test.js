var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var dilate = require('./index.js');
var filedata = fs.readFileSync("./dilate.png");

readimage(filedata, function (err, image) {
    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data; //format [r,g,b,a, r,g,b,a ... ] in range 0...255

    var rad = 2; //dilate 2 pixels
    var bgColor = [0,0,0]; //background color [r,g,b] in range 0...255 [background is not dilated]
    var dilated = dilate.dilateColors(d,h,w,bgColor,rad); //data is dilated in-place

    //save result
    var fileData = png.encode({width: w, height: h, data: dilated});
    fs.writeFileSync(`./test_out_rad${rad}.png`, fileData);

    //for large radius, end result is similar to voronoi diagram [with manhattan distance (?) because of rectangular kernel]
});