# mesh-to-spheres 

convert a triangle mesh into a set of spheres.

the spheres occupy approximately the same volume as the mesh.

useful for constructing smooth implicit surfaces / distance functions from triangle meshes. 

## Installation

```sh
npm i mesh-to-spheres
```

## Usage 

```javascript
var m2s = require('mesh-to-spheres');

var bunny = require('bunny'); //stanford bunny mesh {cells, positions}
var doBruteForceMode=false; //if true, loop through all triangles instead of using rtree data structure
var preShrink = 1.0; //default 1.0, reduce the sphere diameters by this factor
var overlap = 0.5; //default 0.5, allow spheres to overlap by this factor
var doResample = false; //default false, instead of casting per-triangle, pick random points on the mesh surface
var resamplesTotal = 1000; //default 1000. if doResample is true, this is how many random points get used by the algorithm

var spheres = m2s.meshIndexed2Spheres(bunny,overlap,preShrink,doBruteForceMode,doResample,resamplesTotal)

//each sphere is {pt: [x,y,z], dist: radius}

//alternative - use list of raw triangles - each triangle has format [[x,y,z],[x,y,z],[x,y,z]]
var triangles = require('triangles-index').deindexTriangles_meshView(bunny); //get unindexed triangles
var spheres2 = m2s.mesh2Spheres(triangles,overlap,preShrink,doBruteForceMode,resamplesTotal)
```

![bunny0](https://i.imgur.com/7MYEDvq.png)

^ bunny mesh, original

![bunny1](https://i.imgur.com/tB954Os.png)

^ bunny made from 717 spheres [overlap = 0.95]

![bunny2](https://i.imgur.com/QLyCCzV.png)

^ bunny made from 326 spheres [overlap = 0.75]

![bunny3](https://i.imgur.com/oB9hwsC.png)

^ bunny made from 181 spheres [overlap = 0.5]

![bunny4](https://i.imgur.com/ubFgCmm.png)

^ bunny made from 88 spheres [overlap = 0.0]

![bunny5](https://i.imgur.com/xnZ7lUX.png)

^ bunny made from 617 spheres [overlap = 0.0, preShrink = 0.25]




[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



