var art = require('./index.js');

var config = {
    resolution: 32,
    distanceFunction: art.distanceFunctions.dfBlobWorld,
    mouseControl: true,
    slideOffSurfaces: true
}



art.runScene(config);