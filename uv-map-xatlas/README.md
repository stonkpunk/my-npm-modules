# uv-map-xatlas

use this tool to perform automatic uv mapping / uv unwrapping / mesh parameterization / texture mapping of a triangle mesh / simplicial complex.

this is just a simplified interface for [xatlas.js](https://github.com/repalash/xatlas.js/) using the wasm build, allowing easy use of xatlas in a Node.js environment

## Installation

```sh
npm i uv-map-xatlas
```

## Usage 

```javascript
//basic usage
var bunny1 = require('bunny');
var xatlas = require('uv-map-xatlas');
xatlas.atlasForIndexedTriangles(bunny1, function(atlas){
    var resultObject = xatlas.atlasToTrianglesObjsList(atlas);
    console.log(resultObject);
    // {
    //     positions, //unique verts [x,y,z]
    //     cells, //cell per triangle [a,b,c]
    //     uvs, //uv per unique vert, each [u,v]
    //     triangles, //triangles in 3d
    //     trianglesUVs, //triplets of uv coords, per-triangle
    //     trianglesUVPreview //3d triangles in 2d, to show UV layout
    // }
});

//usage using raw triangles -- each tri is [[x,y,z],[x,y,z],[x,y,z]]
// var ti = require("triangles-index");
// var bunny1tris = ti.deindexTriangles_meshView(bunny1);
// xatlas.atlasForTriangles(bunny1tris, function(res){})
```

Full list of functions

```javascript
{
    atlasToUVList,
    atlasToVertList,
    atlasToCellList,
    atlasToTrianglesObjsList,
    atlasForIndexedTriangles,
    atlasForTriangles
}
```

## See Also 

[xatlas-web](https://www.npmjs.com/package/xatlas-web)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

