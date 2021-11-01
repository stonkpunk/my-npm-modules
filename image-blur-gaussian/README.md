# image-blur-gaussian

very fast gaussian image blur functions by [Ivan Kutskir](http://blog.ivank.net/fastest-gaussian-blur.html) and [Wojciech Jarosz](http://elynxsdk.free.fr/ext-docs/Blur/Fast_box_blur.pdf).

works with `[r,g,b,a ... ]` data array.

for best results, use images with power-of-2 dimensions.

## Installation

```sh
npm i image-blur
```

## Usage 

Here we load pixel data from a PNG file, blur it a few pixels, then save the result. 

See results below.

```javascript
var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var blur = require('image-blur');
var filedata = fs.readFileSync("./cat.png");

readimage(filedata, function (err, image) {
    var w = image.width; //should be power of 2
    var h = image.height;
    var d = image.frames[0].data; //format [r,g,b,a, r,g,b,a ... ] in range 0...255

    var rad = 8; //blur 8 pixel radius
    var blurred = blur.blurTexture(d,h,w,rad); //data is dilated in-place

    //save result
    var fileData = png.encode({width: w, height: h, data: blurred});
    fs.writeFileSync(`./test_out_rad${rad}.png`, fileData);
});
```

![original](https://i.imgur.com/6swcKzf.png) *original*

![blurred 4 pixels](https://i.imgur.com/nEnzsQq.png) *blurred 4 pixels*

![blurred 8 pixels](https://i.imgur.com/56EARsy.png) *blurred 8 pixels*

![blurred 16 pixels](https://i.imgur.com/D6C2CKt.png) *blurred 16 pixels*


## See Also

- [image-dilate](https://www.npmjs.com/package/image-dilate) - dilate image pixels by color


