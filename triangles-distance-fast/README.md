# triangles-distance-fast

signed or unsigned distance to triangles mesh using rtree and/or bvh tree 

uses `bvh-tree-plus` for the bvh tree and `rbush-3d` for the rtree. 

we use the rtree to quickly get a list of triangles potentially inside a bounding box, and the bvh tree to determine if a point is inside/outside the mesh via raycasting.

```sh
npm i triangles-distance-fast
```

```javascript
//triangle = [[x,y,z],[x,y,z],[x,y,z]]
//aabb = [[x,y,z],[x,y,z]] //axis aligned bounding box, [min, max]

// trianglesDistance(tris, radius, rtree?) // unsigned distance function(x,y,z) sampling over radius, use optional cached rtree - returns >9999 if no triangles within radius
// trianglesDistance_signed(tris, radius, rtree?, bvh?) // signed distance function(x,y,z) sampling over radius, use optional cached rtree and bvh tree - returns abs() > 9999 if no triangles within radius
// trianglesDistanceStable(pt, triangles, trisRTree, eps=0.1, S=1000) unsigned, sampling over 3 narrow bounding boxes along the XYZ axis 
// trianglesDistanceBruteForce(pt, triangles) //brute force / naive approach, testing each triangle
// trianglesIntersectingAABB(tris, aabb, rtree?) // get set of triangles whose bounding boxes intersect the aabb
// triangles2RTree(tris) //get rtree for triangles 
// triangles2BvhTree(tris) //get bvh for triangles 
// trianglesFlatten(tris) //flatten tris into 1-d float32 array

var tdf = require('triangles-distance-fast'); 
var fs = require("fs");
var stl = require('stl');
var path = require('path');

//load tris from stl file
var triangles = stl.toObject(fs.readFileSync(path.join(__dirname,'Bitey_Reconstructed_5k.stl'))).facets.map(function(f){return f.verts});

//make distance function
var df = tdf.trianglesDistance(triangles,20.0);

//use it
var dist = df(10,10,10);
console.log(dist); //5.114792068071368

//returns >9999 if nothing found within the radius [or < -9999 if using signed distance inside mesh]
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

