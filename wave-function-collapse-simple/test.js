var {Tile3D, waveFunctionCollapse2D, printOutputField2D } = require('./index.js');

var TILE_SIZE = 2; //width/height of the tiles in voxels
var N_STATES = 2; //number of states per voxel
//generate a big number of random tiles. if we manually build our tiles we dont need so many
var TILES = new Array(500).fill(1).map(function(one,i){
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
    printOutputField2D(resultField)
}else{
    console.log('timed out');
}


//2x2 tile example
// ###  ##    #####
// ##          ###
// ##          ###
// ##########  ##
// ##########  ##
// #  ####  ##  ###
// #  ####  ##  ###
// ##  ##  ####
// ##  ##  ####
// #  ######
// #  ######
// ##      ##
// ##      ##
// #  ##          #
// #  ##          #
// #  ##  ##

//5x5 tile example
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
// ## ### ####  ## # ##   ##  #     ### #
// #####   #### ##     ## ## # ##   ### #
// ###   # ### ###  #  #    #  ###    ###
// ###   # ### ###  #  #    #  ###    ###
// ##  ## # ## #   ##### ##   # ###  ##  #
// #  #    ### ##    #  #    #  ## ##  ####
// ##    ## ##   ####      ### #   ##### #
// # ###### ## #     #  # #########  ##  ##
// # ###### ## #     #  # #########  ##  ##
// # ####  #    #     ###           #####
// ## ######  #    # ###  ######    ####  #
// #   ## # ##  #### #  #  ## #   ###  #  #
// ####  #  #### #### ##     ##   ## ##   #
// ####  #  #### #### ##     ##   ## ##   #
// #    ###  #    # #   #######        #
// #  ########  ## ###### #####  # ######
// # ####   ##   # ####  ###    ##### ##
// #    ##   #    # #  #####   ### ### ##
// #    ##   #    # #  #####   ### ### ##
// ##  ## ######## ###  #### #    #  ###
// #   ####   #  ## #   ##### #    # #### #
// ##         # ## ####     # #  # ###   #
// # ###      #     ### #### # ###########
// # ###      #     ### #### # ###########
// ## #########  #        # ###
// ##    ####  ##### ### ### # ## ##  ###
// ######## ###  #    #### #### #   #
// ##   ## ##  # ### ##     ##  #  # ##
