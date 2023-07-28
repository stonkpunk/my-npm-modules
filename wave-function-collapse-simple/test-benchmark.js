var {Tile3D, tilesMatch2D} = require('./tiles.js');
var {waveFunctionCollapse2D, printOutputField2D} = require('./wfc.js');

var TILE_SIZE = 5;
var N_STATES = 2;
var TILES = new Array(5000).fill(1).map(function(one,i){
    return new Tile3D(TILE_SIZE, TILE_SIZE, 1).randomize(N_STATES);
});

var reps = 1;
var RES1;
var t0=Date.now();
for(var i=0;i<reps;i++){//console.log('ok');
    RES1 = waveFunctionCollapse2D(TILES, [8,8], false); //no memos
}
console.log(`no memo took ${Date.now()-t0}ms`);

t0=Date.now();
for(var i=0;i<reps;i++){//console.log('ok');
    RES1 = waveFunctionCollapse2D(TILES, [8,8], true); //w memos
}
console.log(`memo took ${Date.now()-t0}ms`);

// printOutputField2D(RES1);