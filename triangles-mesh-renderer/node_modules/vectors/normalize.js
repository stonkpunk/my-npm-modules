/**

### `normalize(vec, scalar)`

Normalizes the vector (i.e. scales it to make its
distance 1 unit).

``` javascript
var normalize = require('vectors/normalize')(2)

normalize([3, 0])  === [1, 0]
normalize([4, 3])  === [0.8, 0.6]
```

**/

module.exports = generator

function generator(dims) {
  dims = +dims|0

  var body = []

  body.push('return function normalize'+dims+'(vec, scalar) {')
    var els = []
    for (var i = 0; i < dims; i += 1) {
      els.push('vec['+i+']*vec['+i+']')
    }
    body.push('var mag = Math.sqrt(' + els.join('+') + ')')

    body.push('if (mag === 0) {')
      for (var i = 0; i < dims; i += 1) {
        body.push('vec['+i+'] = 0')
      }
    body.push('} else {')
      for (var i = 0; i < dims; i += 1) {
        body.push('vec['+i+'] /= mag')
      }
    body.push('}')
    body.push('return vec')

  body.push('}')

  return Function(body.join('\n'))()
}
