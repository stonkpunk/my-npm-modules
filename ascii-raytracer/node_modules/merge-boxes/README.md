# merge-boxes

recursively merge 3d axis-aligned bounding boxes / cuboids. 

useful for "losslessly" simplifying sets of voxels. 

works on array in-place.

## Installation

```sh
npm i merge-boxes
```

## Usage 

```javascript
var mb = require('merge-boxes');

// each box is 3d axis-aligned bounding box [lower_corner, upper_corner] ... 
// [
//   [xMin,yMin,zMin],
//   [xMax,yMax,zMax]
// ]

//example - 18 unmerged boxes
var boxesToMerge = [[[0,0,0],[1,1,1]],[[1,0,0],[2,1,1]],[[2,0,0],[3,1,1]],[[3,0,0],[4,1,1]],[[4,0,0],[5,1,1]],[[0,0,1],[1,1,2]],[[4,0,1],[5,1,2]],[[0,0,2],[1,1,3]],[[2,0,2],[3,1,3]],[[3,0,2],[4,1,3]],[[4,0,2],[5,1,3]],[[0,0,3],[1,1,4]],[[4,0,3],[5,1,4]],[[0,0,4],[1,1,5]],[[1,0,4],[2,1,5]],[[2,0,4],[3,1,5]],[[3,0,4],[4,1,5]],[[4,0,4],[5,1,5]]]

// 18 unmerged blocks ...
// 
//      ██ ██ ██ ██ ██
//      ██          ██
//      ██    ██ ██ ██
//      ██          ██
//      ██ ██ ██ ██ ██

mb.mergeBoxes(boxesToMerge);

// can merge into 5 merged blocks ... 
//
//      AAAAAAAAAAAA
//      BB        CC
//      BB   EEEE CC
//      BB        CC
//      BB DDDDDD CC

console.log(boxesToMerge);
//reduced to 5 merged boxes [[[0,0,4],[5,1,5]],[[4,0,0],[5,1,4]],[[2,0,2],[3,1,4]],[[0,0,0],[1,1,4]],[[1,0,0],[4,1,1]]]

```



