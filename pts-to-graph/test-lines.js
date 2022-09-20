var a = [0,0,0];
var b = [0,0,1];
var c = [0,1,1];
var d = [0,1,0];

var lines = [
    [a,b],
    [b,c],
    [c,d],
    [d,a]
]

//also works with raw coords:
// var lines = [
//     [[0,0,0],[0,0,1]],
//     [[0,0,1],[0,1,1]],
//     [[0,1,1],[0,1,0]],
//     [[0,1,0],[0,0,0]]
// ]

var p2g = require('./index.js')
var ptsWithNeighbors = p2g.linesToSetOfPtsNeighbors(lines);

console.log(ptsWithNeighbors);
// [
//     [ 0, 0, 0, neighbors: [ [Array], [Array] ], i: '0' ],
//     [ 0, 0, 1, neighbors: [ [Array], [Array] ], i: '1' ],
//     [ 0, 1, 1, neighbors: [ [Array], [Array] ], i: '2' ],
//     [ 0, 1, 0, neighbors: [ [Array], [Array] ], i: '3' ]
// ]

var lines2 = p2g.setOfPtsNeighborsToLines(ptsWithNeighbors);

//console.log(lines2);
// a list of line segments, made from the same points [note how they still have neighbors added]
// [
//     [
//         [ 0, 0, 0, neighbors: [Array], i: '0' ],
//         [ 0, 0, 1, neighbors: [Array], i: '1' ]
//     ],
//     [...

var mesh = require('bunny');
var lines3 = p2g.meshToLines(mesh);
console.log(lines3);
