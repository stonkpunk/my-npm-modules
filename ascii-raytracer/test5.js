var art = require('./index.js');

var my3dTextureFunction = function(x,y,z){
    var d = Math.abs(art.distanceFunctions.dfBlobWorld(x*15,y*15,z*15))/2.0; //using sign of 3d perlin noise to define color
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