# sdf-polygon-2d

sample the signed distance field of a polygon in 2d space

## install

`npm install sdf-polygon-2d`

## use

```
var createSDF = require('sdf-polygon-2d');
var points = [
  [-10, -10],
  [-10,  10],
  [ 10,  10],
  [ 10, -10]
];

// pass an array of polygons, including polygons with holes
var sample = createSDF([points]);
console.log(sample(0, 0)) // -10
console.log(sample({ x: 10, y: 0 })) // 0
console.log(sample([20, 0])) // 10
```

more examples in [test.js](test.js)

## license

[MIT](LICENSE.txt)
