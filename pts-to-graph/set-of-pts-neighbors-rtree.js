function pt2RTreeObj(pt,_rad){
    var rad = _rad || 1.0;
    const item = {
        minX: pt[0]-rad,
        minY: pt[1]-rad,
        minZ: pt[2]-rad,
        maxX: pt[0]+rad,
        maxY: pt[1]+rad,
        maxZ: pt[2]+rad,
        pt: pt
    };
    return item;
}

var RTREE = require('rbush-3d');

function getPointNeighborsRBush(pts, minDist){ //use minDist for min neighbor distance, or set pt[i].scale for each pt
    var tree = new RTREE.RBush3D(2);
    tree.load(pts.map(function(pt,i){return pt2RTreeObj(pt, minDist || pt[i].scale);}));
    return pts.map(function(pt,i){
        var neighborsAll = tree.search(pt2RTreeObj(pt,minDist || pt[i].scale)).map(box => box.pt);
        pt.neighbors = neighborsAll.filter(n=>n!=pt);
        return pt;
    })
    pts.rtree = tree;
}

module.exports = {setOfPtsNeighbors: getPointNeighborsRBush}