var intersect = require('../');

var tri = [[5,5,5],[10,15,4],[15,5,3]];
var pt = [9,5,-5];
var dir = [0.1,0.1,0.8];

console.log(intersect([], pt, dir, tri));
