var art = require('./index.js');

var randomPoint3d = function(){
    var S = 32;
    return [Math.random()*S,Math.random()*S,Math.random()*S];
}

var randomPts = [];

for(var i=0; i<100; i++){
    randomPts.push(randomPoint3d());
}

var config = {
    pts: randomPts,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}

art.runScene(config);