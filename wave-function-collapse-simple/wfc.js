var {Tile2D, Tile3D, tilesMatch2D, tilesMatch3D, tilesMatch2D_memoized, tilesMatch3D_memoized} = require('./tiles.js');

//todo precache matches, only loop thru matching tiles...
// var TILE_MATCH_CACHE=null;
//
// function precacheTileMatches(tiles, useMemos=false, tilesMatchFunc){
//     //give unique names for tiles
//     tiles = tiles.map(function(tile,i){
//         tile.payload["_name"] = `t${i}`
//         return tile;
//     });
//
//     TILE_MATCH_CACHE={};
//
//     tiles.forEach(function(tileA){
//         tiles.forEach(function(tileB){
//
//             const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
//
//             for (const dir of dirs) {
//                 const [dx, dy] = dir;
//                 tilesMatchFunc(tile, tiles[otherTileIndex], dir);
//
//                 var hash = `${tileA.payload.name}_${tileB.payload.name}_${dir.join("~")}`;
//                 var existing = TILE_MATCH_CACHE[hash];
//                 if(!existing){
//                     TILE_MATCH_CACHE[hash] = tilesMatchFunc(tileA,tileB,dir);
//                 }
//             }
//
//
//         });
//     });
// }


//entropy + backtracking
function waveFunctionCollapse2D(tiles, outputSize, useMemos=false, timeoutMs=1000) {
    const [w, h] = outputSize;
    const possibilities = new Array(w).fill().map(() => new Array(h).fill().map(() => new Set(tiles.keys())));
    const output = new Array(w).fill().map(() => new Array(h).fill(null));

    const history = [];

    var tilesMatchFunc = useMemos ? tilesMatch2D_memoized : tilesMatch2D;

    var elapsedTime = 0;
    var startTime = Date.now();

    while (elapsedTime < timeoutMs) {
        // Find the cell with the lowest entropy
        let minEntropy = Infinity;
        let minEntropyPos = null;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (output[x][y] === null && possibilities[x][y].size < minEntropy) {
                    minEntropy = possibilities[x][y].size;
                    minEntropyPos = {x, y};
                }
            }
        }

        if (minEntropyPos === null) {
            // All cells have been filled
            break;
        }

        const {x, y} = minEntropyPos;
        const possibleTiles = Array.from(possibilities[x][y]);

        if (possibleTiles.length === 0) {
            // No possible tiles for this cell, backtrack
            if (history.length === 0) {
                // No history to backtrack to, all possibilities exhausted
                return null;
            }

            const {output: outputCopy, possibilities: possibilitiesCopy} = history.pop();
            Object.assign(output, outputCopy);
            Object.assign(possibilities, possibilitiesCopy);

            continue;
        }

        const tileIndex = possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
        const tile = tiles[tileIndex];

        // Save the current state to the history
        history.push({
            output: output.map(row => [...row]),
            possibilities: possibilities.map(row => row.map(cell => new Set(cell))),
        });

        output[x][y] = tile;

        // Update the possibilities for the surrounding cells
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const dir of dirs) {
            const [dx, dy] = dir;
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && output[nx][ny] === null) {
                for (const otherTileIndex of possibilities[nx][ny]) {
                    if (!tilesMatchFunc(tile, tiles[otherTileIndex], dir)) {
                        possibilities[nx][ny].delete(otherTileIndex);
                    }
                }
            }
        }
        elapsedTime = (Date.now() - startTime);
    }

    if(elapsedTime >= timeoutMs){
        output.timedOut=true;
    }

    return output;
}

