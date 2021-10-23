# ascii-raytracer

Explore infinite 3d worlds from the comfort of your terminal!

Simple utility takes a signed distance function and lets you explore it with realtime raytracing (marching spheres) or alternatively by using a user-provided raytracing function. No GPU needed! 

![blob world](https://i.imgur.com/Ok0CE7M.gif)

## Why?

For retro fun, to experiment with distance functions / 3d algorithms / ray-tracing / data-stuctures / optimization without dealing with browser, GPU, ect.

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

![blob world](https://i.imgur.com/lw0k06D.png)

## With Custom Raytracer - Maze

Note: move the camera up/back to see the maze (see the coordinates in the screenshot)

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
![maze](https://i.imgur.com/ut7P0ZU.png)

## Polygon Mesh with Bounding Volume Hierarchy

Note: move the camera backwards to see the object (see the coordinates in the screenshot)

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
![skull](https://i.imgur.com/baZkxNd.png)
