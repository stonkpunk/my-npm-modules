var taf = require('./index-faster.js');

//triangle is 3 pts [x,y,z]
var triangle = [[0,0,1],[1,0,1],[1,1,1]];
var triangle2 = [[0,0,2],[1,0,1],[1,1,2]];
var triangle3 = [[0,0,1],[1,0,2],[1,1,1]];

var area = taf(triangle);

console.log(area);

var t0=Date.now();
for(var i=0;i<10000000;i++){
    area = taf(triangle);
    area = taf(triangle2);
    area = taf(triangle3);
}
console.log("took",Date.now()-t0);

