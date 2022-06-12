/**

### `heading(vec, other)`

Mutliplies the vector `vec` by a `scalar` value:

``` javascript
var heading = require('vectors/heading')(2)
var a = [5, 0]
var b = [0, 5]

heading(a, b) * 180 / Math.PI === 45 // degrees
```

**/

module.exports = generator

function generator(dims) {
  dims = +dims|0

  if (dims !== 2) throw new Error(
    '`vectors.heading` only works in 2 dimensions'
  )

  return function heading(vec, other) {
    return Math.atan2(vec[1] - other[1], vec[0] - other[0])
  }
}
