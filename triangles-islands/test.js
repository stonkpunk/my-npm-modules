
var ti = require('./index.js');

var ptsA = [
    [0,0,0],
    [0,0,1],
    [1,0,1],
    [1,0,0]
]

var ptsB = [
    [0,5,0],
    [0,5,1],
    [1,5,1],
    [1,5,0]
]

var tetrahedron_trianglesA = [
    [ptsA[0],ptsA[1],ptsA[2]],
    [ptsA[0],ptsA[1],ptsA[3]],
    [ptsA[0],ptsA[2],ptsA[3]],
    [ptsA[1],ptsA[2],ptsA[3]]
];

var tetrahedron_trianglesB = [
    [ptsB[0],ptsB[1],ptsB[2]],
    [ptsB[0],ptsB[1],ptsB[3]],
    [ptsB[0],ptsB[2],ptsB[3]],
    [ptsB[1],ptsB[2],ptsB[3]]
];

var mergedList = [].concat(tetrahedron_trianglesA, tetrahedron_trianglesB);

var islands = ti.trianglesBreakIntoIslands(mergedList);

console.log(islands);

//result:
// [
//     tetrahedron_trianglesA,
//     tetrahedron_trianglesB
// ]