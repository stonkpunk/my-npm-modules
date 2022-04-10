# lines-self-chop

given an array of 3d line segments, this tool slices the lines at all points of intersection, returning non-intersecting sub-segments.

works with any number of lines. 

this tool uses `rbush-3d` for efficiency.

![example](https://i.imgur.com/G2acj48.png)

## Installation

```sh
npm i lines-self-chop
```

## Usage 

```javascript
var chopLines = require('lines-self-chop');

// for example, if the input is 2 lines forming an X,
// the output is 4 shorter lines meeting at the center, 
// forming the same X.

//each line segment is two 3d points [[x,y,z],[x,y,z]]
var line1 = [[0,0,0],[5,0,5]];
var line2 = [[0,0,5],[5,0,0]];

var minDist = 0.01; //mininum distance between lines for them to be considered intersecting [default 0.1]

var result = chopLines([line1, line2], minDist); 

//result =
// [
//     [ [ 0, 0, 0 ], [ 2.5, 0, 2.5 ] ],
//     [ [ 2.5, 0, 2.5 ], [ 5, 0, 5 ] ],
//     [ [ 0, 0, 5 ], [ 2.5, 0, 2.5 ] ],
//     [ [ 2.5, 0, 2.5 ], [ 5, 0, 0 ] ]
// ]
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

