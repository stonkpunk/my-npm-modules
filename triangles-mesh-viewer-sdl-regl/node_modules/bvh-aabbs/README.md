# bvh-aabbs

Bounding volume hierarchy for axis-aligned bounding boxes.

Put aabbs into a flat array BVH structure to use for raycasting and distance queries in JS or GLSL

Uses code scavenged from Erich Loftis' awesome [THREE.js-PathTracing-Renderer](https://github.com/erichlof/THREE.js-PathTracing-Renderer)

Includes JS port of the [GLSL BVH raycasting function](https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/shaders/BVH_Animated_Model_Fragment.glsl), also adapted into a distance query function.

BVH builders use this [code](https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/js/BVH_Acc_Structure_Iterative_Fast_Builder.js) by Erich Loftis in turn inspired by this [code](https://github.com/ttsiodras/renderer-cuda/blob/master/src/BVH.cpp) by Thanassis Tsiodras

## Installation

```sh
npm i bvh-aabbs
```

## Usage 

```javascript
//"prove" that the BVH works by raytracing using ascii-raytracer

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

var ba = require('bvh-aabbs');
var fastBVHMode = false; //fast mode vs SAH mode (surface area heuristic)
var bvhArray = ba.aabbsToBvhArray(randomBoxes, fastBVHMode) //bvh data structure, flat array

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
```

![result](https://i.imgur.com/abwKDoY.png)


## See Also
- [THREE.js-PathTracing-Renderer](https://github.com/erichlof/THREE.js-PathTracing-Renderer)


<br><br><br>
[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



