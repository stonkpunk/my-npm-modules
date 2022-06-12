/**

### `div(vec, other[, ...])`

Divides the vector `vec` by a `other` value:

``` javascript
var div = require('vectors/div')(2)
var spd = [5, 5]

div(spd, 2) === [2.5, 2.5]
```

Or divide multiple arrays from each other:

``` javascript
var res = div([6, 6, 6], [2, 2, 2])
console.log(res) // [3, 3, 3]
```

You can disable this by passing `vectors: false` to
the generator function for faster results:

``` javascript
var sub = require('vectors/div')(2, { vectors: false })
```

**/

module.exports = require('./lib/operator')('div', '/')
