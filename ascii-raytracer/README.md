# ascii-raytracer

Explore infinite 3d worlds from the comfort of your terminal!

Simple utility takes a signed distance function and lets you explore it with realtime raytracing (marching spheres) or alternatively by using a user-provided raytracing function. No GPU needed! 

[![blob world](https://i.imgur.com/Ok0CE7M.gif)](https://www.youtube.com/watch?v=kh4cRvTnPO8)

## Why?

For retro fun, to experiment with distance functions / 3d algorithms / ray-tracing / data-stuctures / optimization without dealing with browser, GPU, ect.

## Table of Contents

- [Installation](#installation)
- [Controls](#controls)
- [Example - Blob World](#example---blob-world)
- [Example - Custom Raycaster - Maze](#example---custom-raycaster---maze)
- [Example - View STL file](#view-stl-file)
- [Build a scene from boxes](#build-a-scene-from-boxes)
- [Build a scene from triangles](#build-a-scene-from-triangles)
- [UV Texture Mapping](#uv-texture-mapping)
- [3D Texture Mapping](#3d-texture-mapping)
- [Taking high-res screenshots](#taking-high-res-screenshots)
- [See Also](#see-also)

## Installation

```sh
npm i ascii-raytracer
```

## Controls

- A/S/W/D - move camera

- Arrow Keys - rotate camera

- Q/E - rise/fall

- R/F - change field of view

- C/X - change camera mode 

- H - Toggle fast anti-aliasing ([EPX](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97) + anti-aliasing simultaneous)

- V - Toggle naive anti-aliasing (2x render size, runs 4x slower)

- U - Toggle [EPX](https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97) Upscaling (1/2 render size + 2x upscale)

- P - Take screenshot (saves PNG with 4x resolution)

- Hold shift to move/rotate faster 

## Example - Blob World

Simplest pre-built example, using only a distance function.

```javascript
//here just a distance function - raytracing is done with marching spheres

//distance function format:
//funtion(x,y,z){return signedDistanceToScene;}

//see src of dfBlobWorld for more details

var art = require('ascii-raytracer');

var config = {
    distanceFunction: art.distanceFunctions.dfBlobWorld
}

art.runScene(config);
```

![blob world](https://i.imgur.com/GvLQZtV.png)
![blob world](https://i.imgur.com/xL7RjdO.png)

## Example - Custom Raycaster - Maze

It's usually a good idea to use a custom raytracing / raycasting function if you can organize your scene with an efficent data structure.

This pre-built example renders a maze which internally is stored in an R-Tree.

Note - the scene will still render if `raytraceFunction` is removed, but may be very slow!

You can also build scenes using just a list of boxes (see [below](#build-a-scene-from-boxes)).

```javascript
//here we additionally include a custom raytracing function [much faster than naive marching spheres]

//raytrace function format:
// function(ray) { 
//     var o = ray.point; //{x,y,z} origin of ray
//     var v = ray.vector; //{x,y,z} direction of ray
//     return distance;
// }

//example with a maze build from axis aligned bounding blocks

var art = require('ascii-raytracer');

var config = {
    distanceFunction: art.distanceFunctions.dfMaze,
    raytraceFunction: art.distanceFunctions.dfMazeTrace, //raytracer uses RTree 
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);
```
![maze](https://i.imgur.com/wJLHP5m.png)
![maze](https://i.imgur.com/YaRuimz.png)

## View STL file

By specifying `stl` in the config, the program will automatically produce a distance function and raycaster for your STL model.

You can also build scenes using just a list of triangles (see [below](#build-a-scene-from-triangles)).

```javascript
//example with polygon mesh, 5000 triangles
//raycaster uses bounding volume hierarchy 

var art = require('ascii-raytracer');

var config = {
    stl: "./Bitey_Reconstructed_5k.stl"
}

art.runScene(config);
```
![skull](https://i.imgur.com/DeIc8qd.png)
![screenshot](https://i.imgur.com/eZrUu7P.png)

## Build a scene from boxes

Instead of dealing with distance functions, you can specify your scene with a list of axis-aligned bounding boxes. 

The program will automatically create an appropriate distance function+raycaster.

In this example we create a bunch of random boxes and render them. 

```javascript
var art = require('ascii-raytracer');

//format of box: [lower-point-3d, upper-point-3d]

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
    aspectRatio: 1.0
}

art.runScene(config);
```
![boxes](https://i.imgur.com/EQUvrsF.png)

## Build a scene from triangles

Instead of dealing with distance functions, you can specify your scene with a list of triangles. 

The program will automatically create an appropriate distance function+raycaster.

In this example we create a bunch of random triangles and render them. 

```javascript
var art = require('ascii-raytracer');

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
```

![triangles](https://i.imgur.com/ukBi9W2.png)


## UV Texture Mapping

specify `config.uvFunction` and `config.textureFunction` to render a 2D texture onto the scene.

- `uvFunction` takes (x,y,z) as input and returns `[u,v]` texture coordinates in range 0...1
- `textureFunction` takes (u,v) as inputs and returns `[r,g,b]` color data in range 0...1

in this example we load a PNG file with the `readimage` module and then specify textureFunction to pull color values from the image, and uvFunction for tiling the image. 

the scene is the same maze from the earlier example. 

```javascript
var art = require('ascii-raytracer');
var fs = require("fs")
var readimage = require("readimage")
var filedata = fs.readFileSync("./cat.png")

readimage(filedata, function (err, image) {
    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data;

    var myTextureFunction = function(u,v){ //pull colors from texture data
        var xc = Math.floor(u*w);
        var yc = Math.floor(v*h);
        var o = (yc*h+xc)*4;
        return [d[o]/255, d[o+1]/255, d[o+2]/255] //return [r,g,b] in range 0...1
    }

    var myUvFunction = function(x,y,z){ //tile texture across XZ plane
        return [Math.abs(x/1.0)%1.0, Math.abs(z/1.0)%1.0]; //return u,v coords
    }

    var config = {
        distanceFunction: art.distanceFunctions.dfMaze,
        raytraceFunction: art.distanceFunctions.dfMazeTrace,
        uvFunction: myUvFunction,
        textureFunction: myTextureFunction,
        resolution: 64,
        aspectRatio: 1.0
    }

    art.runScene(config);
})
```

![texture](https://i.imgur.com/hiwMlHi.png)
![texture](https://i.imgur.com/pDDBBD1.png)
![cat](https://i.imgur.com/ZcAwO6R.png)

## 3D Texture Mapping 

Specify `textureFunction3d` instead of `textureFunction` if you want to define surface colors directly from a 3D function.

In this example we apply 3D perlin noise [from the blob world example] as the surface texture for our maze.

Because the blob world distance function varies over time, the texture is animated!

```javascript
var art = require('ascii-raytracer');

var my3dTextureFunction = function(x,y,z){
    var d = Math.abs(art.distanceFunctions.dfBlobWorld(x*15,y*15,z*15))/2.0; //using 3d perlin noise to define color
    return [d,d,d] //return [r,g,b]
}

var config = {
    distanceFunction: art.distanceFunctions.dfMaze,
    raytraceFunction: art.distanceFunctions.dfMazeTrace,
    textureFunction3d: my3dTextureFunction,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);
```

![maze with perlin noise](https://i.imgur.com/xEBovyQ.png)
![maze with perlin noise](https://i.imgur.com/fWyO2Is.png)

## Taking high-res screenshots

Press P to save a screenshot [png file]. By default, screenshots are 4x higher resolution than the ascii render. 

To make screenshots bigger or smaller, specify `screenShotScaleUp` in the config [default 4]

Warning - depending on your scene, taking a screenshot may be very slow!

```javascript
var art = require('ascii-raytracer');

var config = {
    distanceFunction: art.distanceFunctions.dfSkull,
    raytraceFunction: art.distanceFunctions.dfSkullTrace,
    resolution: 64,
    aspectRatio: 1.0,
    screenShotScaleUp: 8, //default is 4 
    screenShotDir: '/Users/user/Desktop/' //default is ./
}

art.runScene(config);
```

![screenshot](https://i.imgur.com/kEmFe93.png)

## See Also
- [ascii-data-image](https://www.npmjs.com/package/ascii-data-image) - render data to ascii
- [pixel-scale-epx](https://www.npmjs.com/package/pixel-scale-epx) - EPX scaling
- [glsl-imager](https://www.npmjs.com/package/glsl-imager) - render GLSL in terminal
