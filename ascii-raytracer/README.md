# ascii-raytracer

Explore infinite 3d worlds from the comfort of your terminal!

Simple utility takes a signed distance function and lets you explore it with realtime raytracing (marching spheres) or alternatively by using a user-provided raytracing function. No GPU needed! 

![blob world](https://i.imgur.com/Ok0CE7M.gif)

## Why?

For retro fun, to experiment with distance functions / 3d algorithms / ray-tracing / data-stuctures / optimization without dealing with browser, GPU, ect.

## Table of Contents

- [Installation](#installation)
- [Controls](#controls)
- [Simple Example - Blob World](#simple-example---blob-world)
- [With Custom Raytracer - Maze](#with-custom-raytracer---maze)
- [Polygon Mesh with Bounding Volume Hierarchy](#polygon-mesh-with-bounding-volume-hierarchy)
- [UV Texture Mapping](#uv-texture-mapping)
- [3D Texture Mapping](#3d-texture-mapping)
- [Taking high-res screenshots](#taking-high-res-screenshots)

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

- V - Toggle anti-aliasing (runs 4x slower)

- P - Take screenshot (saves PNG with 4x resolution)

- Hold shift to move/rotate faster 

## Simple Example - Blob World

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

## With Custom Raytracer - Maze

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

## Polygon Mesh with Bounding Volume Hierarchy

```javascript
//example with polygon mesh, 5000 triangles
//raytracer uses bounding volume hierarchy 

var art = require('ascii-raytracer');

var config = {
    distanceFunction: art.distanceFunctions.dfSkull,
    raytraceFunction: art.distanceFunctions.dfSkullTrace,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);
```
![skull](https://i.imgur.com/DeIc8qd.png)
![screenshot](https://i.imgur.com/eZrUu7P.png)

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

##Taking high-res screenshots

Press P to save a screenshot [png file]. By default, screenshots are 4x higher resolution than the ascii render. 

To make screenshots bigger or smaller, specify `screenShotScaleUp` in the config [default 4]

Warning - depending on your scene, taking a screenshot may be very slow!

```javascript
var art = require('./index.js');

var config = {
    distanceFunction: art.distanceFunctions.dfSkull,
    raytraceFunction: art.distanceFunctions.dfSkullTrace,
    resolution: 64,
    aspectRatio: 1.0,
    screenShotScaleUp: 8 //default is 4 
}

art.runScene(config);
```

![screenshot](https://i.imgur.com/kEmFe93.png)