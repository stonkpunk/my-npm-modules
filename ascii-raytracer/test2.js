var art = require('./index.js');

var config = {
    distanceFunction: art.distanceFunctions.dfMaze,
    raytraceFunction: art.distanceFunctions.dfMazeTrace,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);