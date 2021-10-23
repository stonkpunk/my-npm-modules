This is a fork of [benraziel's bvh-tree](https://github.com/benraziel/bvh-tree). Due to some optimizations, some function signatures are not backward compatible. New intersection methods have been added.

To install this version:   
```
npm install --save bvh-tree-plus
```

# bvh-tree-plus

A Bounding Volume Hierarchy data structure written in javascript, for spatial indexing of large triangle meshes.
Enables fast intersection of rays, a AABB and a sphere with a triangle mesh.

## Usage
### Construct a BVH from a list of triangles
The fork from Ben Raziel differs in this, the set of triangles sent to the BVH constructor is no longer an Array of triangle (with each triangle being an Array(3) of {x, y, z}). In this version, the set of triangles is as a single dimensional array of vertices, such as:

```js
// for the sake of this example, the triangles will be named t0, t1, t2
// and the vertices of each triangle will be named A, B and C
var triangles = new Float32Array([
  t0Ax, t0Ay, t0Az, t0Bx, t0By, t0Cz, t0Cx, t0Cy, t0Cz, // first triangle
  t1Ax, t1Ay, t1Az, t1Bx, t1By, t1Cz, t1Cx, t1Cy, t1Cz, // second triangle
  t2Ax, t2Ay, t2Az, t2Bx, t2By, t2Cz, t2Cx, t2Cy, t2Cz, // third triangle
  ...
]);

// the maximum number of triangles that can fit in a node before splitting it.
var maxTrianglesPerNode = 7;

var bvh = new bvhtree.BVH([triangle0, triangle1], maxTrianglesPerNode);
```
Note that the order of the vertice matters when describing each triangle. This has an impact on the normal vector direction and thus, on the back face culling.


### Check if a point is inside the mesh
```js
var point = [12, 30, 50]; // coordinates as [x, y, z]
var isInside = bvh.isInside( pos );
```
- `isInside()` will determine if a point is inside or outside a **closed** mesh. To do that, a ray is thrown from the given point with the direction [1, 0, 0]. If the ray intersects a even number of triangles it means the point is outside, if the ray intersects an odd number of triangles it means the point is inside the mesh.

### Intersect a ray with the BVH
```js
// origin point of the ray
var rayOrigin = {x: 1500.0, y: 3.0, z:1000};

// direction of the ray. should be normalized to unit length
var rayDirection = {x: 0, y:0, z:-1};

// if 'true', only intersections with front-faces of the mesh will be performed
var backfaceCulling = true;

var intersectionResult = bvh.intersectRay(rayOrigin, rayDirection, backfaceCulling);
```
`intersectsRay()` returns an array of intersection result objects, one for each triangle that intersected the ray. Each object contains the following properties:
- `triangle` the 1D array of vertices such as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
- `triangleIndex` the position of the intersecting triangle in the input triangle array provided to the BVH constructor.
- `intersectionPoint` the intersection point of the ray on the triangle.


### Intersect a sphere with the BVH
```js
// creating a sphere
var sphere = {
  radius: 10,
  center: [
    33, // x coordinate
    22, // y coordinate
    11  // z coordinate
  ]
};

var intersectionResult = bvh.intersectSphere(sphere);
```
`intersectSphere()` returns an array of intersection result objects, one for each triangle that intersected the ray. Each object contains the following properties:
- `triangle` the 1D array of vertices such as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
- `triangleIndex` the position of the intersecting triangle in the input triangle array provided to the BVH constructor.
Note that only the triangles with their 3 vertices inside the sphere are returned.


### Intersect a AABB with the BVH
*AABB: axis aligned bounding box*  
```js
// creating a sphere
var sphere = {
  radius: 10,
  center: [
    33, // x coordinate
    22, // y coordinate
    11  // z coordinate
  ]
};

var boxPosition = [33, 22, 11]; // (x, y, z) coordinate of the center of the box
var boxSize = [8, 12, 16]; // box size along axis (x, y, z)

// box boundaries in world coords
var box = {
  // minimum bound [x, y, z]
  min: [boxPosition[0] - boxSize[0]/2, boxPosition[1] - boxSize[1]/2, boxPosition[2] - boxSize[2]/2],
  // maximum bound [x, y, z]
  max: [boxPosition[0] + boxSize[0]/2, boxPosition[1] + boxSize[1]/2, boxPosition[2] + boxSize[2]/2],
}

var intersectionResult = bvh.intersectBox(box);
```
`intersectBox()` returns an array of intersection result objects, one for each triangle that intersected the ray. Each object contains the following properties:
- `triangle` the 1D array of vertices such as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
- `triangleIndex` the position of the intersecting triangle in the input triangle array provided to the BVH constructor.
Note that only the triangles with their 3 vertices inside the box are returned.


## License
Copyright (c) 2015 Ben Raziel. MIT License
