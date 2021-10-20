var taf = require('./index.js');

//triangle is 3 pts [x,y,z]
var triangle = [[0,0,1],[1,0,1],[1,1,1]];

var area = taf(triangle);

console.log(area);
