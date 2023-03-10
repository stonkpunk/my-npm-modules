var {Creature, BoidWorld} = require('./index.js');

var theBoidWorld;

var creatureNum = 250;

var creatures = [];
var generateBoidWorld = () => {
    for (let i = 0; i < creatureNum; i++) {
        const creature = new Creature();
        creatures.push(creature);
    }
    theBoidWorld = new BoidWorld(creatures);
}
generateBoidWorld();

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
    screenShotScaleUp: 8, //default is 4
    cameraPos: [0,0,0],
    // screenShotDir: '/Users/user/Desktop/' //default is ./
}

art.runScene(config);

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
        line.color = c.color;//[1,0,0]; //required by ART [sort of a glitch]
        return line;
    });
    art.updateDfForLines(res,1);
    theBoidWorld.update();
},10 );

