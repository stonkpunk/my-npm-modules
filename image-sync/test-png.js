var is = require('./index.js');
var blur = require('image-blur-gaussian');

//read the image data
var img = is.read('./cat.png'); //{width, height, data, saveAs}

//blur the image
var rad = 32;
img.data = blur.blurImage(img.data,img.height,img.width,rad); //img.data has format [r,g,b,a, r,g,b,a ... ]

//save the result as jpg...
img.saveAs(`./test_out_rad${rad}.jpg`, 80); //save with 80% quality [default is 95%]

//save the result as png...
img.saveAs(`./test_out_rad${rad}.png`);

