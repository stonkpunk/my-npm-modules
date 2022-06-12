/**

### `limit(vec, scalar)`

Limits the vector `vec` to a magnitude of `scalar` units.

``` javascript
var limit = require('vectors/limit')(2)

limit([3, 0], 2)  === [2, 0]
limit([3, 4], 1)  === [0.6, 0.8]
limit([5, 5], 24) === [5, 5]
```

**/

module.exports = generator

function generator(dims) {
  dims = +dims|0

  var body = []

  body.push('return function limit' + dims + '(vec, scalar) {')
    var mag = []
    for (var i = 0; i < dims; i += 1) {
      mag.push('vec[' + i + '] * vec[' + i + ']')
    }
    body.push('var mag = ' + mag.join('+'))

    body.push('if (mag > scalar*scalar) {')
      body.push('mag = Math.sqrt(mag)')
      for (var i = 0; i < dims; i += 1) {
        body.push('vec[' + i + '] = vec[' + i + '] * scalar / mag')
      }
    body.push('}')
    body.push('return vec')
  body.push('}')

  return Function(body.join('\n'))()
}
