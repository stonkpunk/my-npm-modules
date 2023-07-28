var {Tile3D, getNonZeroVoxelsFromTiles, waveFunctionCollapse3D,printOutputField3D} = require('./index.js');

//very slow / difficult for sizes greater than 3 if doing it randomly, just cuz of stats...
// can do 2x2x2 field of 3x3x3, if we have on order of 512x512 (262k samples) or up to 1M samples
var TILE_SIZE = 2;
var N_STATES = 2;
var TILES = new Array(200).fill(1).map(function(one,i){
    return new Tile3D(TILE_SIZE, TILE_SIZE, TILE_SIZE).randomize(N_STATES) ;//generateRandomTile3D(TILE_SIZE,TILE_SIZE,TILE_SIZE);
});

// console.log(TILES)

var RES = waveFunctionCollapse3D(TILES, [2, 2, 2])

//var blocks = getNonZeroVoxelsFromTile(TILES[0]); //single tile version
var blocks = getNonZeroVoxelsFromTiles(RES); //get aabbs from set of tiles -- each aabb is [[minX,minY,minZ],[maxX,maxY,maxZ]]

printOutputField3D(RES);

//todo use voxel-world to generate triangles ? or just extract blocks directly from wfc...
//
// var triangles = require('triangles-index').deindexTriangles_meshView(bunny)
//
// console.log(triangles.length,triangles.length/12);
//
var art = require('ascii-raytracer');


var config = {
    // triangles: triangles,
    bricks: blocks,
    resolution: 64,
    aspectRatio: 1.0
}

art.runScene(config);