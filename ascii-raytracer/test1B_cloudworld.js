var art = require('./index.js');

var config = {
    distanceFunction: art.distanceFunctions.dfCloudWorld,
    mouseControl: true
}



art.runScene(config);