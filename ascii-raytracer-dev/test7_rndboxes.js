var art = require('./index.js');

var randomBox3d = function(){
    var range = 32;
    var boxSizeMax = 8;
    var p0 = [Math.random()*range,Math.random()*range,Math.random()*range];
    var p1 = [p0[0]+Math.random()*boxSizeMax,p0[1]+Math.random()*boxSizeMax,p0[2]+Math.random()*boxSizeMax];
    return [p0,p1];
}

var randomBoxes = [];
for(var i=0; i<100; i++){
    randomBoxes.push(randomBox3d());
}

var config = {
    boxes: randomBoxes, //or bricks, or blocks
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
}

art.runScene(config);