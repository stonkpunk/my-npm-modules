# triangles-islands

break up a triangle mesh into "islands" (connected components)

returns an array of arrays of triangles -- one array for each "island"

## Installation

```sh
npm i triangles-islands
```

## Usage 

```javascript
//in this example 
//we create a merged list of triangles representing 
//2 separate tetrahedra

//then we use this tool to split the merged list
//back into the 2 separate tetrahedra 

var ti = require('triangles-islands');

var ptsA = [
    [0,0,0],
    [0,0,1],
    [1,0,1],
    [1,0,0]
]

var ptsB = [
    [0,5,0],
    [0,5,1],
    [1,5,1],
    [1,5,0]
]

var tetrahedron_trianglesA = [
    [ptsA[0],ptsA[1],ptsA[2]],
    [ptsA[0],ptsA[1],ptsA[3]],
    [ptsA[0],ptsA[2],ptsA[3]],
    [ptsA[1],ptsA[2],ptsA[3]]
];

var tetrahedron_trianglesB = [
    [ptsB[0],ptsB[1],ptsB[2]],
    [ptsB[0],ptsB[1],ptsB[3]],
    [ptsB[0],ptsB[2],ptsB[3]],
    [ptsB[1],ptsB[2],ptsB[3]]
];

var mergedList = [].concat(tetrahedron_trianglesA, tetrahedron_trianglesB);

var islands = ti.trianglesBreakIntoIslands(mergedList);

//result:
// [
//     tetrahedron_trianglesA,
//     tetrahedron_trianglesB
// ]

//can also use ti.trianglesIndexBreakIntoIslands
//if we have triangles index from npm 'triangles-index'

//or can use ti.geomBreakIntoIslands if using a geometry with
//properties .vertices and .faces like from older versions of
//three.JS
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)


