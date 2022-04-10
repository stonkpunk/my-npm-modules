# ascii-data-image

draw CLI images and animations from pixel data. 

draw images as True Color "pixels" or simple ASCII art.

## Table of Contents

- [Installation](#installation)
- [Usage - default](#usage---default)
- [Usage - RGB](#usage---rgb)
- [Usage - simple ASCII](#usage---simple-ascii)
- [Usage - animated](#usage---animated)
- [Usage - animated - RGB](#usage---animated---rgb)
- [Donate](#donate)
- [See Also](#see-also)

## Installation

```sh
npm i ascii-data-image
```

## Usage - default

```javascript
var asciiDataImage = require('ascii-data-image');
var resolution = {x: 20, y: 20};

var data = asciiDataImage.generateRandomImgData(resolution);
//data is array of arrays -- data[y][x] = float value

var imgStr = asciiDataImage.data2Img(data);
//image is automatically normalized for data

console.log(imgStr);
```

**Result**

![result](https://i.imgur.com/8taU1Eb.png)


## Usage - RGB

```javascript
var asciiDataImage = require('ascii-data-image');
var resolution = {x: 20, y: 20};

var data = asciiDataImage.generateRandomImgData_rgb(resolution);
//data[y][x] = [float,float,float] - each channel range is 0...1

var imgStr = asciiDataImage.data2Img_rgb(data);
//rgb image data is NOT normalized

console.log(imgStr);
```

**Result**

![result](https://i.imgur.com/jCRd5rP.png)

## Usage - simple ASCII

```javascript
var asciiDataImage = require('ascii-data-image');
var resolution = {x: 20, y: 20};

var data = asciiDataImage.generateRandomImgData(resolution);
//data is array of arrays -- data[y][x] = float value

var imgStrAscii = asciiDataImage.data2Img(data, {simpleAsciiMode: true});
//image is automatically normalized for data

console.log(imgStrAscii);
//ascii mode is available for grayscale (non-rgb) only 
```

**Result:**
```
=*.=%+-::+=:-@:+*:#+
 *#%-=#+ @= @##@#*.@
+.@#*= +==*++**:=#@@
#+-=:+*-%%-+%.=:@=@#
..%:#=+++=#.*#%+.#=%
+#+#-=- *@## %=@##+=
+@#* :%=@*-*-+ :+=:.
- *:*#%%#=%.:-=#.@@*
%**:-.+:***%%.== =%=
 .++@%.@@ +#-=-..*..
```

## Usage - animated

```javascript
var asciiDataImage = require('ascii-data-image');
var resolution = {x: 20, y: 20};

var numberOfFrames = 10;
var animationData = asciiDataImage.generateRandomAnimationData(resolution, numberOfFrames);
//animationData is now a 3d array of 2d image data arrays -- data[t][y][x] = float value
var animationStrs = asciiDataImage.data2Animation(animationData, {simpleAsciiMode: false});
//non-rgb animations work in both ascii mode and pixels mode

var timePerFrame_milliseconds = 100;
asciiDataImage.playAnimation(animationStrs, timePerFrame_milliseconds);
```

**Result:**

![result](https://i.imgur.com/zOqgflq.gif)

## Usage - animated - RGB

```javascript
var animationDataRgb = asciiDataImage.generateRandomAnimationData_rgb(resolution, 10);
var animationStrsRgb = asciiDataImage.data2Animation_rgb(animationDataRgb, {simpleAsciiMode: false});

asciiDataImage.playAnimation(animationStrsRgb);
```

**Result:**

![result](https://i.imgur.com/VUjJFyb.gif)

## Donate

Support further development of this module

btc: `bc1qr2taxcwnyr28f7xnqv4r86zjrcv83qg5grhu48`

## See Also


- [ascii-raytracer](https://www.npmjs.com/package/ascii-raytracer) - explore 3d worlds in your terminal
- [glsl-imager](https://www.npmjs.com/package/glsl-imager) - uses `ascii-data-image` for rendering to terminal




[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)


