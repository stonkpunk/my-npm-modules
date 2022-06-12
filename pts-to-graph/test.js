var listOfPts = [];

var nPts = 1000;
var size = 1024;

for(var i=0; i<nPts; i++){
    var pt = [Math.random()*size, Math.random()*size, Math.random()*size]
    listOfPts.push(pt);
}

var p2g = require('./index.js');

var t0=Date.now();

var minimumDist = 200; //can either set minimumDist, or leave out the parameter and set pt[i].scale=distance to have each pt have a different neighbor radius
p2g.setOfPtsNeighborsOctree(listOfPts, minimumDist); //fast - get neighbors using octree data structure [npm yaot] - 20ms
//p2g.setOfPtsNeighborsRTree(listOfPts, minimumDist); //fast - get neighbors using rtree data structure [npm rbush-3d] - 31 ms
//p2g.setOfPtsNeighborsDelaunay(listOfPts); //very slow - get neighbors using delaunay triangulation - 2144 ms on m1 mac
console.log(Date.now()-t0);

//var myNGraph = p2g.setOfPtsToNGraph(listOfPts); //convert points with neighbors into ngraph graph

//results
//listOfPts[0].neighbors -- array of points nearby [by reference]
//listOfPts.octree -- octree from require('yaot')
//listOfPts.rtree -- rtree from require('rbush-3d')
