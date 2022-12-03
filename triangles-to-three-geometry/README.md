# triangles-to-three-geometry

convert raw triangles or complexes [such as `bunny`] to/from three.js geometries
## Installation

```sh
npm i triangles-to-three-geometry
```

## Usage 

```javascript
var tttg = require('triangles-to-three-geometry');

//indexed mesh {positions, cells}
var bunny = require('bunny');

//raw list of triangles [ [[x,y,z],[x,y,z],[x,y,z]] ... ]
var bunnyTriangles = require('triangles-index').deindexTriangles_meshView(bunny);

//indexed triangles --> indexed three geom
var threeBunny = tttg.trianglesIndexed2ThreeGeom(bunny);

//raw triangles --> three geom [optionally, indexed]
var doIndex = true; //default true
var threeBunny2 = tttg.triangles2ThreeGeom(bunnyTriangles, doIndex);

//three geom --> tris [or indexed tris]
//threeGeomToTriangles(threeGeom, doIndex=false);
//if doIndex=true, returns {cells, positions}, otherwise returns raw tris
var bunnyTris2 = tttg.threeGeomToTriangles(threeBunny2);

//three geom --> indexed triangles
//this is the same as threeGeomToTriangles(threeGeom, true)
var bunny2 = tttg.threeGeomToTrianglesIndexed(threeBunny2) ;

console.log("bunny orig ", bunny.cells.length)
console.log("bunny tris ", bunnyTriangles.length)
console.log("three bunny verts", threeBunny.attributes.position.array.length)
console.log("bunnyTris2 ", bunnyTris2.length)
console.log("bunny2 ", bunny2.cells.length)

// bunny orig  3674
// bunny tris  3674
// three bunny verts 5517
// bunnyTris2  3674
// bunny2  3674
```

## See Also

- [triangles-mesh-viewer-sdl-regl](https://www.npmjs.com/package/triangles-mesh-viewer-sdl-regl) 


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



