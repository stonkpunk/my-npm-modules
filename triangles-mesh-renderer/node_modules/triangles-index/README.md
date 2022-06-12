# triangles-index

index a set of triangles into a set of positions/pts and cells. merge vertices fast.

```javascript
//module.exports = {indexTriangles, deIndexTriangles};

//single triangle = [[x,y,z],[x,y,z],[x,y,z]]

//indexTriangles(triangles) => {cells: cells, pts: pts}
//deindexTriangles(indexResult) => array of triangles
```

add `_meshView` to the function names to get the same format as meshview and other libs use

```javascript
//indexTriangles_meshView(triangles) => {cells: cells, positions: positions}
//deindexTriangles_meshView(indexResult) => array of triangles
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

