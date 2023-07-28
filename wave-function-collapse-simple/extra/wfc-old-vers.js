//simplest version
function waveFunctionCollapseSimple(tiles, outputSize) {
    const [w, h] = outputSize;
    const output = new Array(w).fill().map(() => new Array(h).fill(null));
    const stack = [{x: 0, y: 0}];

    while (stack.length > 0) {
        const {x, y} = stack.pop();

        for (const tile of tiles) {
            output[x][y] = tile;

            const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
            let valid = true;

            for (const dir of dirs) {
                const [dx, dy] = dir;
                const nx = x + dx;
                const ny = y + dy;

                if (nx >= 0 && nx < w && ny >= 0 && ny < h && output[nx][ny] !== null
                    && !tilesMatch2D(tile, output[nx][ny], dir)) {
                    valid = false;
                    break;
                }
            }

            if (valid) {
                if (x + 1 < w) stack.push({x: x + 1, y});
                if (y + 1 < h) stack.push({x, y: y + 1});

                break;
            }

            output[x][y] = null;
        }

        if (output[x][y] === null) {
            if (x - 1 >= 0) stack.push({x: x - 1, y});
            if (y - 1 >= 0) stack.push({x, y: y - 1});
        }
    }

    return output;
}

//backtracking, but no entropy
function waveFunctionCollapseWithBacktrack(tiles, outputSize) {
    const [w, h] = outputSize;
    const output = new Array(w).fill().map(() => new Array(h).fill(null));

    const stack = [{x: 0, y: 0, tileIndex: 0}];

    while (stack.length > 0) {
        const {x, y, tileIndex} = stack.pop();

        if (tileIndex >= tiles.length) {
            // No tile could be placed at this position, backtrack
            if (x - 1 >= 0) stack.push({x: x - 1, y, tileIndex: output[x - 1][y] + 1});
            else if (y - 1 >= 0) stack.push({x: w - 1, y: y - 1, tileIndex: output[w - 1][y - 1] + 1});
            output[x][y] = null;
            continue;
        }

        const tile = tiles[tileIndex];
        output[x][y] = tileIndex;

        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        let valid = true;

        for (const dir of dirs) {
            const [dx, dy] = dir;
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && output[nx][ny] !== null
                && !tilesMatch2D(tile, tiles[output[nx][ny]], dir)) {
                valid = false;
                break;
            }
        }

        if (valid) {
            // Move to the next cell
            if (x + 1 < w) stack.push({x: x + 1, y, tileIndex: 0});
            else if (y + 1 < h) stack.push({x: 0, y: y + 1, tileIndex: 0});
        } else {
            // This tile doesn't work, try the next one
            stack.push({x, y, tileIndex: tileIndex + 1});
        }
    }

    // Convert tile indices back to tiles
    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            output[x][y] = tiles[output[x][y]];
        }
    }

    return output;
}

//entropy only, no backtracking
function waveFunctionCollapseWithEntropy(tiles, outputSize) {
    const [w, h] = outputSize;
    const possibilities = new Array(w).fill().map(() => new Array(h).fill().map(() => new Set(tiles.keys())));
    const output = new Array(w).fill().map(() => new Array(h).fill(null));

    while (true) {
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
        const tileIndex = possibleTiles[Math.floor(Math.random() * possibleTiles.length)];
        const tile = tiles[tileIndex];

        output[x][y] = tile;

        // Update the possibilities for the surrounding cells
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

        for (const dir of dirs) {
            const [dx, dy] = dir;
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < w && ny >= 0 && ny < h && output[nx][ny] === null) {
                for (const otherTileIndex of possibilities[nx][ny]) {
                    if (!tilesMatch2D(tile, tiles[otherTileIndex], dir)) {
                        possibilities[nx][ny].delete(otherTileIndex);
                    }
                }
            }
        }
    }

    return output;
}