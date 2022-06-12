/**

### `dot(vec, other)`

Returns the dot product of vectors `vec` and `other`:

``` javascript
var dot = require('vectors/dot')(2)
var vecA = [15, 5]
var vecB = [10, 8]

dot(vecA, vecB) === 190
```

**/

function generator(dims) {
  dims = +dims|0

  var body = []

  body.push('return function(vec, other) {')
    var els = []
    for (var i = 0; i < dims; i += 1) {
      els.push('vec[' + i + ']*other[' + i + ']')
    }
    body.push('return ' + els.join(' + '))
  body.push('}')

  return Function(body.join('\n'))()
}

module.exports = generator
