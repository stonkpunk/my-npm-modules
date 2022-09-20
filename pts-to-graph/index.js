var nDel = require('./set-of-pts-neighbors-delaunay.js').setOfPtsNeighborsDelaunay;
var nOct = require('./set-of-pts-neighbors-octree.js').setOfPtsNeighbors;
var nRtree = require('./set-of-pts-neighbors-rtree.js').setOfPtsNeighbors;
var setOfPts2NGraph = require('./set-of-pts-to-graph.js').setOfPts2NGraph;
var meshToPtsWithNeighbors = require('./mesh-to-points-with-neighbors.js').mesh2PointsWithNeighbors;
var lines = require('./lines-to-set-of-pts-neighbors.js');
var linesToSetOfPtsNeighbors = lines.lines2PtsWithNeighbors;
var setOfPtsNeighborsToLines = lines.setOfPtsNeighbors2Lines;
var meshToLines = require('./mesh-to-lines.js').mesh2Lines;

module.exports = {
    meshToLines,
    linesToSetOfPtsNeighbors,
    setOfPtsNeighborsToLines,
    setOfPtsNeighborsDelaunay: nDel,
    setOfPtsNeighborsOctree: nOct,
    setOfPtsNeighborsRTree: nRtree,
    setOfPtsToNGraph: setOfPts2NGraph,
    meshToPtsWithNeighbors
}