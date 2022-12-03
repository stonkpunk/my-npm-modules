var lca = require('./index.js');

var lineA = [[0,0,0],[9,9,9]];
var lineB = [[9,0,9],[9,0,0]];
var doClamp = true; //if false, lines are treated as infinite length, t values can be outside 0...1
var res = lca(lineA, lineB, doClamp);

console.log(res);

// [ [ 4.5, 4.5, 4.5 ], [ 9, 0, 4.5 ], 0.5, 0.5 ]
//res = [lineStartPt, lineEndPt, tParamForLineA, tParamForLineB]

//eg result is:
//
//res = [
//         getPointAlongLine(lineA, t0), //starting pt for closest-approach result line
//         getPointAlongLine(lineB, t1), //ending pt for closest-approach result line
//         t0,
//         t1
//     ];


