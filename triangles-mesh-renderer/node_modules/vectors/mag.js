/**

### `mag(vec)`

Returns the magnitude of the vector:

``` javascript
var mag = require('vectors/mag')(2)
var spd = [2, 4]

mag(spd) === 4.47213595499958
```

**/

module.exports = generator

function generator(dims) {
  dims = +dims|0

  var body = []

  body.push('return function mag' + dims + '(vec) {')
    body.push('return Math.sqrt(')
    var contents = []
    for (var i = 0; i < dims; i += 1) {
      contents.push('vec[' + i + ']*vec[' + i + ']')
    }
    body.push(contents.join('+'))
    body.push(')')
  body.push('}')

  return Function(body.join('\n'))()
}
