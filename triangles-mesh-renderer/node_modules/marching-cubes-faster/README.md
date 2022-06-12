# marching-cubes-faster

Even faster [but less generic] version of `marching-cubes-fast` that allows you to build distance functions using CSG-like primitives.

Internally, the primitives are organized by an R-tree via `rbush-3d`. 

Similar to `marching-cubes-fast`, this tool efficiently generates a list of surface cells with an octree-like recursive structure. As that happens, this tool queries the R-tree to associate each leaf cell with only the primitives potentially affecting it. Finally the kernel is run on the leaves.

In practice this means the kernel is only dealing with 1 or 2 primitives at a time for the vast majority of surface cells, and the runtime is roughly proportional to surface area [eg the final number of cells]. 

## Installation

```sh
npm i marching-cubes-faster
```

## Usage 

```javascript
var mfc = require('marching-cubes-faster');
var mb = mfc.meshBuilder;
var dfb = mfc.dfBuilder;

var t0=Date.now();
var theList = [];

for(var i=0; i<1000; i++){
    var radius = 8;
    //functions for adding shapes
    //dfb.addBrick(theList, dfb.randomBrick(), radius); //add an aabb [[x,y,z],[x,y,z]] with radius padding
    //dfb.addTriangle(theList, dfb.randomTriangle(), radius); //add a triangle [[x,y,z],[x,y,z],[x,y,z]] with radius padding [thickness]
    //dfb.addTetra(theList, dfb.randomTetrahedron(), radius); //add a tetrahedron [[x,y,z],[x,y,z],[x,y,z],[x,y,z]] with radius padding
    dfb.addLine(theList, dfb.randomLine(), radius); //add a line segment [[x,y,z],[x,y,z]] with radius thickness
    //dfb.addLineCone(theList, dfb.randomLineCone()); //add a line segment with different end radii r0 and r1 {line:[[x,y,z],[x,y,z]], r0, r1}

    //similar functions for subtracting shapes
    //dfb.subtractBrick(theList, dfb.randomBrick(), radius);
    //dfb.subtractTriangle(theList, dfb.randomTriangle(), radius);
    //dfb.subtractTetra(theList, dfb.randomTetrahedron(), radius);
    //dfb.subtractLine(theList, dfb.randomLine(), radius);
    //dfb.subtractLineCone(theList, dfb.randomLineCone(), radius);
}

var iters = 6; //how many times to subdivide the octree. increasing by 1 will double the number of triangles in the result.
var result = mb.buildForList(theList,iters); //{cells, positions, dfBuilderResult} //dfBuilderResult contains {rtree, rTreeObjs}

//note - by default, the function meshes the bounding box of the entire set of primitives

//if you want to build only an arbitrary bounding box:
//var result = mb.buildForList(theList, iters, boundingBox); //boundingBox = [[x,y,z],[x,y,z]]

//full params:
//buildForList(dfObjList, iters=5, renderBlock = dfListBounds(dfObjList), _dfBuilderResult?)
//set _dfBuilderResult if you want to re-use an rtree from a previous call
```

![lines](https://i.imgur.com/UcdSbk6.png)

^ result as rendered with `ascii-raytracer` [see test.js]

## See Also

- [marching-cubes-fast](https://www.npmjs.com/package/marching-cubes-fast) 
- [sdf-csg](https://www.npmjs.com/package/sdf-csg) - similar tool


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)


