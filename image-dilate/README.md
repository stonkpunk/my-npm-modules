# image-dilate

dilate / expand the pixels in a color image

works directly on `[r,g,b,a ... ]` data array

## Installation

```sh
npm i image-dilate
```

## Usage 

Here we load pixel data from a PNG file, dilate it a few pixels, then save the result. 

See results below.

```javascript
var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var dilate = require('image-dilate');
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
```

Results [enlarged 2x]

![original](https://i.imgur.com/Z6DhGGI.png) *original*

![dilated 1px](https://i.imgur.com/AgoGZrh.png) *dilated 1px*

![dilated 2px](https://i.imgur.com/pyQ5G3k.png) *dilated 2px*

![dilated 4px](https://i.imgur.com/Z4i8jgJ.png) *dilated 4px*

![dilated 8px](https://i.imgur.com/uZD1xG9.png) *dilated 8px*

![dilated 32px](https://i.imgur.com/96fnfSK.png) *dilated 8px*

## See Also

- [image-blur-gaussian](https://www.npmjs.com/package/image-blur-gaussian) - fast gaussian blur  



