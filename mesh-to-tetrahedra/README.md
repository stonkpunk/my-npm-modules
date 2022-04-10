# mesh-to-tetrahedra

quickly convert a triangle mesh into a set of tetrahedra that occupy approximately the same volume as the original mesh. 

meant to help convert "surfaces" into "volumes" for building implicit distance functions.

converts a mesh with N triangles into N tetrahedra. each resulting tetrahedron extends from a surface triangle, towards the local "deep part" of the mesh [uses `mesh-to-skeleton` to achieve this]. 

note: 
- the tetrahedra will almost certainly NOT "perfectly" fill the mesh. there may be gaps/overlaps, especially near the "inner tips" of the tetrahedra. this tool is not a replacement for [marching cubes](https://www.npmjs.com/package/marching-cubes-fast) etc.
- in some cases the number of result tetrahedra may be smaller than the number of triangles, eg if there was an error determining the inside/outside of the mesh due to open seams in the mesh. 




## Installation

```sh
npm i mesh-to-tetrahedra
```

## Usage 

```javascript
var m2t = require('mesh-to-tetrahedra');
var bunny = require('bunny'); //indexed mesh of stanford bunny {cells, positions}
var tets = m2t.meshIndexed2Tetrahedra(bunny); //if you have a mesh {cells, positions}
//m2t.mesh2Tetrahedra(triangles); //if you have a list of triangles [[x,y,z],[x,y,z],[x,y,z]]

//result is list of tetra, each tetra has format
// [[x,y,z],[x,y,z],[x,y,z],[x,y,z]]

//full params:
//mesh2Tetrahedra(triangles, tetPercent=1.0, tetDist= 2.0, rescaleAmt = 1.0)

//set tetPercent < 1.0 if you only want the tetra's to extend only partially into the mesh.
//eg if tetPercent = 0.5, then the tetra's only go halfway deep into the mesh. 

//the tetDist param works similarly but it works using absolute distance rather than percentage.
//note - tetDist is IGNORED unless tetPercent is zero/null/undefined.

//convert a tetra to triangles with correct winding using
//m2t.tetra2Triangles(tetra);

//also 
//m2t.tetraNormalLines(tetra) ==> list of 4 line segments representing face-centered normal directions, each one [[x,y,z],[x,y,z]]
//m2t.triangleNormal(triangle) ==> returns [x,y,z] normal direction
```
![bunny1](https://i.imgur.com/ZZjklGm.png)

^ standford bunny built from 3674 seemless tetrahedra -- looks identical to the original...

![bunny2](https://i.imgur.com/cjVQ1CT.png)

^ with tetrahedra shrunk to 75% size using `rescaleAmt=0.75`

![bunny3](https://i.imgur.com/mezbKfw.png)

^ detail

![bunny5](https://i.imgur.com/ACwsrUH.png)

^ setting `tetPercent` to a negative number to make a "spiky" mesh

![sphere](https://i.imgur.com/mufXtzO.png)

^ slightly negative `tetPercent` applied to `npm icosphere` resembles Epcot's [Spaceship Earth](https://en.wikipedia.org/wiki/Spaceship_Earth_(Epcot))

## See Also
 - [mesh-to-spheres](https://npmjs.com/package/mesh-to-spheres)
 - [mesh-to-skeleton](https://npmjs.com/package/mesh-to-skeleton)
 - [icosphere](https://npmjs.com/package/icosphere)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)




