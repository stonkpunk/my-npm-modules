# boids-3d

simple 3d boids class

based on [this demo by takashi](https://codepen.io/tksiiii/details/jzBZdo)

no longer has a THREE.js dependency -- this lib only handles the positioning of the boids, not rendering meshes etc. 

## Installation

```sh
npm i boids-3d
```

## Usage 

```javascript
var {Creature, BoidWorld} = require('boids-3d');

var theBoidWorld;
var creatureNum = 250;
var creatures = [];
var generateBoidWorld = () => {
    for (let i = 0; i < creatureNum; i++) {
        const creature = new Creature();
        creatures.push(creature);
    }
    theBoidWorld = new BoidWorld(creatures);
    //now we can update the creatures in the boidWorld with theBoidWorld.update();
}
generateBoidWorld();

//[optional] visualizing the boid world with ascii raytracer...

var art = require('ascii-raytracer');
var config = {
    lines: creatures.map(function(c){
        var line= [[c.mesh.position.x,c.mesh.position.y,c.mesh.position.z],[c.mesh.position.x,c.mesh.position.y,c.mesh.position.z]]
        line.color = [1,0,0];
        return line;
    }),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:true,
    cameraPos: [0,0,0]
}

art.runScene(config);

//update the boid world, update the lines displayed by ascii-raytracer
//each creature is prepresented by a line
setInterval(function(){
    var s = 0.1;
    var vs = 1.0;
    var res = creatures.map(function(c){
        var p = c.mesh.position;
        var v = c.velocity;
        var line = [
            [p.x*s,p.y*s,p.z*s],
            [p.x*s+v.x*vs,p.y*s+v.y*vs,p.z*s+v.z*vs]
        ];
        line.color = c.color;
        return line;
    });
    art.updateDfForLines(res,1);
    theBoidWorld.update();
},10 );
```

![boids](https://i.imgur.com/sqgWpwR.png)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



