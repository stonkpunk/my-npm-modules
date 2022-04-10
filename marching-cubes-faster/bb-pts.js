var getPointsetBoundsSector = function(ptsSet, padding){
    var pad = padding || 0;
    var ptsSetBounds = {
        x: [99999, -99999],
        y: [99999, -99999],
        z: [99999, -99999]
    };

    ptsSet.map(function(pt){
        ptsSetBounds=clampBoundsToPt(ptsSetBounds,pt);
    });

    var bounds2 = addPadding(ptsSetBounds, pad);

    return [[bounds2.x[0], bounds2.y[0], bounds2.z[0]], [bounds2.x[1], bounds2.y[1], bounds2.z[1]]];
};

var addPadding = function(bounds, pad){
    bounds.x[0]-=pad;
    bounds.y[0]-=pad;
    bounds.z[0]-=pad;
    bounds.x[1]+=pad;
    bounds.y[1]+=pad;
    bounds.z[1]+=pad;

    return bounds;
};

var clampBoundsToPt = function(bounds, pt){
    bounds.x[0]=Math.min(bounds.x[0], pt[0]);
    bounds.y[0]=Math.min(bounds.y[0], pt[1]);
    bounds.z[0]=Math.min(bounds.z[0], pt[2]);
    bounds.x[1]=Math.max(bounds.x[1], pt[0]);
    bounds.y[1]=Math.max(bounds.y[1], pt[1]);
    bounds.z[1]=Math.max(bounds.z[1], pt[2]);
    return bounds;
};

module.exports = getPointsetBoundsSector;