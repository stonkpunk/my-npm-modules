# vectors
[![Build Status](https://travis-ci.org/hughsk/vectors.png?branch=master)](https://travis-ci.org/hughsk/vectors)
[![unstable](http://hughsk.github.io/stability-badges/dist/unstable.svg)](http://github.com/hughsk/stability-badges)

A grab bag of vector utility functions for 2D and 3D vectors that
operate on plain arrays. Much like [cog](http://ghub.io/cog),
each method can be required individually to limit the amount of
bloat you get from using the module on the client with
[browserify](http://browserify.org).

## Installation

``` bash
npm install vectors
```

## Contributors

* [hughsk](https://github.com/hughsk)
* [shama](https://github.com/shama)

## Usage

Each method is requireable from `vectors/${method}`,
followed by calling the returned generator function
with the number of dimensions you want your vectors to be.
e.g.:

``` javascript
var mag = require('vectors/mag')(2)
var add = require('vectors/add')(3)
var sub = require('vectors/sub')(3)
```

If you want something totally generic, you can assume
in most cases that appending `-nd` to your require
will return a less performant but more flexible function:

``` javascript
var mag = require('vectors/mag-nd')
var add = require('vectors/add-nd')
var sub = require('vectors/sub-nd')
```

Most of the methods in this module support vectors of
arbitrary dimensions, but the ones that don't will throw
an error to let you know.

Each method takes a `vec` vector, which if returning a new
vector will almost always do so by *modifying it directly*:

``` javascript
var spd = [+1, 0]
var acc = [-1, 0]
var cop = copy(spd)

mag(spd)      // 1
add(spd, acc) // spd === [0, 0]
mag(spd)      // 0
mag(cop)      // 1
```

### `add(vec, other[, ...])`

Adds the `other` vector to `vec`:

``` javascript
var add = require('vectors/add')(2)
var pos = [0, 0]
var spd = [1, 1.5]

add(pos, spd)
add(pos, spd)

console.log(pos) // [2, 3]
```

Or add a scalar to the entire array:

``` javascript
var res = add([1, 1, 1], 6)
console.log(res) // [7, 7, 7]
```

You can disable this by passing `scalars: false` to
the generator function for faster results:

``` javascript
var add = require('vectors/add')(2, { scalars: false })
```

### `copy(vec)`

Returns a copy of the vector `vec`:

``` javascript
var copy = require('vectors/copy')(2)
var spd = [5, 5]

var cop = copy(spd)
mult(spd, 100) === [100, 100]
cop === [5, 5]
```

### `cross(vec, other)`

Returns the cross product of vectors `vec` and `other`:

``` javascript
var cross = require('vectors/cross')(2)
var a = [1, 2]
var b = [8, 4]

cross(a, b) === -12
```

This method only works in 2 and 3 dimensions.

### `dist(vec, other)`

Returns the distance between vectors `vec` and `other`:

``` javascript
var dist = require('vectors/dist')(2)
var pos1 = [2, 4]
var pos2 = [4, 4]

dist(pos1, pos2) === 2
```

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

### `dot(vec, other)`

Returns the dot product of vectors `vec` and `other`:

``` javascript
var dot = require('vectors/dot')(2)
var vecA = [15, 5]
var vecB = [10, 8]

dot(vecA, vecB) === 190
```

### `heading(vec, other)`

Mutliplies the vector `vec` by a `scalar` value:

``` javascript
var heading = require('vectors/heading')(2)
var a = [5, 0]
var b = [0, 5]

heading(a, b) * 180 / Math.PI === 45 // degrees
```

### `lerp(vec, start, finish, scalar)`

Set `vec` to the linear interpolation between vectors `start`
and `finish`:

``` javascript
var lerp = require('vectors/lerp')(2)
var start = [0, 0]
var finish = [100, 100]

lerp([], start, finish, 0.75) === [75, 75]
```

### `limit(vec, scalar)`

Limits the vector `vec` to a magnitude of `scalar` units.

``` javascript
var limit = require('vectors/limit')(2)

limit([3, 0], 2)  === [2, 0]
limit([3, 4], 1)  === [0.6, 0.8]
limit([5, 5], 24) === [5, 5]
```

### `mag(vec)`

Returns the magnitude of the vector:

``` javascript
var mag = require('vectors/mag')(2)
var spd = [2, 4]

mag(spd) === 4.47213595499958
```

### `mult(vec, other[, ...])`

Mutliplies the vector `vec` by a `other` value:

``` javascript
var mult = require('vectors/mult')(2)
var spd = [5, 5]

mult(spd, 2) === [10, 10]
```

Or multiply multiple arrays:

``` javascript
var res = mult([2, 2, 2], [4, 4, 4])
console.log(res) // [8, 8, 8]
```

You can disable this by passing `vectors: false` to
the generator function for faster results:

``` javascript
var sub = require('vectors/mult')(2, { vectors: false })
```

### `normalize(vec, scalar)`

Normalizes the vector (i.e. scales it to make its
distance 1 unit).

``` javascript
var normalize = require('vectors/normalize')(2)

normalize([3, 0])  === [1, 0]
normalize([4, 3])  === [0.8, 0.6]
```

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
