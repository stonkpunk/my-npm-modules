var createTree = require('yaot');
function setOfPtsNeighborsFast(sop, _minDist){ //use _minDist for min neighbor distance, or set pt[i].scale for each pt
    var tree = createTree();
    var ptList = [];

    sop.forEach(function(p){
        ptList.push(p[0]);
        ptList.push(p[1]);
        ptList.push(p[2]);
    });

    tree.init(ptList); //build tree w pts

    sop.forEach(function(p,i){
        var ptIdsNearby = tree.intersectSphere(p[0], p[1], p[2], _minDist || p[i].scale); //<-- matches is list of ids of pts

        var ptsNearby = ptIdsNearby.map(function(ptId3){
            var ptId = Math.floor(ptId3/3);
            return sop[ptId];
        });

        p.neighbors = ptsNearby.filter(pt=>pt!=p);
    });

    sop.octree = tree;

    return tree;
}

module.exports = {setOfPtsNeighbors: setOfPtsNeighborsFast};