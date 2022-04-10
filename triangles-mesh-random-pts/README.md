# triangles-mesh-random-pts

generate random points and normals evenly distributed on a triangle mesh.

you can use this tool to generate random points on a surface and/or to create "hairs" on a surface.

each result has format `{pt: [x,y,z], normal: [x,y,z], normalLine: [[x,y,z],[x,y,z]], triangleIndex: int}`

triangles are chosen randomly [weighted by area], then points are generated using `triangle-random-pts`

resulting normals are interpolated via vertex normals + barycentric coordinates.

## Installation

```sh
npm i triangles-mesh-random-pts
```

## Usage 

```javascript
var meshRndPts = require('triangles-mesh-random-pts');

//here we generate 5000 random points on the surface of the stanford bunny mesh
//each result has format {pt: [x,y,z], normal: [x,y,z], normalLine: [[x,y,z],[x,y,z]], triangleIndex: int}

var bunny = require("bunny");
var results = meshRndPts.randomPtsNormalsForMeshIndexed(bunny,5000);

//meshRndPts.randomPtsNormalsForMesh(tris, numberPts) is similar but takes a list of triangles and indexes them automatically
//where each triangle = [[x,y,z],[x,y,z],[x,y,z]]

//view the result with ascii-raytracer

var art = require('ascii-raytracer');
var config = {
    thickness:0.05, //line rendering thickness
    lines: results.map(r=>r.normalLine),
    lineColors: results.map(r=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:false,
    cameraPos: [-6.63,11.11,16.56],
    cameraRot: [1.93,-7.47]
}
art.runScene(config);
```

![500](https://i.imgur.com/AAwTEpn.png)

^500 random bunny hairs

![5000](https://i.imgur.com/lsGbafv.png)

^5,000 random bunny hairs

![50000](https://i.imgur.com/bOq0d2P.png)

^50,000 random bunny hairs


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

