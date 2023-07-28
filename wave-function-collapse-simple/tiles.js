const Tile3D = class {
    constructor(width, height, depth) {
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.data = new Array(width * height * depth).fill(0);
        this.payload = {}; //some object to store along with the tile3d

        //todo the memos will fail if values above 10 [unless all values get padded]

        // face memos.
        this.faces = {
            'x=0': '',
            'x=max': '',
            'y=0': '',
            'y=max': '',
            'z=0': '',
            'z=max': '',
        };
    }

    getPixel(x, y, z=0) {
        return this.data[this.getIndex(x, y, z)];
    }

    setPixel(x, y, z, v, skipMemo=true) {
        this.data[this.getIndex(x, y, z)] = v;
        // Update relevant faces
        if(skipMemo){
            //skip the memo
        }else{
            if (x === 0) this.faces['x=0'] = this.faces['x=0'].substring(0, y * this.depth + z) + v + this.faces['x=0'].substring(y * this.depth + z + 1);
            if (x === this.width - 1) this.faces['x=max'] = this.faces['x=max'].substring(0, y * this.depth + z) + v + this.faces['x=max'].substring(y * this.depth + z + 1);
            if (y === 0) this.faces['y=0'] = this.faces['y=0'].substring(0, x * this.depth + z) + v + this.faces['y=0'].substring(x * this.depth + z + 1);
            if (y === this.height - 1) this.faces['y=max'] = this.faces['y=max'].substring(0, x * this.depth + z) + v + this.faces['y=max'].substring(x * this.depth + z + 1);
            if (z === 0) this.faces['z=0'] = this.faces['z=0'].substring(0, x * this.height + y) + v + this.faces['z=0'].substring(x * this.height + y + 1);
            if (z === this.depth - 1) this.faces['z=max'] = this.faces['z=max'].substring(0, x * this.height + y) + v + this.faces['z=max'].substring(x * this.height + y + 1);
        }
    }

    getIndex(x, y, z) {
        return x + this.width * (y + this.height * z);
    }

    clone() {
        const clonedTile = new Tile3D(this.width, this.height, this.depth);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                for (let z = 0; z < this.depth; z++) {
                    clonedTile.setPixel(x, y, z, this.getPixel(x, y, z));
                }
            }
        }
        return clonedTile;
    }

    randomize(N_STATES = 2, skipMemo= false) {
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                for (let z = 0; z < this.depth; z++) {
                    this.setPixel(x, y, z, Math.floor(Math.random() * N_STATES), skipMemo);
                }
            }
        }
        return this;
    }
}

function tilesMatch2D(tile1, tile2, dir) {
    const [dx, dy] = dir;
    const [w, h] = [tile1.width, tile1.height];

    if (dx === -1) { // left
        for (let y = 0; y < h; y++) {
            if (tile1.getPixel(0, y) !== tile2.getPixel(w - 1, y)) {
                return false;
            }
        }
    } else if (dx === 1) { // right
        for (let y = 0; y < h; y++) {
            if (tile1.getPixel(w - 1, y) !== tile2.getPixel(0, y)) {
                return false;
            }
        }
    } else if (dy === -1) { // up
        for (let x = 0; x < w; x++) {
            if (tile1.getPixel(x, 0) !== tile2.getPixel(x, h - 1)) {
                return false;
            }
        }
    } else if (dy === 1) { // down
        for (let x = 0; x < w; x++) {
            if (tile1.getPixel(x, h - 1) !== tile2.getPixel(x, 0)) {
                return false;
            }
        }
    }

    return true;
}

function tilesMatch2D_memoized(tile1, tile2, dir) {
    const [dx, dy] = dir;

    if (dx === -1) { // left
        return tile1.faces['x=0'] === tile2.faces['x=max'];
    } else if (dx === 1) { // right
        return tile1.faces['x=max'] === tile2.faces['x=0'];
    } else if (dy === -1) { // up
        return tile1.faces['y=0'] === tile2.faces['y=max'];
    } else if (dy === 1) { // down
        return tile1.faces['y=max'] === tile2.faces['y=0'];
    }

    return false;
}

