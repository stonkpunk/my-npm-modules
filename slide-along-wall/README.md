# slide-along-wall

slide a point along a wall / implicit surface / triangle mesh [eg for games, slide camera along wall upon collision]

## Installation

```sh
npm i slide-along-wall
```

## Usage 

```javascript
var saw = require('slide-along-wall');

var camera_oldPosition = [0,10,0]; //old camera position [x,y,z]
var camera_newPosition = [0,-10,0]; //desired camera position after some movement

//usage with list of triangles:

var triangles = [ triangle1, triangle2, ... ]; //each triangle = [[x,y,z],[x,y,z],[x,y,z]]
var camera_positionAfterSliding = 
    saw.slideAlongTriangles(camera_newPosition, camera_oldPosition, triangles) 

// optional raytracingFunction param: 
// saw.slideAlongTriangles(camera_newPosition, camera_oldPosition, triangles, raytracingFunction)
////   raytracingFunction is auto-generated if not provided, 
////   and can be pulled out after and reused with saw.getRecentTracingFunction(),
////   or you can generate one separately with saw.generateTracingFunction(triangles)
    

//usage with implicit surface / distance function:

var distanceFunction = function(x,y,z){
    return y; //this function represents a "floor"
}

var camera_positionAfterSliding = 
    saw.slideAlongDistanceFunction(camera_newPosition, camera_oldPosition, distanceFunction);
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

