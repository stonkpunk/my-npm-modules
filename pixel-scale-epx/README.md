# pixel-scale-epx

[EPX / Scale2x / AdvMAME2x](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97) pixel art scaling algorithm (Eric's Pixel Expansion). 
2x, 4x, 8x. 

```javascript
var upscale = require('pixel-scale-epx');
var pixelsData = [r,g,b,a,  r,g,b,a, ... ]; //rgba array 0...255
var width = 256, height = 256; //dimensions of original img
var use8BitColors = false; //if true, ignore lower 8 bits of color channels 
var D2x = upscale.upscaleRgba2x(pixelsData,width,height,use8BitColors); //2x bigger
var D4x = upscale.upscaleRgba4x(pixelsData,width,height,use8BitColors); //4x bigger
var D8x = upscale.upscaleRgba8x(pixelsData,width,height,use8BitColors); //8x bigger
//format of output is same as input [r,g,b,a ...]
```

![original](https://i.imgur.com/9F811kc.png)
*pixel art enlarged 4x with nearest neighbors*


![4x](https://i.imgur.com/iu2TzbD.png)
*pixel art enlarged 4x with EPX* 



## Installation

```sh
npm i pixel-scale-epx
```

## Example - upscale a PNG file

In this example we load a PNG file, scale it up 8x (internally we apply EPX algorithm 3 times), then save the result.

```javascript
var fs = require("fs")
var png = require('fast-png');
var readimage = require("readimage")

var upscale = require('pixel-scale-epx');
var filedata = fs.readFileSync("./test-epx.png");

readimage(filedata, function (err, image) {
    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data;

    var d8x = upscale.upscaleRgba8x(d,w,h)

    var fileData8x = png.encode({width: w*8, height: h*8, data: d8x});
    fs.writeFileSync(`./test_out_8x.png`, fileData8x);
});
```

![8x](https://i.imgur.com/82z25wd.png)
*enlarged 8x*

## See Also

- [ascii-raytracer](https://www.npmjs.com/package/ascii-raytracer) - uses `pixel-scale-epx`

