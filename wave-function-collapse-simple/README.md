# wave-function-collapse-simple

wave function collapse algorithm for cuboids with backtracking and entropy minimization, 3D and 2D versions. works by either matching edge content or matching arbitrary string labels for each cube face. 

## Installation

```sh
npm i wave-function-collapse-simple
```

## Usage 

2D example
```javascript
var {Tile3D, waveFunctionCollapse2D, printOutputField2D } = require('wave-function-collapse-simple');

var TILE_SIZE = 2; //width/height of the tiles in voxels
var N_STATES = 2; //number of states per voxel
//generate a big number of random tiles. if we manually build our tiles we dont need so many
var TILES = new Array(5000).fill(1).map(function(one,i){
    var tile = new Tile3D(TILE_SIZE, TILE_SIZE, 1);
    //tile.getPixel(x, y, z=0)
    //tile.setPixel(x, y, z, v, skipMemo=true)
    //tile.clone()
    return tile.randomize(N_STATES);
});

var outputSize = [8,8];
var useMemos = false; //if false use voxel-edge-matching, do not auto-save string hashes of faces / compare by string hash
//if true, maintain a string hash of content per-face, compare using the strings
// - note that these can be updated for custom behavior, we can ignore the voxels if we want
// - the face hashes are an obj like this...
// TILE.faces = {
//     'x=0': '',
//     'x=max': '',
//     'y=0': '',
//     'y=max': '',
//     'z=0': '',
//     'z=max': '',
// };

var timeoutMs = 1000; //optional , default 1000
var resultField = waveFunctionCollapse2D(TILES, outputSize, useMemos, timeoutMs);

if(!resultField.timedOut){
    printOutputField2D(resultField /*, silent=false */)
}else{
    console.log('timed out');
}

//see also getOutputFieldGrid2D --> raw result as 2d array

//2x2 tile example with 8x8 tiles in the field

// ###  ##    #####
// ##          ###
// ##          ###
// ##########  ##
// ##########  ##
// ...

//5x5 tile example with 8x8 tiles in the field

// ###### #  # #   ##       ##    # ##  ##
// #######  ## ###  ###    # ### # ##  ##
// #   #  ##   ## ####  #   ##    #######
// ##   ## ####   ########  # #  ## #### #
// #   ## # ###  ### #####   ####### ###  #
// #   ## # ###  ### #####   ####### ###  #
// #     #    #  ##   ##  ### # ### #  ## #
// #       ####### # ###    ## ### #  # ##
// # #   # #####   ##   ## ##########  ## #
// #  #       ### #  ## ###  #### ##  ##
// #  #       ### #  ## ###  #### ##  ##
// #   ###  ###     # ### ### # ## #### # #
// ...
```

3D example - similar to 2D 
```javascript
var {Tile3D, waveFunctionCollapse3D, printOutputField3D, getNonZeroVoxelsFromTiles} =
    require('wave-function-collapse-simple');

//very slow / difficult for sizes greater than 3 if doing it randomly, just cuz of stats...
// can do 2x2x2 field of 3x3x3, if we have on order of 512x512 (262k samples) or up to 1M samples
var TILE_SIZE = 2;
var N_STATES = 2;
var TILES = new Array(200).fill(1).map(function(one,i){
    return new Tile3D(TILE_SIZE, TILE_SIZE, TILE_SIZE).randomize(N_STATES) ;//generateRandomTile3D(TILE_SIZE,TILE_SIZE,TILE_SIZE);
});

var timeOutMs = 1000; //optional , default 1000
var RES = waveFunctionCollapse3D(TILES, [2, 2, 2], true, timeOutMs)

if(!RES.timedOut){
    console.log(RES)
    printOutputField3D(RES);
}else{
    console.log('timed out');
    throw 'timed out';
}

//see also getOutputFieldGrid3D --> raw result as 3d array

// can also view result in ascii-raytracer ... 
// var blocks = getNonZeroVoxelsFromTiles(RES); //get aabbs from set of tiles -- each aabb is [[minX,minY,minZ],[maxX,maxY,maxZ]]
// var art = require('ascii-raytracer');
// var config = {
//     bricks: blocks,
//     resolution: 64,
//     aspectRatio: 1.0
// }
// art.runScene(config);

//result...
//notice how lsyers 2 and 3 are identical 
//because they must 'match up' in 3d 

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
```

## See Also 

- [voxel-world](https://www.npmjs.com/package/voxel-world)




[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



