/**

### `dist(vec, other)`

Returns the distance between vectors `vec` and `other`:

``` javascript
var dist = require('vectors/dist')(2)
var pos1 = [2, 4]
var pos2 = [4, 4]

dist(pos1, pos2) === 2
```

**/


module.exports = generator

function generator(dims) {
  dims = +dims|0

  var body = []

  body.push('return function dist' + dims + '(vec, other) {')
      var els = []
      for (var i = 0; i < dims; i += 1) {
        body.push('var p'+i+' = other[' + i + ']-vec[' + i + ']')
        els.push('p'+i+'*p'+i)
      }
    body.push('return Math.sqrt(' + els.join(' + ') + ')')
  body.push('}')

  return Function(body.join('\n'))()
}
