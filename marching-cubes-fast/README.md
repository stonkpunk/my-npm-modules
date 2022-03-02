# marching-cubes-fast

Fast sparse marching cubes implementation.

Rather than scaling with volume O(N<sup>3</sup>) , this tool has runtime O(N<sup>H</sup>), where H is the [Hausdorff dimension](https://en.wikipedia.org/wiki/Hausdorff_dimension) of the surface of the scalar field. In practice this means that the runtime is approximately proportional to the surface area (H≈2). 

How it works:

This tool breaks down the space like an octree and only runs the Marching Cubes kernal on voxels near the surface. Each octant queries the signed distance function from its center and if the result is farther than the covering radius of the octant, the octant is discarded. The process is repeated recursively.

You can also use this to create sparse voxel sets, simply skipping the Marching Cubes step. 

Based on [isosurface](https://www.npmjs.com/package/isosurface) by mikolalysenko, in turn based on [Paul Bourke's original](http://local.wasp.uwa.edu.au/~pbourke/geometry/polygonise/)

## Installation

```sh
npm i marching-cubes-fast
```

## Usage 

```javascript
var mcf = require('marching-cubes-fast');

//create a signed distance function - here we have 3d simplex noise

var {SimplexNoise} = require('simplex-noise');
var simplex = new SimplexNoise(1004);
var dfSimplex3d = function(x,y,z){
    var s = 20.0
    return simplex.noise3D(x/s,y/s,z/s)+0.5;
}

//polygonize the field - convert it to triangles with marching cubes

var resolution = 32; //scanning resolution, must be a power of 2
var scanBounds = [[0,0,0],[resolution,resolution,resolution]]; //bounding box to scan over

var result = mcf.marchingCubes(resolution, dfSimplex3d, scanBounds);

//if you want a list of voxels only...
//var voxels = mcf.getSubBlocksRecursive(scanBounds, iterations, dfSimplex3d);
//voxels array returned in the same format as scanBounds

//if you want to run marching cubes on your own list of voxels...
//var result = mcf.marchingCubesVoxelList(dfSimplex3d, listOfVoxels); //array of voxels, where each voxel is a bounding box like scanBounds

console.log(result);

// marching cubes result...

// {
//     positions: [  //vertices
//         [ 0.2039299646182391, 1, 0 ],
//         [ 0, 0.7943976862618888, 0 ],
//         [ 0, 1, 0.8012346044071122 ],
//          ...
//     cells: [      //faces
//         [ 1, 0, 2 ],       [ 3, 4, 5 ],
//         [ 14, 12, 13 ],    [ 14, 13, 10 ],
//         [ 16, 18, 15 ],    [ 19, 21, 20 ],
//         ...

//view the result with ascii-raytracer

var ti = require('triangles-index');
var art = require('ascii-raytracer');
var tris1 = ti.deindexTriangles_meshView(result);
var config = {
    tris:tris1,
    triangleColors: tris1.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    cameraPos: [22,29,-12],
    cameraRot: [2.2,-4.4]
}
art.runScene(config);
```

![https://i.imgur.com/Eah0Dx4.png](https://i.imgur.com/Eah0Dx4.png)


## See Also

- [isosurface](https://www.npmjs.com/package/isosurface) 