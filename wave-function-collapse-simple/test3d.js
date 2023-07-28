var {Tile3D, waveFunctionCollapse3D, printOutputField3D} =
    require('./index.js');

//very slow / difficult for sizes greater than 3 if doing it randomly, just cuz of stats...
// can do 2x2x2 field of 3x3x3, if we have on order of 512x512 (262k samples) or up to 1M samples
var TILE_SIZE = 2;
var N_STATES = 2;
var TILES = new Array(200).fill(1).map(function(one,i){
    return new Tile3D(TILE_SIZE, TILE_SIZE, TILE_SIZE).randomize(N_STATES) ;//generateRandomTile3D(TILE_SIZE,TILE_SIZE,TILE_SIZE);
});

var RES = waveFunctionCollapse3D(TILES, [2, 2, 2], true, 10)

if(!RES.timedOut){
    console.log(RES)
    printOutputField3D(RES);
}else{
    console.log('timed out');
}



// Layer 1:
//
// #
// ###
// ###
// #  #
//
// Layer 2:
//
// #  #
// #
// #
//
//
// Layer 3:
//
// #  #
// #
// #
//
//
// Layer 4:
//
// #  #
// ####
// ####
// ###
