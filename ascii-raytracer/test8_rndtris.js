var art = require('./index.js');

var randomPoint3d = function(){
    var S = 32;
    return [Math.random()*S,Math.random()*S,Math.random()*S];
}

var randomTriangles = [];

for(var i=0; i<100; i++){
    var randomTri = [ randomPoint3d(), randomPoint3d(), randomPoint3d() ];
    randomTriangles.push(randomTri);
}

var config = {
    triangles: randomTriangles,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);