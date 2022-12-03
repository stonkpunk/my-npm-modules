# triangle-distance

Highly optimized javascript distance function for triangles.

Measures the unsigned distance from a 3-D point to a triangle made from 3 3-D points.

Based off the GLSL distance function by [inigo quilez](https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm).

## Installation

```sh
npm i triangle-distance
```

## Usage

```javascript
var btd = require('triangle-distance');

var pointA = [0,0,0];
var pointB = [10,3,-5];
var pointC = [2,23,10];
var triangle = [pointA, pointB, pointC];

var samplingPoint = [10,10,10];

var distance = btd.triangleDistance(samplingPoint, pointA, pointB, pointC);
console.log(distance)
//8.973764262374749

var distance0 = btd.triangleDistance_arr(samplingPoint, triangle); //if you prefer to use an array
console.log(distance0)
//8.973764262374749 [same result]

var distanceSquared = btd.triangleDistanceSquared(samplingPoint, pointA, pointB, pointC);
console.log(distanceSquared)
//80.52844503667423

var distanceSquared0 = btd.triangleDistanceSquared_arr(samplingPoint, triangle);
console.log(distanceSquared0)
//80.52844503667423 [same result]
```
