# triangle-random-pts

generates uniformly distributed random points in a 3d triangle

generated points can either be random (via Math.random) or quasi-random using [Martin Robert's R<sub>2</sub> sequence](http://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/) 

## Installation

```sh
npm i triangle-random-pts
```

## Usage 

```javascript
var trp = require('triangle-random-pts');

//triangle is 3 pts [x,y,z]
var triangle = [[0,0,1],[1,0,1],[1,1,1]];

var numberOfPoints = 10;
var pointsRandom = trp.randomPointsInTriangle(triangle,numberOfPoints);
var pointsQuasiRandom = trp.quasiRandomPointsInTriangle(triangle,numberOfPoints);

console.log(pointsRandom);
console.log(pointsQuasiRandom);

// [
//   [ 0.7376911169860783, 0.22520037602543863, 1 ],
//   [ 0.9048772043066953, 0.7938595566407141, 1 ],
//   [ 0.9959244703763193, 0.04587410814750026, 1 ],
//   [ 0.5900273794284896, 0.20986370732332826, 1 ],
//   [ 0.10363579688143387, 0.10175318618649176, 1 ],
// ...
// [
//   [ 0.7451223337533073, 0.6752820427552539, 1 ],
//   [ 0.9902446675066146, 0.3505640855105081, 1 ],
//   [ 0.23536700125992205, 0.02584612826576249, 1 ],
//   [ 0.5195106649867709, 0.2988718289789838, 1 ],
//   [ 0.7256116687665362, 0.37641021377626993, 1 ],
// ...

```

## See Also

- [triangle-triangle-intersection](https://www.npmjs.com/package/triangle-triangle-intersection) - intersection between 2 triangles
- [triangle-distance](https://www.npmjs.com/package/triangle-distance) - distance to triangle
- [triangle-area-fast](https://www.npmjs.com/package/triangle-area-fast) - triangle area via cross-product



