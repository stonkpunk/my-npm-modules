var art = require('./index.js');

var config = {
    distanceFunction: art.distanceFunctions.dfSkull,
    raytraceFunction: art.distanceFunctions.dfSkullTrace,
    resolution: 64,
    aspectRatio: 1.0,
    screenShotScaleUp: 8,
    screenShotDir: '',//'/Users/user/Desktop/'
    mouseControl:true,
}

art.runScene(config);