# obj-to-colored-triangles

utility to convert a textured 3d mesh [Wavefront .obj] into a list of colored triangles.

eg, this colors the mesh with per-face or per-vertex colors that approximate the original texture.

note - this tool is for Node.js, not browsers. 

## Installation

```sh
npm i obj-to-colored-triangles
```

## Usage 

```javascript
var otct = require('obj-to-colored-triangles');
var TEX = './Ficus-Carica-Texture-8k.jpg'; //texture file
var OBJ = './Ficus-Carica.OBJ'; //obj file including UV coords etc
var smoothColors = false; //if true, uses average of vertex colors. if false, takes color at center of each triangle.

var res = otct.obj2ColoredTrianglesSync(TEX, OBJ, smoothColors)[0]; //multi-mesh OBJ's may contain more than 1 result 

//res = {
//    tris, //triangles, each one [[x,y,z],[x,y,z],[x,y,z]] 
//    cells, //indexed faces, each one [a,b,c]
//    positions, //vertices, each one [x,y,z]
//    cells_uvs, //uv coords, each one [x,y] 
//    cellFlatColors, //color per triangle, each one like [255,255,255]
//    cellVertsColors //color per triangle per vertex, each row like [[255,255,255],[255,255,255],[255,255,255]]
// }

var cellFlatColors = res.cellFlatColors; 
//var cellVertsColors = res.cellVertsColors; 

//get simple reduced JSON representation, rescaled to be contained in bounding box size 10:
var boundsMaxDimension = 10;
var jsonObj = otct.getJsonModel(res2, boundsMaxDimension)

//getJsonModel(coloredTrianglesResultObj, rescaleSize = 10, FLOAT_DIGITS=3, doIncludeFlatColors = true, doIncludeVertColors=false)
//returns {meshIndexed, flatColors?, vertColors?}
//where meshIndexed = {cells, positions}
```

![texture](https://i.imgur.com/Yww9RTf.png)

^ original mesh with texture

![tris-no-smooth](https://i.imgur.com/0eXz6DL.png)

^ mesh built from colored triangles, `smoothColors = false;`

![tris-smooth](https://i.imgur.com/Jw2yzq2.png)

^ mesh built from colored triangles, `smoothColors = true;`


## See Also

- [image-to-triangles](https://www.npmjs.com/package/image-to-triangles)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



