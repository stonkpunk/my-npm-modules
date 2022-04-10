# image-to-triangles

convert an image into triangles with vertex colors.

eg, compress image data using mesh compression! 

poor man's vector tracing.

converts raw image data into a heightmap triangle mesh, then simplifies the mesh with quadratic error metrics, then discards the generated height data. results are a list of 3d triangles with y-coordinates set to zero. 

note - this tool only calculates the triangles and colors, it does not render them.

## Installation

```sh
npm i image-to-triangles
```

## Usage 

```javascript
image2Triangles(pixelsBuffer,width,height, simplifyPercent=0.25, vertColorFlip=false) //vertColorFlip swaps triangle winding for vertex colors
```

```javascript
var img = require('image-sync').read('./cat64.png'); //{width, height, data, saveAs}

//image data is in flat uint8 rgba format [r,g,b,a,r,g,b,a...]
var imgTris = require('image-to-triangles').image2Triangles(img.data, img.width, img.height);

var triangles = imgTris.simpTris; //simplified set of triangles, each triangle is [[x,y,z],[x,y,z],[x,y,z]]
var triangleColorsFlat = imgTris.simpTrisColorsFlat; //1 color per triangle [r,g,b] -- [255, 255, 255] for white etc
var triangleColorsVerts = imgTris.simpTrisColors; //1 color per vert, each triangle gets [[r,g,b],[r,g,b],[r,g,b]]

// imgTris = {
//     tris, //full set of triangles - length = width*height*2
//     trisColors, //per-triangle colors for full set
//     trisColorsFlat, //per-vertex colors for full set
//     simpTris, //simplified set of triangles
//     simpTrisColors, //per-triangle colors for simplified set 
//     simpTrisColorsFlat //per-vertex colors for simplified set 
// }
```

<img src="https://i.imgur.com/4xvu5XA.png" alt="original image" width="320"/>

^ original 64x64 image 

<img src="https://i.imgur.com/Hn3LbmR.png" alt="1024 triangles - flat shading" width="320"/>

^ 1024 triangles - flat shading

<img src="https://i.imgur.com/E4MlIcR.png" alt="1024 triangles - vertex colors" width="320"/>

^ 1024 triangles - vertex shading

<img src="https://i.imgur.com/g3oVL43.png" alt="4096 triangles - wireframe" width="320"/>

^ 1024 triangles - wireframe

<img src="https://i.imgur.com/yxHytjW.png" alt="512 triangles - flat shading" width="320"/>

^ 512 triangles - flat shading

<img src="https://i.imgur.com/Mf8UCE3.png" alt="512 triangles - vertex colors" width="320"/>

^ 512 triangles - vertex shading

<img src="https://i.imgur.com/THwCDJT.png" alt="4096 triangles - flat shading" width="320"/>

^ 4096 triangles - flat shading

<img src="https://i.imgur.com/Ie9tDbD.png" alt="4096 triangles - vertex colors" width="320"/>

^ 4096 triangles - vertex shading



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



