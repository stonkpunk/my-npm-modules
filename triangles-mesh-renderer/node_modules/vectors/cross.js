/**

### `cross(vec, other)`

Returns the cross product of vectors `vec` and `other`:

``` javascript
var cross = require('vectors/cross')(2)
var a = [1, 2]
var b = [8, 4]

cross(a, b) === -12
```

This method only works in 2 and 3 dimensions.

**/

module.exports = function generator(dims) {
  dims = +dims|0
  if (dims === 2) return cross2
  if (dims === 3) return cross3
  throw new Error('cross product only supported for 2 and 3 dimensions')
}

function cross2(vec, other) {
  return (
    vec[0] * other[1] -
    vec[1] * other[0]
  )
}

function cross3(vec, other) {
  return [
    (vec[1] * other[2]) - (vec[2] * other[1]),
    (vec[2] * other[0]) - (vec[0] * other[2]),
    (vec[0] * other[1]) - (vec[1] * other[0])
  ]
}
