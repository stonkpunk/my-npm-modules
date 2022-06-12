var trp = require('./index.js');

//triangle is 3 pts [x,y,z]
var triangle = [[0,0,1],[1,0,1],[1,1,1]];

var numberOfPoints = 10;
var pointsRandom = trp.randomPointsInTriangle(triangle,numberOfPoints);
var pointsQuasiRandom = trp.quasiRandomPointsInTriangle(triangle,numberOfPoints);

console.log(pointsRandom);
console.log(pointsQuasiRandom);