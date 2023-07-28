// quick rundown:

// var {KDTree} = require('./kd-tree-simple.js');
// const kdTree = new KDTree();
// kdTree.add(myObj); //obj can be arbitrary
// kdTree.kNearestNeighbors(k, queryObj, distanceFunc=kdTree.distanceEuclidean, addDistanceField=true) //or kdTree.distanceMSE
// var neighboringObjs = kdTree.kNearestNeighbors(2, {x:0, y:0, z:0});

//bigger rundown:

//function to generate random pts {x,y,z} -- note the kdtree can take objects with arbitrary fields
function generatePts(nPts=1000){
    var res = [];
    var s = 5.0;
    for(var i=0; i<nPts; i++){
        res.push(
            {
                x: Math.random()*s-s/2,
                y: Math.random()*s-s/2,
                z: Math.random()*s-s/2
            }
        )
    }
    return res;
}

var {KDTree} = require('./kd-tree-simple.js');
const kdTree = new KDTree();

var pts = generatePts();
pts.forEach(function(pt){
    kdTree.add(pt);
});

var k = 10; //number of nearest neighbors to get
var doAddDistanceField = true; //add .distance to results
var kNearestNeighbors = kdTree.kNearestNeighbors(k,{x: 0, y: 0, z:0}, kdTree.distanceEuclidean, doAddDistanceField);
console.log(kNearestNeighbors[0]);
// {
//     x: 0.012055808991457084,
//     y: 0.08365982534562777,
//     z: 0.12121469453873823,
//     distance: 0.14777452784366815
// }

//notice how if we leave out a field / dimension, it is ignored by the distance function
//we do not need to set a default value, it is as if the field is ignored
var kNearestNeighbors2 = kdTree.kNearestNeighbors(10,{x: 0, y: 0}, kdTree.distanceEuclidean, doAddDistanceField);
console.log(kNearestNeighbors2[0]);
// {
//     x: -0.13236073516600477,
//     y: 0.026111540644320197,
//     z: -0.6416465917338776,
//     distance: 0.13491173695607525 // <<< notice how this distance no longer includes the contribution of the z coordinate
// }

//we can also use kdTree.distanceMSE
