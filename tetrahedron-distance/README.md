# tetrahedron-distance

Signed distance function for arbitrary tetrahedron, suitable for marching cubes etc

Returns negative values for points inside the tetrahedron, positive for points outside.

Also includes fast function to check if tetrahedron contains point.

The order/winding of the points does not matter. 

## Installation

```sh
npm i tetrahedron-distance
```

## Usage 

```javascript

var td = require('tetrahedron-distance');

//tetrahedron is 4 pts [x,y,z]
//note that the order of the points does not matter 
var tet = [[0,0,0],[0,0,1],[1,0,1],[1,1,1]];

var pt = [5,5,5]; //3d pt outside the tetrahedron
var ptInside = [ 0.5, 0.25, 0.75 ]; //3d pt inside the tetrahedron

//creating a reusable distance function
var distanceFunction = td.signedDistanceFunctionTetrahedron(...tet);
console.log(distanceFunction(...pt)); // 6.928203230275509
console.log(distanceFunction(...ptInside)); // -0.1767766952966369

//getting value directly, without creating distance function
console.log(td.signedDistanceTetrahedron(pt,tet)); // 6.928203230275509
console.log(td.signedDistanceTetrahedron(ptInside,tet)); // -0.1767766952966369

//check if point is contained in tetrahedron
console.log(td.tetrahedronContainsPt(pt,tet)); //false
console.log(td.tetrahedronContainsPt(ptInside,tet)); //true

```

## See Also

- [triangle-distance](https://www.npmjs.com/package/triangle-distance) - distance to triangle

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)




