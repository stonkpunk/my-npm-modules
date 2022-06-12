/**

### `lerp(vec, start, finish, scalar)`

Set `vec` to the linear interpolation between vectors `start`
and `finish`:

``` javascript
var lerp = require('vectors/lerp')(2)
var start = [0, 0]
var finish = [100, 100]

lerp([], start, finish, 0.75) === [75, 75]
```

**/

module.exports = generator

function generator(dims) {
  dims = +dims|0

  var body = []

  body.push('return function lerp' + dims + '(vec, a, b, scalar) {')
    for (var i = 0; i < dims; i += 1) {
      body.push(
        'vec[$] = a[$] + (b[$] - a[$]) * scalar'.replace(/\$/g, i)
      )
    }
    body.push('return vec')
  body.push('}')

  return Function(body.join('\n'))()
}