function tilesMatch3D(tile1, tile2, dir) {
    const [dx, dy, dz] = dir;
    const [w, h, d] = [tile1.width, tile1.height, tile1.depth];

    if (dx === -1) { // left
        for (let y = 0; y < h; y++) {
            for (let z = 0; z < d; z++) {
                if (tile1.getPixel(0, y, z) !== tile2.getPixel(w - 1, y, z)) {
                    return false;
                }
            }
        }
    } else if (dx === 1) { // right
        for (let y = 0; y < h; y++) {
            for (let z = 0; z < d; z++) {
                if (tile1.getPixel(w - 1, y, z) !== tile2.getPixel(0, y, z)) {
                    return false;
                }
            }
        }
    } else if (dy === -1) { // up
        for (let x = 0; x < w; x++) {
            for (let z = 0; z < d; z++) {
                if (tile1.getPixel(x, 0, z) !== tile2.getPixel(x, h - 1, z)) {
                    return false;
                }
            }
        }
    } else if (dy === 1) { // down
        for (let x = 0; x < w; x++) {
            for (let z = 0; z < d; z++) {
                if (tile1.getPixel(x, h - 1, z) !== tile2.getPixel(x, 0, z)) {
                    return false;
                }
            }
        }
    } else if (dz === -1) { // front
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (tile1.getPixel(x, y, 0) !== tile2.getPixel(x, y, d - 1)) {
                    return false;
                }
            }
        }
    } else if (dz === 1) { // back
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (tile1.getPixel(x, y, d - 1) !== tile2.getPixel(x, y, 0)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function tilesMatch3D_memoized(tile1, tile2, dir) {
    const [dx, dy, dz] = dir;

    if (dx === -1) { // left
        return tile1.faces['x=0'] === tile2.faces['x=max'];
    } else if (dx === 1) { // right
        return tile1.faces['x=max'] === tile2.faces['x=0'];
    } else if (dy === -1) { // up
        return tile1.faces['y=0'] === tile2.faces['y=max'];
    } else if (dy === 1) { // down
        return tile1.faces['y=max'] === tile2.faces['y=0'];
    } else if (dz === -1) { // front
        return tile1.faces['z=0'] === tile2.faces['z=max'];
    } else if (dz === 1) { // back
        return tile1.faces['z=max'] === tile2.faces['z=0'];
    }

    return false;
}

function getNonZeroVoxelsFromTile(tile) {
    const voxels = [];
    const [width, height, depth] = [tile.width, tile.height, tile.depth];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            for (let z = 0; z < depth; z++) {
                const pixel = tile.getPixel(x, y, z);
                if (pixel) {
                    voxels.push([[x, y, z], [x+1, y+1, z+1], pixel]);
                }
            }
        }
    }
    return voxels;
}

function getNonZeroVoxelsFromTiles(tileArray) {
    const allVoxels = [];
    for (let i = 0; i < tileArray.length; i++) {
        for (let j = 0; j < tileArray[i].length; j++) {
            for (let k = 0; k < tileArray[i][j].length; k++) {
                const tile = tileArray[i][j][k];
                const tileWidth = tile.width;
                const tileHeight = tile.height;
                const tileDepth = tile.depth;
                const voxels = getNonZeroVoxelsFromTile(tile);
                // Adjust coordinates based on position in output grid
                const shiftedVoxels = voxels.map(voxel => {
                    var voxelPixelVal = voxel[2];
                    const [[minX, minY, minZ], [maxX, maxY, maxZ]] = voxel;
                    return [[minX + i * tileWidth, minY + j * tileHeight, minZ + k * tileDepth],
                        [maxX + i * tileWidth, maxY + j * tileHeight, maxZ + k * tileDepth], voxelPixelVal];
                });
                allVoxels.push(...shiftedVoxels);
            }
        }
    }
    return allVoxels;
}


module.exports = {getNonZeroVoxelsFromTile, getNonZeroVoxelsFromTiles, Tile3D, tilesMatch3D_memoized, tilesMatch2D_memoized, tilesMatch3D, tilesMatch2D};//, generateHollowBox, generateBoxFace};