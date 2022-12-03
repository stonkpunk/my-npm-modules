point-in-big-polygon
====================
Industrial scale point-in-polygon test. Given a polygon, this module preprocesses it in O(n log(n)) time such that any point can be classified against the polygon in O(log(n)) operations. All computations are performed in exact arithmetic.

If you want to use multiple polygons/regions, you should use [point-in-region](https://github.com/mikolalysenko/point-in-region) instead.

# Example

```javascript
var preprocessPolygon = require("point-in-big-polygon")
var classifyPoint = preprocessPolygon([
  [ [-10, -10], [-10, 10], [10, 10], [10, -10] ],
  [ [-1, -1], [1, -1], [1, 1], [-1, 1] ]
])

console.log(classifyPoint([0, 0]))
console.log(classifyPoint([5, 2]))
console.log(classifyPoint([1, 0]))
```

# Install

```
npm install point-in-big-polygon
```

# API

## Constructor

### `var classifyPoint = require("point-in-big-polygon")(loops[,clockwise])`
Preprocess a polygon given by a collection of oriented loops to handle point membership queries.

* `loops` are a collection of oriented loops representing the boundary of the polygon. These loops must be manifold (ie no self intersections or dangling edges).
* `clockwise` is an optional parameter, which if set changes the sign of the classification function.

**Returns** A point membership function that can be used to classify points relative to the function

## Method

### `classifyPoint(p)`
This function is the result of running the preprocessing operation on a polygon. It takes a single point as input and tests it against the boundary.

* `p` is a point encoded as a length 2 array

**Returns** A signed floating point value which classifies `p` relative to the boundary

* `<0` means that `p` is outside
* `=0` means that `p` is on the boundary
* `>0` means that `p` is inside

# Credits
(c) 2014 Mikola Lysenko. MIT License