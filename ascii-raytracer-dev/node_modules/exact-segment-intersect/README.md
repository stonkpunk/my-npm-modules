exact-segment-intersect
==========================
Exactly computes the intersection of a pair of line segments as a homogeneous vector of non-overlapping increasing sequences.

[![testling badge](https://ci.testling.com/mikolalysenko/exact-segment-intersect.png)](https://ci.testling.com/mikolalysenko/exact-segment-intersect)

[![build status](https://secure.travis-ci.org/mikolalysenko/exact-segment-intersect.png)](http://travis-ci.org/mikolalysenko/exact-segment-intersect)

# Example

```javascript
var exactIntersect = require("exact-segment-intersect")

var a = [-1,0]
var b = [1,0]
var c = [0,-1]
var d = [0,1]

console.log(exactIntersect(a, b, c, d))
```

Output:

```javascript
[ [0], [0], [1] ]
```

# Install

```
npm install exact-segment-intersect
```

# API

#### `require("exact-segment-intersect")(a,b,c,d)`
Exactly computes the intersection of the line segments `[a,b]` and `[c,d]`

* `a,b` are the vertices of the first segment
* `c,d` are the vertices of the second segment

**Returns** A homogeneous 3 vector encoding the exact point of intersection

# Credits
(c) 2014 Mikola Lysenko. MIT License
