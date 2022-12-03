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
//set bunny.vertexColors or bunny.faceColors to specify triangle colors, otherwise get colors based on normals
var meshViewer = tmv.meshViewer.modelViewer();

//change the model:
//var newModel = require('bitey'); //note that bitey has much bigger scale than bunny
//meshViewer.updateModel(newModel);

//just for hacking/fun/experimentation -- can also launch regl raytracing test scene
//var meshViewer = tmv.raytraceViewer.modelViewer(); //this is just a static test scene, model cannot be updated
```

![bunny](https://i.imgur.com/hzDDPSd.png)

![raytracing](https://i.imgur.com/n7URvAd.png)

## See Also
- [@kmamal/sdl](https://www.npmjs.com/package/@kmamal/sdl)
- [regl](https://www.npmjs.com/package/regl) 
- [triangles-mesh-renderer](https://www.npmjs.com/package/triangles-mesh-renderer) - CPU mesh renderer, no SDL/GL/GPU needed, but slow


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



