var chopLines = require('./index.js');

//each line segment is two 3d points [x,y,z]
var line1 = [[0,0,0],[5,0,5]];
var line2 = [[0,0,5],[5,0,0]];

var minDist = 0.01; //mininum distance between lines for them to be considered intersecting [default 0.1]

var result = chopLines([line1, line2], minDist); //4 shorter lines

console.log(result);