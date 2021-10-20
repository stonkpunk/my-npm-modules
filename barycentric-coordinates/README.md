# barycentric-coordinates

get barycentric coordinates for triangle and tetrahedron, convert to/from cartesian coordinates

## Installation

```sh
npm i barycentric-coordinates
```

## Usage 

```javascript
var bc = require('barycentric-coordinates');

//triangle is 3 pts [x,y,z]
var triangle = [[0,0,1],[1,0,1],[1,1,1]];

//tetrahedron is 4 pts [x,y,z]
var tetrahedron = [[0,0,1],[1,0,1],[1,1,1],[1,1,0]];

//3d pt in space, cartesian coords
//note -- for correct triangular barycentric coordinates, the point must be in the same plane as the triangle!
//        but if you only want tetrahedral barycentric coordinates, the position of the point does not matter.
var pt = [2.0/3.0, 1.0/3.0, 1.0]; //here we pick the point in the middle of the triangle

//get barycentric coordinates...
var triBaryCoords = bc.triangleBarycentricCoords(pt,triangle); 
var tetraBaryCoords = bc.tetrahedronBarycentricCoords(pt,tetrahedron); 

console.log("cartesian",pt); //[ 0.667, 0.333, 1.0]
console.log("barycentric",triBaryCoords); //[ 0.333, 0.333, 0.333]
console.log("barycentric",tetraBaryCoords); //[ 0.333, 0.333, 0.333, 0.0]

//convert back to cartesian from barycentric...

var triCartesianCoords = bc.triangleCartesianCoords(triBaryCoords, triangle);
var tetraCartesianCoords = bc.tetrahedronCartesianCoords(tetraBaryCoords, tetrahedron);

console.log("cartesian",triCartesianCoords); //[ 0.667, 0.333, 1.0]
console.log("cartesian",tetraCartesianCoords); //[ 0.667, 0.333, 1.0]
```

## See Also

- [tetrahedron-distance](https://www.npmjs.com/package/tetrahedron-distance) - distance to tetrahedron



