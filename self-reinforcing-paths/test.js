var testMesh = require('bunny');
var sp = require('./index.js');

var totalPaths = 10000;
var t0=Date.now();
for(var i=0; i<totalPaths; i++){
    var srcId = Math.floor(Math.random()*testMesh.positions.length)
    var targetId = Math.floor(Math.random()*testMesh.positions.length)

    //var opts = {noContrib:false, dfLine:lineLength_withFootsteps, incFunc: incrementPtFootsteps};
    var shortestPath = sp.meshShortestPath(testMesh,srcId,targetId) //,opts)
    console.log(shortestPath);

    //list of pt indices representing the shortest path
    // [
    //     1409, 1417, 1407, 1117,
    //     1445, 1501, 1104, 1328,
    //     137,  806,  634, 1108,
    //     874, 1116, 1739, 1734,
    //     1089
    // ]
}
console.log(`${totalPaths} paths took ${(Date.now()-t0)} ms -- ${Math.floor(totalPaths/(Date.now()-t0))} per ms`);

//m1 mac - 10000 paths took 2198 ms -- 4 per ms