
function generatePts(nPts=100000){
    var res = [];
    var s = 5.0;
    for(var i=0;i<nPts;i++){
        res.push(
                {x:Math.random()*s-s/2,
                y: Math.random()*s-s/2,
                z: Math.random()*s-s/2}
        )
    }
    return res;
}

var {KDTree} = require('./kd-tree-simple.js');
var createKDTreeStatic = require("static-kdtree")

var {kNearestNeighbors} = require('./k-nearest-naive.js');

const kdTree = new KDTree();

var pts = generatePts();
var _pts = pts.map(pt=>[pt.x,pt.y,pt.z]);

var nRepsForBench = 100;
var ptsSample = generatePts(nRepsForBench);
var _ptsSample = ptsSample.map(pt=>[pt.x,pt.y,pt.z]);
pts.forEach(function(pt){
    kdTree.add(pt);
});

var nToGet = 2;
var kdTreeStatic = createKDTreeStatic(_pts);

var time0 = Date.now();
_ptsSample.forEach(function(p){
    var res = kNearestNeighbors(_pts,[0,0,0],nToGet);
});
var kNearestNaive = kNearestNeighbors(_pts,[0,0,0],13).map(_pt=>({x:_pt[0],y:_pt[1],z:_pt[2]}))[12];
var timekkNearestNaive = Date.now()-time0;

time0 = Date.now();
_ptsSample.forEach(function(p){
    var res = kNearestStatic = kdTreeStatic.knn(p, nToGet)
});
var kNearestStatic = kdTreeStatic.knn([0,0,0], 13).map(index=>pts[index])[12]
var timekNearestStatic = Date.now()-time0;

time0 = Date.now();
ptsSample.forEach(function(p){
    var res = kdTree.kNearestNeighbors(nToGet,p)
});
var kNearestSimple = kdTree.kNearestNeighbors(13,{x: 0, y: 0, z:0})[12]
var timekNearestSimple = Date.now()-time0;

console.log({kNearestStatic, kNearestNaive, kNearestSimple});
console.log({timekNearestStatic, timekkNearestNaive, timekNearestSimple})

// {
//     kNearestStatic: {
//         x: 0.025766855468448924,
//         y: 0.14882863816034675,
//         z: -0.05697281134201759
//     },
//     kNearestNaive: {
//         x: 0.025766855468448924,
//         y: 0.14882863816034675,
//         z: -0.05697281134201759
//     },
//     kNearestSimple: {
//         x: 0.025766855468448924,
//         y: 0.14882863816034675,
//         z: -0.05697281134201759
//     }
// }
// {
//     timekNearestStatic: 14,
//     timekkNearestNaive: 3997,
//     timekNearestSimple: 7
// }