//entropy + backtracking, 3d
function waveFunctionCollapse3D(tiles, outputSize, useMemos=false, timeoutMs=1000) {

    var tilesMatchFunc = useMemos ? tilesMatch3D_memoized : tilesMatch3D;

    const [w, h, d] = outputSize;
    const possibilities = new Array(w).fill().map(() =>
        new Array(h).fill().map(() =>
            new Array(d).fill().map(() => new Set(tiles.keys()))));
    const output = new Array(w).fill().map(() =>
        new Array(h).fill().map(() =>
            new Array(d).fill(null)));

    const history = [];

    var startTime = Date.now();
    var elapsedTime = 0;

    while (elapsedTime < timeoutMs) {
        // Find the cell with the lowest entropy
        let minEntropy = Infinity;
        let minEntropyPos = null;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                for (let z = 0; z < d; z++) {
                    if (output[x][y][z] === null && possibilities[x][y][z].size < minEntropy) {
                        minEntropy = possibilities[x][y][z].size;
                        minEntropyPos = {x, y, z};
                    }
                }
            }
        }



        if (minEntropyPos === null) {
            // All cells have been filled
            break;
        }

        const {x, y, z} = minEntropyPos;
        const possibleTiles = Array.from(possibilities[x][y][z]);

        if (possibleTiles.length === 0) {
            // No possible tiles for this cell, backtrack
            if (history.length === 0) {
                // No history to backtrack to, all possibilities exhausted
                return null;
            }

            const {output: outputCopy, possibilities: possibilitiesCopy} = history.pop();
            Object.assign(output, outputCopy);
            Object.assign(possibilities, possibilitiesCopy);

            continue;
        }

        const tileIndex = possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
        const tile = tiles[tileIndex];

        // Save the current state to the history
        history.push({
            output: output.map(slice => slice.map(row => [...row])),
            possibilities: possibilities.map(slice => slice.map(row => row.map(cell => new Set(cell)))),
        });

        output[x][y][z] = tile;

        // Update the possibilities for the surrounding cells
        const dirs = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];

        for (const dir of dirs) {
            const [dx, dy, dz] = dir;
            const nx = x + dx;
            const ny = y + dy;
            const nz = z + dz;

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && nz >= 0 && nz < d && output[nx][ny][nz] === null) {
                for (const otherTileIndex of possibilities[nx][ny][nz]) {
                    if (!tilesMatchFunc(tile, tiles[otherTileIndex], dir)) {
                        possibilities[nx][ny][nz].delete(otherTileIndex);
                    }
                }
            }
        }

        elapsedTime = (Date.now() - startTime);
    }

    elapsedTime = (Date.now() - startTime);
    console.log({elapsedTime});
    if(elapsedTime >= timeoutMs){
        output.timedOut=true;
    }

    return output;
}

function waveFunctionCollapse3DFaster(tiles, outputSize, timeoutMs=1000) {

    var tilesMatchFunc = useMemos ? tilesMatch3D_memoized : tilesMatch3D;

    const [w, h, d] = outputSize;
    const possibilities = new Array(w).fill().map(() =>
        new Array(h).fill().map(() =>
            new Array(d).fill().map(() => new Set(tiles.keys()))));
    const output = new Array(w).fill().map(() =>
        new Array(h).fill().map(() =>
            new Array(d).fill(null)));

    const history = [];

    var startTime = Date.now();
    var elapsedTime = 0;

    while (elapsedTime < timeoutMs) {
        // Find the cell with the lowest entropy
        let minEntropy = Infinity;
        let minEntropyPos = null;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                for (let z = 0; z < d; z++) {
                    if (output[x][y][z] === null && possibilities[x][y][z].size < minEntropy) {
                        minEntropy = possibilities[x][y][z].size;
                        minEntropyPos = {x, y, z};
                    }
                }
            }
        }



        if (minEntropyPos === null) {
            // All cells have been filled
            break;
        }

        const {x, y, z} = minEntropyPos;
        const possibleTiles = Array.from(possibilities[x][y][z]);

        if (possibleTiles.length === 0) {
            // No possible tiles for this cell, backtrack
            if (history.length === 0) {
                // No history to backtrack to, all possibilities exhausted
                return null;
            }

            const {output: outputCopy, possibilities: possibilitiesCopy} = history.pop();
            Object.assign(output, outputCopy);
            Object.assign(possibilities, possibilitiesCopy);

            continue;
        }

        const tileIndex = possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
        const tile = tiles[tileIndex];

        // Save the current state to the history
        history.push({
            output: output.map(slice => slice.map(row => [...row])),
            possibilities: possibilities.map(slice => slice.map(row => row.map(cell => new Set(cell)))),
        });

        output[x][y][z] = tile;

        // Update the possibilities for the surrounding cells
        const dirs = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];

        for (const dir of dirs) {
            const [dx, dy, dz] = dir;
            const nx = x + dx;
            const ny = y + dy;
            const nz = z + dz;

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && nz >= 0 && nz < d && output[nx][ny][nz] === null) {
                for (const otherTileIndex of possibilities[nx][ny][nz]) {
                    if (!tilesMatchFunc(tile, tiles[otherTileIndex], dir)) {
                        possibilities[nx][ny][nz].delete(otherTileIndex);
                    }
                }
            }
        }

        elapsedTime = (Date.now() - startTime);
    }

    elapsedTime = (Date.now() - startTime);
    console.log({elapsedTime});
    if(elapsedTime >= timeoutMs){
        output.timedOut=true;
    }

    return output;
}


