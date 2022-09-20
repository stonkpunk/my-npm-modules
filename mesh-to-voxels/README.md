# mesh-to-voxels

convert a triangle mesh into a set of voxels / axis-aligned bounding boxes

the bounding box of the mesh is broken up like an octree and only the boxes at the edge and/or inside the mesh are kept

## Installation

```sh
npm i mesh-to-voxels
```

## Usage 

```javascript
var m2v = require('mesh-to-voxels');
var bunny = require('bunny'); //mesh has format {cells, positions}

//meshToVoxels(
// mesh, 
// iters? = 3, //iterations to recursively break down the mesh bounding box  
// cubifyBounds? = true, //turn the mesh bounding box into a cube before start [ensure cube voxels]
// edgesOnly? = true,    //only include voxels straddling the edge of the mesh
// volumeOnly? = false,  //only include voxels totally enclosed within the mesh
// dontSubdivideEnclosedBlocks? = false, //do not subdivide voxels totally enclosed within the mesh
// mergeAfter? = false,  //merge voxels with npm merge-boxes
// meshBvh? = null       //existing BVH
//)

var voxels = m2v.meshToVoxels(bunny)
//see also .threeGeomToVoxels, same api, takes old-style three.js geometry with .faces

console.log("VOXELS", voxels); //each voxel is axis-aligned bounding box [[minX,minY,minZ],[maxX,maxY,maxZ]]

//view result with ascii-raytracer

var art = require('ascii-raytracer');

var config = {
    boxes: voxels,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true
}

art.runScene(config);
```

![bunny1](https://i.imgur.com/dzlP9eW.png)

^ bunny voxels - 3 iterations 

![bunny2](https://i.imgur.com/6df5LW0.png)

^ bunny voxels - 4 iterations

![bunny3](https://i.imgur.com/TYJS6Qf.png)

^ bunny voxels - 5 iterations



<br><br><br>

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



