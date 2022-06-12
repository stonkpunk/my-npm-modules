# palette-simple

generate reduced color palette versions of an image

uses `skmeans` clusters

## Installation

```sh
npm i palette-simple
```

## Usage 

```javascript
var imgPalette = require('palette-simple').imgPalette;
var img = require('image-sync').read('./cat.png');

var numberOfColors = 8;

//imgPalette(data, numberOfColors, skipBuildImage=false) //data is flat uint8 array [r,g,b,a,r,g,b,a ... ]
var dataPalettized = imgPalette(img.data, numberOfColors); //returns {palette, data}

var theColorPalette = dataPalettized.palette;
console.log(theColorPalette);

// palette with 8 colors 
// [
//     [ 158, 130, 122 ],
//     [ 97, 71, 65 ],
//     [ 200, 175, 165 ],
//     ...
// ]

img.data = dataPalettized.data;
img.saveAs('./cat2.png');
```

![2 colors](https://i.imgur.com/JFPvZ1F.png)<br>
2 colors

![4 colors](https://i.imgur.com/wPzrzRH.png)<br>
4 colors

![8 colors](https://i.imgur.com/aC1g8SI.png)<br>
8 colors

![16 colors](https://i.imgur.com/OFtJQWY.png)<br>
16 colors

![32 colors](https://i.imgur.com/dm5dFNQ.png)<br>
32 colors

![original](https://i.imgur.com/G0MDc1e.png)<br>
original

# See Also
- [get-rgba-palette](https://www.npmjs.com/package/get-rgba-palette)
- [image-palette](https://www.npmjs.com/package/image-palette)
- [palette](https://www.npmjs.com/package/palette)

<br><br><br><br>

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



