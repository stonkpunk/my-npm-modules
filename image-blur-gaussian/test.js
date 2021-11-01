//old version
// var fs = require("fs")
// var png = require('fast-png');
// var readimage = require("readimage")
//
// var blur = require('./index.js');
// var filedata = fs.readFileSync("./cat.png");
//
// readimage(filedata, function (err, image) {
//     var w = image.width; //should be power of 2
//     var h = image.height;
//     var d = image.frames[0].data; //format [r,g,b,a, r,g,b,a ... ] in range 0...255
//
//     var rad = 4; //blur 2 pixel radius
//     var blurred = blur.blurImage(d,h,w,rad); //data is dilated in-place
//
//     //save result
//     var fileData = png.encode({width: w, height: h, data: blurred});
//     fs.writeFileSync(`./test_out_rad${rad}.png`, fileData);
// });

var blur = require('image-blur-gaussian');
var img = require('image-sync').read('./cat.png'); //{width, height, data, saveAs}

//img.data has format [r,g,b,a, r,g,b,a ... ]

//blur the image
var radius = 16;
img.data = blur.blurImage(img.data,img.height,img.width,radius);

//save the result
img.saveAs(`./output.png`);


