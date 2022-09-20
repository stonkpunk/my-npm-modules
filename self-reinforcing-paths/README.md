# self-reinforcing-paths

shortest paths that become 'more popular' with repeated use.

allows simulating phenomena analogous to:

- a trail in a forest that gets wider with more traffic
- ants leaving pheromones as they travel
- growth of plants, roots, mold, fungus
- growth of transportation/plumping/electrical networks

## Installation

```sh
npm i self-reinforcing-paths
```

## Usage 

```javascript
var testMesh = require('bunny');

var serp = require('self-reinforcing-paths');

var srcId = Math.floor(Math.random()*testMesh.positions.length)
var targetId = Math.floor(Math.random()*testMesh.positions.length)

//var opts = {noContrib:false, dfLine:lineLength_withFootsteps, incFunc: incrementPtFootsteps};
var shortestPath = serp.meshShortestPath(testMesh,srcId,targetId) //,opts)
console.log(shortestPath);

//list of vertex indices representing the shortest path
// [
//     1409, 1417, 1407, 1117,
//     1445, 1501, 1104, 1328,
//     137,  806,  634, 1108,
//     874, 1116, 1739, 1734,
//     1089
// ]

//each point along the path has a "footsteps" field that accumulates how many times it has
//been visited by the shortest path algo

//as a point gets more "footsteps" it becomes "wider" [by decreasing the length of connected segments in the graph used by the shortest paths algo]
//therefore making it more likely to get visited in the future

//use opts.noContrib=true to skip the footstep incrementing [get shortest path without "widening" it]

//override opts.lineLength_withFootsteps to specify custom "path-widening" behavior.
//default: 
// function lineLength_withFootsteps(line){ 
//     //line is array of 2 pts
//     return lineLength(line)/((line[0].footsteps||1.0) + (line[1].footsteps||1.0))/2.0;
// }

//override opts.incFunc to change the footstep-paremeter-incrementing behavior 
//default:
// function incrementPtFootsteps(pt, nextPt?){ 
//     //can optionally use nextPt to do logic based on edges etc
//     pt.footsteps=pt.footsteps?pt.footsteps+1:1;
// }

//alternative - using points with .neighbors instead of mesh

//use serp.setOfPtsShortestPath(setOfPts, src, target, opts)
//generate the setOfPts using npm pts-to-graph [see below]
```
## See Also

- [pts-to-graph](https://www.npmjs.com/package/pts-to-graph) - convert sets of 3d points into graph structures
- [Mycelium](https://en.wikipedia.org/wiki/Mycelium)

<br><br>
[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



