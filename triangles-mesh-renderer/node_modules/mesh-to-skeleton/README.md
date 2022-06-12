# mesh-to-skeleton

convert a triangle mesh into a list of "skeletal points" - points of "maximum distance from the surface". 

intuitively, if the mesh was "dissolving" from the outside in, the skeletal points would be the last points locally dissolved.

works by raycasting through the mesh from each triangle and taking the midpoint of each result.

this is useful to assist in converting meshes into implicit surfaces / signed distance functions, and other purposes. 

## Installation

```sh
npm i mesh-to-skeleton
```

## Usage 

```javascript
var mts = require('mesh-to-skeleton');
var getSkeletalPoints = mts.getSkeletalPoints;
var getSkeletalPoints_resampled = mts.getSkeletalPoints_resampled;

var bunny = require('bunny'); //stanford bunny model  
var ti = require('triangles-index'); //tool to convert indexed model into triangle list
var triangles = ti.deindexTriangles_meshView(bunny); //raw list of triangles 

//each triangle is an array of 3 pts [[x,y,z],[x,y,z],[x,y,z]]
var skeletonPtsObjs = getSkeletalPoints(triangles); //list of {pt: [x,y,z], dist: distanceToSurface, triangleIndex: i}

//instead of using triangles to generate the points, 
//you can generate X random points uniformly distributed
//across the mesh surface

//here we generate 5000 
var skeletonPtsObjs_resampled = getSkeletalPoints_resampled(triangles, 5000);
```

![bunny](https://i.imgur.com/oO6qWhg.png)

^ original bunny mesh

![bunny midpts](https://i.imgur.com/i6Fhngr.png)

^ skeletal points, one for each triangle (3674 total)

![bunny3](https://i.imgur.com/EvPcuWW.png)

^ using 500 random points

![bunny4](https://i.imgur.com/MatSi5y.png)

^ using 50000 random points 

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



