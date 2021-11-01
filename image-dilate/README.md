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
var dilate = require('image-dilate');
var img = require('image-sync').read('./dilate.png'); //{width, height, data, saveAs}

//img.data has format [r,g,b,a, r,g,b,a ... ]

//dilate the image
var radius = 16;
var bgColor = [0,0,0]; //background color [r,g,b] in range 0...255 [background is not dilated]
img.data = dilate.dilateColors(img.data,img.height,img.width,bgColor,radius);

//save the result
img.saveAs(`./output.png`);
```

Results [enlarged 2x]

![original](https://i.imgur.com/Z6DhGGI.png) *original*

![dilated 1px](https://i.imgur.com/AgoGZrh.png) *dilated 1px*

![dilated 2px](https://i.imgur.com/pyQ5G3k.png) *dilated 2px*

![dilated 4px](https://i.imgur.com/Z4i8jgJ.png) *dilated 4px*

![dilated 8px](https://i.imgur.com/uZD1xG9.png) *dilated 8px*

![dilated 32px](https://i.imgur.com/96fnfSK.png) *dilated 32px*

## See Also

- [image-blur-gaussian](https://www.npmjs.com/package/image-blur-gaussian) - fast gaussian blur  
- [image-sync](https://www.npmjs.com/package/image-sync) - synchronous image reader/writer



