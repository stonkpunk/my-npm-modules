//generate random box [[x,y,z],[x,y,z]]
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

var ba = require('./index.js');
var fastBVHMode = true; //fast mode vs SAH mode (surface area heuristic)
var bvhArray = ba.aabbsToBvhArray(randomBoxes, fastBVHMode)

var traceFunc = function(ray){
    var o = ray.point;
    var v = ray.vector;
    var res = ba.raycast([o.x,o.y,o.z], [v.x,v.y,v.z], bvhArray);
    return res;
}

var distFunc = function(x,y,z){
    return ba.distance([x,y,z], bvhArray);
}

var config = {
    raytraceFunction: traceFunc,
    distanceFunction: distFunc,
    boxes: randomBoxes,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    cameraMode: 0 //0 normals 1 depth
}

require('ascii-raytracer').runScene(config);