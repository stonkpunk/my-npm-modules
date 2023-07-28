var {
    getNonZeroVoxelsFromTile,
    getNonZeroVoxelsFromTiles,
    Tile3D,
    tilesMatch3D_memoized,
    tilesMatch2D_memoized,
    tilesMatch3D,
    tilesMatch2D
} = require('./tiles.js');

var {
    waveFunctionCollapse2D,
    waveFunctionCollapse3D,
    printOutputField3D,
    printOutputField2D,
    getOutputFieldGrid2D,
    getOutputFieldGrid3D
} = require('./wfc.js');

module.exports = {
    getNonZeroVoxelsFromTile,
    getNonZeroVoxelsFromTiles,
    Tile3D,
    waveFunctionCollapse2D,
    waveFunctionCollapse3D,
    printOutputField3D,
    printOutputField2D,
    tilesMatch3D_memoized,
    tilesMatch2D_memoized,
    tilesMatch3D,
    tilesMatch2D,
    getOutputFieldGrid2D,
    getOutputFieldGrid3D
};
