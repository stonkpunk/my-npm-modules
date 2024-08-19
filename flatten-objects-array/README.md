# flatten-objects-array

automatically flatten a list of similar objects into a flat array (or array of arrays)... 

then un-flatten the result back into the original objects' format again.

can also convert arbitrary objects arrays to csv with `objectsArrayToCSV`

and can also interpolate between arbitrary [numerical] objects with `objectsInterpolate`

## Installation

```sh
npm i flatten-objects-array
```

## Usage 

```javascript
var {
    loadObjectsFromArrayOfArrays,
    loadObjectsIntoArrayOfArrays,
    loadObjectsIntoIntArray,
    loadObjectsIntoFloatArray,
    loadObjectsIntoArray,
    loadObjectsFromArray,
    getObjectFieldsList,
    objectsArrayToCSV,
    objectsInterpolate
    // getValueFromPath, //these are used internally but exposed for convenience
    // getTypeFromPath,
    // getType,
    // setFieldValue,
    // buildObjectFromFields
} = require('flatten-objects-array');

//the first object in the list serves as the template!
//notice how the 2nd object has data missing.
var objects = [{
    color: [0,1,3],
    stuff: {
        my_matrix: [[1,2],[4,5]]
    },
    height: 53,
},
{
    color: [77,123,32],
    stuff: {
        my_matrix: [[1,1],null] //malformed example
    },
    height: "not-a-number"
}];

//note -- objects with only numeric fields get replaced by arrays!
// {
//     obj: {0: 1} //<-- this will be converted into an array
// }

var fields = getObjectFieldsList(objects[0]); //optionally get list of fields like "field.subfield.etc"
var arrFlatFloat = loadObjectsIntoFloatArray(objects, fields); //load objs into float32 array [fields optional, auto-detected]
var arrFlatInt = loadObjectsIntoIntArray(objects, fields); //load objs into int32 array [fields optional, auto-detected]
var arrFlatUntyped = loadObjectsIntoArray(objects, fields); //load objs into untyped array [fields optional, auto-detected]
var arrPerObj = loadObjectsIntoArrayOfArrays(objects, fields); //retrieve a simple array per-object [fields optional, auto-detected]
var objsAgainFromArrFlatFloat = loadObjectsFromArray(arrFlatFloat, fields); //expand back into objects [fields required]
var objsAgainFromArrFlatUntyped = loadObjectsFromArray(arrFlatUntyped, fields); //expand back into objects [fields required]
var objsAgainFromArrOfArrs = loadObjectsFromArrayOfArrays(arrPerObj, fields); //expand back into objects [fields required]

console.log({ fields, arrFlatFloat, arrPerObj, objsAgainFromArrFlatFloat, objsAgainFromArrFlatUntyped, objsAgainFromArrOfArrs});

//notice how using typed arrays replaces non-numeric information with NaN.
//eg, if you want to preserve non-numeric data, do not use typed arrays

// {
//     fields: [
//         'color.0',
//         'color.1',
//         'color.2',
//         'stuff.my_matrix.0.0',
//         'stuff.my_matrix.0.1',
//         'stuff.my_matrix.1.0',
//         'stuff.my_matrix.1.1',
//         'height'
//     ],
//     arrFlatFloat: Float32Array(16) [
//         0,   1,   3,   1,  2, 4,
//         5,  53,  77, 123, 32, 1,
//         1, NaN, NaN, NaN
//     ],
//     arrPerObj: [
//         [0, 1, 3,  1, 2, 4, 5, 53],
//         [ 77, 123, 32, 1, 1, undefined, undefined, 'not-a-number' ]
//     ],
//     objsAgainFromArrFlatFloat: [
//         { color: [Array], stuff: [Object], height: 53 },
//         { color: [Array], stuff: [Object], height: NaN }
//     ],
//     objsAgainFromArrFlatUntyped: [
//         { color: [Array], stuff: [Object], height: 53 },
//         { color: [Array], stuff: [Object], height: 'not-a-number' }
//     ],
//     objsAgainFromArrOfArrs: [
//         { color: [Array], stuff: [Object], height: 53 },
//         { color: [Array], stuff: [Object], height: 'not-a-number' }
//     ]
// }

console.log(objsAgainFromArrFlatFloat[0].stuff.my_matrix)
//    [ [ 1, 2 ], [ 3, 4 ] ]
console.log(objsAgainFromArrFlatFloat[1].stuff.my_matrix)
//    [ [ 1, 1 ], [ NaN, NaN ] ]

var sep = ','; //default
var newline = '\n'; //default
//convert to csv string
console.log(objectsArrayToCSV(objects, sep, newline));
// color.0,color.1,color.2,stuff.my_matrix.0.0,stuff.my_matrix.0.1,stuff.my_matrix.1.0,stuff.my_matrix.1.1,height
// 0,1,3,1,2,4,5,53
// 77,123,32,1,1,,,not-a-number

//note the header is made from fields of first object 

//linear interpolation between arbitrary objects with numerical fields [non numerical fields will cause an err]
var objA= {r:0,g:0,b:0, coords: {u:0,v:0}}
var objB= {r:255,g:255,b:255, coords: {u:1,v:1}}

console.log(objectsInterpolate(objA,objB,0.5));
//{ r: 127.5, g: 127.5, b: 127.5, coords: { u: 0.5, v: 0.5 } }
```

## See Also

There are several similar libraries achieving slightly different goals

- [struct](https://www.npmjs.com/package/struct) - structs like from C
- [flatten-unflatten](https://www.npmjs.com/package/flatten-unflatten) - flatten object field names
- [flatten](https://www.npmjs.com/package/flatten) - for flattening arrays
- [flatten-objects](https://www.npmjs.com/package/flatten-objects) - for creating multiples of objects
- [normalize-denormalize](https://www.npmjs.com/package/normalize-denormalize) - normalize-denormalize lists of  n-dimensional points/objects

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



