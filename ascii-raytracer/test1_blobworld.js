var art = require('./index.js');

var config = {
    distanceFunction: art.distanceFunctions.dfBlobWorld,
    mouseControl: true
}



art.runScene(config);