# image-blur-gaussian

very fast gaussian image blur functions originally by [Ivan Kutskir](http://blog.ivank.net/fastest-gaussian-blur.html) and [Wojciech Jarosz](http://elynxsdk.free.fr/ext-docs/Blur/Fast_box_blur.pdf).

works with `[r,g,b,a ... ]` data array.

for best results, use images with power-of-2 dimensions.

## Installation

```sh
npm i image-blur-gaussian
```

## Usage 

Here we load pixel data from a PNG file, blur it, then save the result. 

See results below.

```javascript
var blur = require('image-blur-gaussian');
var img = require('image-sync').read('./cat.png'); //{width, height, data, saveAs}

//img.data has format [r,g,b,a, r,g,b,a ... ]

//blur the image
var radius = 16;
img.data = blur.blurImage(img.data,img.height,img.width,radius);

//save the result
img.saveAs(`./output.png`); 
```

![original](https://i.imgur.com/6swcKzf.png) *original*

![blurred 4 pixels](https://i.imgur.com/nEnzsQq.png) *blurred 4 pixels*

![blurred 8 pixels](https://i.imgur.com/56EARsy.png) *blurred 8 pixels*

![blurred 16 pixels](https://i.imgur.com/D6C2CKt.png) *blurred 16 pixels*


## See Also

- [image-dilate](https://www.npmjs.com/package/image-dilate) - dilate image pixels by color
- [image-sync](https://www.npmjs.com/package/image-sync) - synchronous image reader/writer

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



