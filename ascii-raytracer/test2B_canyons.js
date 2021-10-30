var art = require('./index.js');

var config = {
    distanceFunction: art.distanceFunctions.dfCanyon,
    cameraPos: [38.37,0.34,15.16],
    cameraRot: [1.57,0.65],
    aspectRatio: 4/3
}




art.runScene(config);