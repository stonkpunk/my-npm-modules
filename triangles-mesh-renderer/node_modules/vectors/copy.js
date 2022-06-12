/**

### `copy(vec)`

Returns a copy of the vector `vec`:

``` javascript
var copy = require('vectors/copy')(2)
var spd = [5, 5]

var cop = copy(spd)
mult(spd, 100) === [100, 100]
cop === [5, 5]
```

**/

module.exports = function() {
  return copy
}

function copy(vec) {
  return vec.slice(0)
}
