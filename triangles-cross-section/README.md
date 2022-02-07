# triangles-cross-section

get filled 2d cross-sections of a 3d triangle mesh.

slices along the y axis, then uses `earcut` and [optionally] `hull.js` to mesh the sliced results

```sh
npm i triangles-cross-section
```

test using stl file and visualizing with ascii-raytracer

```javascript
var fs = require("fs");
var stl = require('stl');
var path = require('path');
var tcs = require('triangles-cross-section'); 

//load triangles from stl
var triangles = stl.toObject(fs.readFileSync(path.join(__dirname,'Bitey_Reconstructed_5k.stl'))).facets.map(function(f){return f.verts});

//each triangle is array of 3 pts, each pt is array [x,y,z]

//get 5 cross-sections
var numberSlices = 5;
var hullMode = true; //get convex-ish hull of tris, with curvature param set by hullCurvature [curvature of 1 gives detailed outline, curvature 9999 is approx convex hull]
var cleanUpTris = false; //remove triangles that fall outside the original mesh [reduces errors in some cases]
var hullCurvature = 9999; //curvature for convex hull algo (see npm hull.js). set to 1 for detailed outline, or a high number for convex hull
var skipTriangles = false; //if true, only return line segments, do not triangulate the infill
var res = tcs.crossSectionsXZ(triangles,numberSlices,hullMode,cleanUpTris, hullCurvature,skipTriangles); //add ",false,true)" to do earcut mode instead of hull mode

//res is array of {lineSegments, ptsList, triangles}
var resTris = [].concat(...res.map(r=>r.triangles));

//view result with ascii-raytracer
var art = require('ascii-raytracer');
var config = {
    triangles: resTris,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config); //press c to change camera mode 
```

![1](https://i.imgur.com/gXWXxTK.png)

^ original mesh

![2](https://i.imgur.com/dVdZPrU.png)

^ mesh with 25 convex-hull slices `[hullMode=true, cleanUpTris=false, hullCurvature=9999]`

![2](https://i.imgur.com/dvRyIgx.png)

^ mesh with 25 detailed slices `[hullMode=false, cleanUpTris=true, hullCurvature=1]`

![3](https://i.imgur.com/l4voiaV.png)

^ 5 slices, line segments only 