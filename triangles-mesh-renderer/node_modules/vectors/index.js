/**

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

**/

module.exports = {
    add: require('./add')
  , addn: require('./add-nd')

  , sub: require('./sub')
  , subn: require('./sub-nd')

  , div: require('./div')
  , divn: require('./div-nd')

  , mult: require('./mult')
  , multn: require('./mult-nd')

  , copy: require('./copy')
  , copyn: require('./copy-nd')

  , mag: require('./mag')
  , magn: require('./mag-nd')

  , dot: require('./dot')
  , dotn: require('./dot-nd')

  , dist: require('./dist')
  , distn: require('./dist-nd')

  , lerp: require('./lerp')
  , lerpn: require('./lerp-nd')

  , cross: require('./cross')
  , crossn: require('./cross-nd')

  , limit: require('./limit')
  , limitn: require('./limit-nd')

  , heading: require('./heading')

  , normalize: require('./normalize')
  , normalizen: require('./normalize-nd')
}
