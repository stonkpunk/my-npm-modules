# segseg

Intersection detection between two line segments in 2d space

## Signature

`segseg(x1, y1, x2, y2, x3, y3, x4, y4)`

__returns__:

* [x, y] - intersection
* true - colinear
* undefined -  no intersection

## Usage

```javascript
var segseg = require('segseg');
/*
                (0, 5)
                   |
  (-10, 0) ----------------  (10, 0)
                   |
                (0, -5)
*/
var isect = segseg(-10, 0, 10, 0, 0, 5, 0, -5);

console.log(isect.join(',')) // outputs: 0,0

```

## Credits

This code was ported from Mukesh Prasad's [example implementation](http://www.realtimerendering.com/resources/GraphicsGems/gemsii/xlines.c) which was included in graphics gems 2.
