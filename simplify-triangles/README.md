# simplify-triangles

quadratic error mesh decimation. 

simplified interface for [mesh-simplifier](https://www.npmjs.com/package/mesh-simplifier) - use simple triangles instead of Three.js geometry. 

similar to [mesh-simplify](https://www.npmjs.com/package/mesh-simplify) but based on `mesh-simplifier` because it is much faster.

all are based on or influenced by [this code by sp4cerat](https://github.com/sp4cerat/Fast-Quadric-Mesh-Simplification).

## Installation

```sh
npm i simplify-triangles
```

## Usage 

```javascript
var fs = require("fs");
var stl = require("stl");
var st = require('simplify-triangles');

//each triangle has format [ [x,y,z], [x,y,z], [x,y,z] ]

//load triangles from stl file
var triangles = stl.toObject(fs.readFileSync('./skull.stl')).facets.map(f=>f.verts);

//simplify the triangle mesh, result will have 0.125x as many triangles
//format is same as input
var simplifiedTriangles = st.simplify(triangles,0.125); 

//optional - view the result with ascii-raytracer
var config = {
    triangles: simplifiedTriangles, 
    cameraPos: [45.82,22.11,61.08],
    cameraRot: [1.87,-2.25],
    aspectRatio: 4/3,
    screenShotDir: "/Users/user/Desktop/"
}
require('ascii-raytracer').runScene(config);
```

![skull-before](https://i.imgur.com/pv3UiHP.png) *original*
![skull-after](https://i.imgur.com/ukfvcMr.png) *simplified*

## See Also

- [mesh-simplifier](https://www.npmjs.com/package/mesh-simplifier)
- [mesh-simplify](https://www.npmjs.com/package/mesh-simplify)
- [ascii-raytracer](https://www.npmjs.com/package/ascii-raytracer)



