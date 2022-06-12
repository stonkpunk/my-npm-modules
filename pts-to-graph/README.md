# pts-to-graph

generate nearest neighbors for a set of 3d points.

convert triangle mesh to graph.

convert set of 3d points into an `ngraph`.

## Installation

```sh
npm i pts-to-graph
```

## Usage - list of points 

```javascript
var listOfPts = [];

var nPts = 1000;
var size = 1024;

for(var i=0; i<nPts; i++){
    var pt = [Math.random()*size, Math.random()*size, Math.random()*size]
    listOfPts.push(pt);
}

var minimumDist = 200; //can either set minimumDist, or leave out the parameter and set pt[i].scale=distance to have each pt have a different neighbor radius
p2g.setOfPtsNeighborsOctree(listOfPts, minimumDist); //fast - get neighbors using octree data structure [npm yaot] - 20ms
//p2g.setOfPtsNeighborsRTree(listOfPts, minimumDist); //fast - get neighbors using rtree data structure [npm rbush-3d] - 31 ms
//p2g.setOfPtsNeighborsDelaunay(listOfPts); //very slow - get neighbors using delaunay triangulation - 2144 ms on m1 mac

//var myNGraph = p2g.setOfPtsToNGraph(listOfPts); //convert points with neighbors into ngraph graph

//results
//listOfPts[0].neighbors -- array of points nearby [by reference]
//listOfPts.octree -- octree from require('yaot')
//listOfPts.rtree -- rtree from require('rbush-3d')
```

## Usage - triangle mesh

```javascript
var p2g = require('pts-to-graph');
var mesh = require('bunny');
var result = p2g.meshToPtsAndNGraph(mesh);
console.log(result);

// {
//     pts: [
//         [ 1.301895, 0.122622, 2.550061, neighbors: [Array], i: '0' ],
//         [ 1.045326, 0.139058, 2.835156, neighbors: [Array], i: '1' ],
//         [ 0.569251, 0.155925, 2.805125, neighbors: [Array], i: '2' ],
//         ... ]
//     ngraph: [ngraph object]
// }

```

## See Also

- [yaot](https://www.npmjs.com/package/yaot) 
- [rbush-3d](https://www.npmjs.com/package/rbush-3d) 
- [ngraph](https://www.npmjs.com/package/ngraph.graph)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



