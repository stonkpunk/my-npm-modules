# triangle-area-fast

quickly get the area of a 3d triangle (using cross-product)

## Installation

```sh
npm i triangle-area-fast
```

## Usage 

```javascript
var taf = require('triangle-area-fast');

//triangle is 3 pts [x,y,z]
var triangle = [[0,0,1],[1,0,1],[1,1,1]];

var area = taf(triangle);

console.log(area);

//returns area of triangle:
//0.5

```

## See Also

- [triangle-triangle-intersection](https://www.npmjs.com/package/triangle-triangle-intersection) - intersection between 2 triangles
- [triangle-distance](https://www.npmjs.com/package/triangle-distance) - distance to triangle



