var td = require('./index.js');

//tetrahedron is 4 pts [x,y,z]
//note that the order of the points does not matter
var tet = [[0,0,0],[0,0,1],[1,0,1],[1,1,1]];

var pt = [5,5,5]; //3d pt outside the tetrahedron
var ptInside = [ 0.5, 0.25, 0.75 ]; //3d pt inside the tetrahedron

//using as a distance function
var distanceFunction = td.signedDistanceFunctionTetrahedron(...tet);
console.log(distanceFunction(...pt)); // 6.928203230275509
console.log(distanceFunction(...ptInside)); // -0.1767766952966369

//getting value directly, without creating distance function
console.log(td.signedDistanceTetrahedron(pt,tet)); // 6.928203230275509
console.log(td.signedDistanceTetrahedron(ptInside,tet)); // -0.1767766952966369

console.log(td.tetrahedronContainsPt(pt,tet)); //false
console.log(td.tetrahedronContainsPt(ptInside,tet)); //true
