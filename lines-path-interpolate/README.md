# lines-path-interpolate

linear/bezier position interpolation for paths made from line segments. 

uses binary search for efficiency. 

automagicially detects if the lines form a continuous loop.

## Installation

```sh
npm i lines-path-interpolate
```

## Usage

```javascript
var lpi = require('lines-path-interpolate');

//each pt is [x,y,z]
var ptA = [0,0,0];
var ptB = [0,0,1];
var ptC = [1,0,1];
var ptD = [1,0,0];

//each segment consists of two 3d points
var segs = [
    [ptA,ptB],
    [ptB,ptC],
    [ptC,ptD],
    [ptD,ptA]    
];

//alternatively, let the library create segments from the pts:
var _segs = lpi.pts2Lines([ptA,ptB,ptC,ptD])

//get linear interpolated point, using fraction of total path length:
var fraction = 0.75;
var pt = lpi.interpAlongLines(segs, fraction); //returns 3d point [x,y,z]

//instead of a fraction of the total path, can also use absolute units:
var theDist = 0.25; 
var pt_by_dist = lpi.interpAlongLines_dist(segs, theDist); 

//get quadratic bezier interpolated point, with interpolant padding:
var fraction = 0.75;
var bezier_padding = 2.0;
var pt_bez = lpi.interpAlongLines_bezier(segs, fraction, bezier_padding); 

//again using distance instead of fraction:
var pt_bez_by_dist = lpi.interpAlongLines_bezier_dist(segs, theDist, bezier_padding); 

//get total path length:
var pathLength = lpi.getTraversedLength(segs);
```

NOTE:
 - an array of segment lengths gets cached in `segs.flatStack` after the first query 
 - path length is cached in `segs.tlength`
 - segments are assumed to connect to each other - if they don't, the iterpolated result will "jump" from the end of one segment to the start of the next one
 - automagically detects if the lines form a continuous loop [for bezier interpolation near start/end]



[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)




