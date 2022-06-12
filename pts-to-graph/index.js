var nDel = require('./set-of-pts-neighbors-delaunay.js').setOfPtsNeighborsDelaunay;
var nOct = require('./set-of-pts-neighbors-octree.js').setOfPtsNeighbors;
var nRtree = require('./set-of-pts-neighbors-rtree.js').setOfPtsNeighbors;
var setOfPts2NGraph = require('./set-of-pts-to-graph.js').setOfPts2NGraph;
var meshToPtsAndNGraph = require('./mesh-to-graph.js').mesh2Graph;

module.exports = {
    setOfPtsNeighborsDelaunay: nDel,
    setOfPtsNeighborsOctree: nOct,
    setOfPtsNeighborsRTree: nRtree,
    setOfPtsToNGraph: setOfPts2NGraph,
    meshToPtsAndNGraph
}