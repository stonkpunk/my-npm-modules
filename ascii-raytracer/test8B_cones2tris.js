var art = require('./index.js');

var randomPoint3d = function(){
    var S = 32;
    return [Math.random()*S,Math.random()*S,Math.random()*S];
}

var randomLine3d = function(){
    return [randomPoint3d(),randomPoint3d()];
}

var randomCone3d = function(){
    return {
        line: randomLine3d(),
        r0: Math.random()/2+0.5,
        r1: Math.random()/2+0.5
    }
}

var cone2Triangles = require('./cones-to-triangles.js').cone2Triangles;

var tris = [];
for(var i=0; i<32; i++){
    tris.push(...cone2Triangles(randomCone3d()))
}

var config = {
    triangles: tris,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}

art.runScene(config);