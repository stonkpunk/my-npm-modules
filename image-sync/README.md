# image-sync

synchronously read, modify, and save PNG and JPG image data
## Installation

```sh
npm i image-sync
```

## Usage 

```javascript
var imageSync = require('image-sync');
var blur = require('image-blur-gaussian');

//read the image data
var img = imageSync.read('./cat.png'); //{width, height, data, saveAs}

//img.data has format [r,g,b,a, r,g,b,a ... ]

//blur the image
var rad = 16;
img.data = blur.blurImage(img.data,img.height,img.width,rad); 

//save the result as jpg...
img.saveAs(`./output.jpg`, 80); //save with 80% quality [default is 95%]

//or, save the result as png...
img.saveAs(`./output.png`);


```

![original](https://i.imgur.com/6swcKzf.png) *cat.png*

![blurred 16 pixels](https://i.imgur.com/D6C2CKt.png) *output.png*

