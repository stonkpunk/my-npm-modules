# triangles-index

index a set of triangles into a set of positions/pts and cells. merge vertices fast.

```javascript
//module.exports = {indexTriangles, deIndexTriangles};

//single triangle = [[x,y,z],[x,y,z],[x,y,z]]

//indexTriangles(triangles) => {cells: cells, pts: pts}
//deindexTriangles(indexResult) => array of triangles
//demergeMeshTriangles(indexResult) => {cells: cells, pts: pts} -- but no more shared vertices -- # cells == # triangles * 3 
```

add `_meshView` to the function names to get the same format as meshview and other libs use {cells, positions}

```javascript
//indexTriangles_meshView(triangles) => {cells: cells, positions: positions}
//deindexTriangles_meshView(indexResult) => array of triangles
//demergeMeshTriangles_meshView(indexResult) => {cells: cells, pts: pts} -- but no more shared vertices -- # cells == # triangles * 3 
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

