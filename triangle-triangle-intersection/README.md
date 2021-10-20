# triangle-triangle-intersection

Check if two triangles intersect. 

If they intersect, returns the line segment of their intersection.

If not, returns null.

Based on [Thomas Möller's algorithm](http://web.stanford.edu/class/cs277/resources/papers/Moller1997b.pdf)

## Installation

```sh
npm i triangle-triangle-intersection
```

## Usage 

```javascript

var tti = require('triangle-triangle-intersection');

//each triangle is 3 pts [x,y,z]
var triangle1 = [[0,0,0],[1,0,0],[1,1,0]];
var triangle2 = [[0,0,1],[1,0,1],[1,1,-1]];

var intersection = tti(triangle1,triangle2);

console.log(intersection);

//returns line segment of intersection:
//[ [ 1, 0.5, 0 ], [ 0.5, 0.5, 0 ] ]

```

## See Also

- [triangle-distance](https://www.npmjs.com/package/triangle-distance) - distance to triangle



