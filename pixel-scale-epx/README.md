# pixel-scale-epx

[EPX / Scale2x / AdvMAME2x](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97) pixel art scaling algorithm (Eric's Pixel Expansion) 

Can also do fast [faux] anti-aliasing by applying EPX then downsampling back to the orignal size. 

Also includes the 3x version, aka [Scale3x / AdvMAME3x](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#Scale3%C3%97/AdvMAME3%C3%97_and_ScaleFX). 

Scale pixel art 2x, 3x, 4x, 6x, 8x. 

```javascript
var upscale = require('pixel-scale-epx');
var pixelsData = [r,g,b,a,  r,g,b,a, ... ]; //rgba array 0...255
var width = 256, height = 256; //dimensions of original img
var use8BitColors = false; //if true, ignore lower 8 bits of color channels 
var D2x = upscale.upscaleRgba2x(pixelsData,width,height,use8BitColors); //2x bigger
var D3x = upscale.upscaleRgba3x(pixelsData,width,height,use8BitColors); //3x bigger
var D4x = upscale.upscaleRgba4x(pixelsData,width,height,use8BitColors); //4x bigger [applies 2x op twice]
var D6x = upscale.upscaleRgba6x(pixelsData,width,height,use8BitColors); //6x bigger [applies 2x op then 3x op]
var D8x = upscale.upscaleRgba8x(pixelsData,width,height,use8BitColors); //8x bigger [applies 2x op thrice]

//expand 2x + anti-alias -- eg, expand 4x then downsample 2x -- result is 2x bigger than input 
var D2xAA = upscale.expandAndAntiAliasRgba2x(pixelsData,width,height,use8BitColors);

//if you want ONLY anti-alias without any size change:
var DAA1x = upscale.antiAliasRgba2x_inPlace(pixelsData,width,height,use8BitColors); //works IN PLACE -- size of image not affected

//^in-place anti aliasing via applying EPX 2x then downscaling 2x after

//4x anti aliasing also available, but results look virtually identical
var DAA4x = upscale.antiAliasRgba4x_inPlace(pixelsData,width,height,use8BitColors); //works IN PLACE -- size of image not affected

//can also do "blocky" / naive nearest-neighbor upscale
var blocky2x = upscale.upscaleRgba2x_blocky(pixelsData,width,height);
var blocky4x = upscale.upscaleRgba4x_blocky(pixelsData,width,height);
var blocky8x = upscale.upscaleRgba8x_blocky(pixelsData,width,height);

//format of output is same as input [r,g,b,a ...]
```

![original](https://i.imgur.com/9F811kc.png)

*^ pixel art enlarged 4x with nearest neighbors*


![4x](https://i.imgur.com/iu2TzbD.png)

*^ pixel art enlarged 4x with EPX* 

![aa2x](https://i.imgur.com/GejVyRp.png)

*^ anti-aliasing via EPX - epx2x + 2x scale down [resulting image scaled 4x to show pixels]*

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


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



