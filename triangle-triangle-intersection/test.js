var tti = require('./index.js');

var triangle1 = [[0,0,0],[1,0,0],[1,1,0]];
var triangle2 = [[0,0,1],[1,0,1],[1,1,-1]];
var triangle3 = [[0,0,-1],[1,0,-1],[1,1,-1]];

var intersection = tti(triangle1,triangle2);
var no_intersection = tti(triangle1,triangle3);

console.log(intersection);
console.log(no_intersection);