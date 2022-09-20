var sopShortestPath = require('./shortest-path.js').setOfPointsShortestPath;
var pts2Graph = require('pts-to-graph');

var meshShortestPath = function(mesh, src, target, opts){
    var meshPts = pts2Graph.meshToPtsWithNeighbors(mesh);
    mesh.sop_graph = pts2Graph.setOfPtsToNGraph(meshPts); //.pts [sop], .ngraph [ngraph]
    meshPts.ngraph = mesh.sop_graph
    return sopShortestPath(meshPts, src, target, opts)
}

module.exports = {
    pts2Graph,
    meshShortestPath,
    setOfPtsShortestPath: setOfPointsShortestPath
}