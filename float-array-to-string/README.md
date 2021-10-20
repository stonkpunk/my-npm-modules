# float-array-to-string

convert/encode a float array to a hex string and back again.

based on a stackoverflow [post](https://stackoverflow.com/questions/55533020/efficient-encoding-for-float-constants-in-javascript).

## Installation

```sh
npm i float-array-to-string
```

## Usage 

```javascript
var floatArray2Str = require('float-array-to-string');

var myFloats = [0.00001,2.123123213,3.14159265] ;

//note - encoder will cast array to a Float32Array if it is not already

var str = floatArray2Str.encodeFloatArr(myFloats);

console.log(str);

//acc5273740e10740db0f4940

console.log(floatArray2Str.decodeFloatArr(str));

// Float32Array(3) [
//         0.000009999999747378752, //notice the small error
//         2.1231231689453125,
//         3.1415927410125732
//     ]
```

