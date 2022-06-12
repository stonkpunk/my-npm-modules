/**

### `sub(vec, other[, ...])`

Subtracts the `other` vector from `vec`:

``` javascript
var sub = require('vectors/sub')(2)
var pos = [0, 0]
var spd = [1, 1.5]

sub(pos, spd)
sub(pos, spd)

console.log(pos) // [-2, -3]
```

Or subtract a scalar from the entire array:

``` javascript
var res = sub([9, 8, 7], 6)
console.log(res) // [3, 2, 1]
```

You can disable this by passing `scalars: false` to
the generator function for faster results:

``` javascript
var sub = require('vectors/sub')(2, { scalars: false })
```

**/

module.exports = require('./lib/operator')('sub', '-')
