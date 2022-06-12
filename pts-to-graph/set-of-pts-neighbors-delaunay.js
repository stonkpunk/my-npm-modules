var triangulate = require("delaunay-triangulate")
function setOfPtsNeighborsDelaunay(volumetricPts){ //todo add 2d version ...
    var delRes = triangulate(volumetricPts);
    var neighborMap = {};
    delRes.forEach(function(cell){
        for(var i=0; i<cell.length; i++){
            var thisOne = cell[i];
            var nextOne = cell[(i+1)%cell.length];
            var nLo = Math.min(thisOne,nextOne);
            var nHi = Math.max(thisOne,nextOne);
            var nHash = nLo+"_"+nHi;
            if(!neighborMap[nHash]){
                neighborMap[nHash]=true;
                volumetricPts[nLo].neighbors = volumetricPts[nLo].neighbors || [];
                volumetricPts[nHi].neighbors = volumetricPts[nHi].neighbors || [];
                volumetricPts[nLo].neighbors.push(volumetricPts[nHi]);
                volumetricPts[nHi].neighbors.push(volumetricPts[nLo]);
            }
        }
    });
    return volumetricPts;
}

module.exports = {setOfPtsNeighborsDelaunay}
