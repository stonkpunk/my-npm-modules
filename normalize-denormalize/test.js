var {normalize, denormalize} = require('./index.js');
var testArr = [[0,0,0],[1,1,1],[2,2,2]];
var testObjs = [{x:0,y:0,z:0},{x:1,y:1,z:1},{x:2,y:2,z:2}];

console.log({
    arr: testArr,
    normArr: normalize(testArr), //{data, minValues, maxValues} //.data is the normalized result ; minValues[i] and maxValues[i] gives the range of the ith dimension
    denormArr: denormalize(normalize(testArr)),
    objs: testObjs,
    normObjs: normalize(testObjs),
    denormObjs: denormalize(normalize(testObjs))
})

// {
//         arr: [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 2, 2, 2 ] ],
//         normArr: {
//              data: [ [ 0, 0, 0 ], [ 0.5, 0.5, 0.5 ], [ 1, 1, 1 ] ],
//              minValues: [ 0, 0, 0 ],
//              maxValues: [ 2, 2, 2 ]
//         },
//         denormArr: [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 2, 2, 2 ] ],
//         objs: [ { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 } ],
//         normObjs: {
//              data: [
//                  { x: 0, y: 0, z: 0 },
//                  { x: 0.5, y: 0.5, z: 0.5 },
//                  { x: 1, y: 1, z: 1 }
//              ],
//              minValues: [ 0, 0, 0 ],
//              maxValues: [ 2, 2, 2 ]
//         },
//         denormObjs: [ { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 } ]
// }