function itemToChar(number){
    return ' #.|'.charAt(number);
    //return number;
}
function printOutputField3D(outputField, silent=false) {
    var grid = getOutputFieldGrid3D(outputField);
    const tileDepth = outputField[0][0][0].depth;
    const totalDepth = outputField[0][0].length * tileDepth;

    var outputString = "";
    // Convert the grid to a string and print it layer by layer.
    for (let z = 0; z < totalDepth; z++) {
        console.log(`\nLayer ${z + 1}:\n`);
        outputStringLine = grid.map(row => row.map(col => itemToChar(col[z])).join('')).join('\n');
        outputString+=outputStringLine + "\n";
        if(!silent){
            console.log(outputStringLine);
        }
    }

    return outputString;
}

function getOutputFieldGrid3D(outputField, renderNullTilesAsZero=true){
    const tileHeight = outputField[0][0][0].height; // Assuming all tiles have the same size.
    const tileWidth = outputField[0][0][0].width;
    const tileDepth = outputField[0][0][0].depth;

    // Create an empty grid with the total size of the output field.
    const totalHeight = outputField.length * tileHeight;
    const totalWidth = outputField[0].length * tileWidth; // Assuming all rows have the same length.
    const totalDepth = outputField[0][0].length * tileDepth;

    // We create a 3D grid to represent our field.
    const grid = new Array(totalHeight).fill().map(() =>
        new Array(totalWidth).fill().map(() => new Array(totalDepth).fill(' '))
    );

    // Fill the grid with the tiles' data.
    for (let i = 0; i < outputField.length; i++) {
        for (let j = 0; j < outputField[i].length; j++) {
            for (let k = 0; k < outputField[i][j].length; k++) {
                var tile = outputField[i][j][k];

                if(!tile && renderNullTilesAsZero){
                    tile = new Tile3D(tileWidth, tileHeight, tileDepth);
                }

                for (let x = 0; x < tileWidth; x++) {
                    for (let y = 0; y < tileHeight; y++) {
                        for (let z = 0; z < tileDepth; z++) {
                            grid[i * tileWidth + x][j * tileHeight + y][k * tileDepth + z] = tile.getPixel(x, y, z);
                        }
                    }
                }
            }
        }
    }

    return grid;
}

function printOutputField2D(outputField, silent=false) {
    var outputString = getOutputFieldGrid2D(outputField).map(row => row.map(item=>itemToChar(item)).join('')).join('\n');
    if(!silent){
        console.log(outputString);
    }
    return outputString;
}

function getOutputFieldGrid2D(outputField, renderNullTilesAsZero=true){
    const tileHeight = outputField[0][0].height; // Assuming all tiles have the same size.
    const tileWidth = outputField[0][0].width;

    // Create an empty grid with the total size of the output field.
    const totalHeight = outputField.length * tileHeight;
    const totalWidth = outputField[0].length * tileWidth; // Assuming all rows have the same length.
    const grid = new Array(totalHeight).fill().map(() => new Array(totalWidth).fill(' '));

    // Fill the grid with the tiles' data.
    for (let i = 0; i < outputField.length; i++) {
        for (let j = 0; j < outputField[i].length; j++) {
            const tile = outputField[j][i];

            if(!tile && renderNullTilesAsZero){
                tile = new Tile3D(tileWidth, tileHeight, 1);
            }

            for (let x = 0; x < tileWidth; x++) {
                for (let y = 0; y < tileHeight; y++) {
                    grid[i * tileHeight + y][j * tileWidth + x] = tile.getPixel(x, y);// ? '1' : '0';
                }
            }
        }
    }

    // Convert the grid to a string and print it.
    // const outputString = grid.map(row => row.map(item=>itemToChar(item)).join('')).join('\n');
    // console.log(outputString);
    return grid;
}

module.exports = {waveFunctionCollapse2D, waveFunctionCollapse3D, getOutputFieldGrid2D, getOutputFieldGrid3D, printOutputField3D, printOutputField2D}