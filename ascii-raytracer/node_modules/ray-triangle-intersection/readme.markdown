# ray-triangle-intersection

calculate the intersection of a ray and a triangle in three dimensions
using the [Möller-Trumbore intersection algorithm][0]
with culling enabled

[0]: http://www.cs.virginia.edu/~gfx/Courses/2003/ImageSynthesis/papers/Acceleration/Fast%20MinimumStorage%20RayTriangle%20Intersection.pdf

# example

``` js
var intersect = require('ray-triangle-intersection');

var tri = [[5,5,5],[10,15,4],[15,5,3]];
var pt = [9,5,-5];
var dir = [0.1,0.1,0.8];

console.log(intersect([], pt, dir, tri));
```

output:

```
[ 10.121951219512194, 6.121951219512195, 3.97560975609756 ]
```

# methods

``` js
var intersect = require('ray-triangle-intersection')
```

## intersect(out, pt, dir, tri)

Compute the intersection of the triangle `tri` and a ray described by a point
`pt` and a direction `dir`.

`tri` should be an array of `[x,y,z]` coordinate arrays.

If the ray did not intersect `tri`, return `null`.

Otherwise return and update `out` with the coordinates on `tri` where the ray
intersected.

# install

With [npm](https://npmjs.org) do:

```
npm install ray-triangle-intersection
```

# license

MIT
