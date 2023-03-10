# triangles-mesh-viewer-sdl-regl

very simple 3d mesh viewer with fps controls [ASWD+mouse] via SDL + regl, for node.js

meant to quickly view meshes in the same format as `bunny` and just as a simple boilerplate to be hacked and modified.

## Installation

```sh
npm i triangles-mesh-viewer-sdl-regl
```

## Usage 

```javascript
var tmv = require('triangles-mesh-viewer-sdl-regl');

//modelViewer(theModel? = bunny); //default model is require('bunny')

var bunny = require('bunny');

//example with smooth vertex colors
//bunny.vertexColors = bunny.positions.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

//example with discontinuous vertex colors -- force each tri to have its own verts
//bunny = require('triangles-index').demergeMeshTriangles_meshView(require('bunny'));
//bunny.vertexColors = bunny.positions.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

//random face colors
//bunny.faceColors = bunny.cells.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

var meshViewer = tmv.meshViewer.modelViewer(bunny);

//change the model:
//var newModel = require('bitey'); //note that bitey has much bigger scale than bunny
//meshViewer.updateModel(newModel);

//just for hacking/fun/experimentation -- can also launch regl raytracing test scene
//var meshViewer = tmv.raytraceBvhViewer.modelViewer(); //this is just a static test scene, model cannot be updated
```

![bunny](https://i.imgur.com/hzDDPSd.png)

![raytracing](https://i.imgur.com/n7URvAd.png)

## See Also
- [@kmamal/sdl](https://www.npmjs.com/package/@kmamal/sdl)
- [regl](https://www.npmjs.com/package/regl) 
- [triangles-mesh-renderer](https://www.npmjs.com/package/triangles-mesh-renderer) - CPU mesh renderer, no SDL/GL/GPU needed, but slow


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



