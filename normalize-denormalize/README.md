# normalize-denormalize

normalize a list of n-dimensional points, or a list of simple objects with numeric fields, to ensure a 0...1 range for each dimension, with `normalize`

then de-normalize the result back into the original data again with `denormalize`

## Installation

```sh
npm i normalize-denormalize
```

## Usage 

```javascript
var {normalize, denormalize} = require('normalize-denormalize');
var testArr = [[0,0,0],[1,1,1],[2,2,2]]; //example using array
var testObjs = [{x:0,y:0,z:0},{x:1,y:1,z:1},{x:2,y:2,z:2}]; //example using simple objects with fields [simple objects only -- nested objects/fields etc will not work]

console.log({
    
    arr: testArr,
    normArr: normalize(testArr), //{data, minValues, maxValues} //.data is the normalized result ; minValues[i] and maxValues[i] gives the range of the ith dimension
    denormArr: denormalize(normalize(testArr)),
    
    objs: testObjs,
    normObjs: normalize(testObjs),
    denormObjs: denormalize(normalize(testObjs))
    
})

// {
//         arr: [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 2, 2, 2 ] ], //original array 
//         normArr: {
//              data: [ [ 0, 0, 0 ], [ 0.5, 0.5, 0.5 ], [ 1, 1, 1 ] ], //normalized array 
//              minValues: [ 0, 0, 0 ],
//              maxValues: [ 2, 2, 2 ]
//         },
//         denormArr: [ [ 0, 0, 0 ], [ 1, 1, 1 ], [ 2, 2, 2 ] ], //back to original array 
//
//         objs: [ { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 } ], //original objs 
//         normObjs: {
//              data: [                          //normalized objects 
//                  { x: 0, y: 0, z: 0 },
//                  { x: 0.5, y: 0.5, z: 0.5 },
//                  { x: 1, y: 1, z: 1 }
//              ],
//              minValues: [ 0, 0, 0 ],
//              maxValues: [ 2, 2, 2 ]
//         },
//         denormObjs: [ { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1 }, { x: 2, y: 2, z: 2 } ] //back to original objects
// }
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



