var floatArray2Str = require('./index.js');

//note - array will be cast to a Float32Array if is not already typed

var myFloats = [0.00001,2.123123213,3.14159265] ;

var str = floatArray2Str.encodeFloatArr(myFloats);

console.log(str);

//acc5273740e10740db0f4940

console.log(floatArray2Str.decodeFloatArr(str));

// Float32Array(3) [
//     0.000009999999747378752,
//         2.1231231689453125,
//         3.1415927410125732
//     ]
