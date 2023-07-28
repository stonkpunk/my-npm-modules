//see original at https://threejs.org/manual/examples/voxel-geometry-culled-faces-ui.html
//in turn was originally at https://threejsfundamentals.org/threejs/lessons/threejs-voxel-geometry.html
//original is BSD license -- https://github.com/gfxfundamentals/threejsfundamentals/blob/master/LICENSE

function chunkArray(arr, chunkSize) {
    const chunkedArray = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        chunkedArray.push(chunk);
    }
    return chunkedArray;
}

class VoxelWorld {
    constructor(options = {}) { //default options = {cellSize:16, tileSize:32, tileTextureWidth:32, tileTextureHeight:32, payload: {}}
        this.cellIdToMesh = {};
        this.cellSize = options.cellSize || 16;

        //only used for uv's:
        this.tileSize = options.tileSize || 32;
        this.tileTextureWidth = options.tileTextureWidth || 32;
        this.tileTextureHeight = options.tileTextureHeight || 32;

        //each cell is block of cellSize^3 voxels
        const {cellSize} = this;
        this.cellSliceSize = cellSize * cellSize;
        this.cells = {};
        this.geometries = {};

        this.payload = options.payload || {}; //place for extra json data
    }
    computeVoxelOffset(x, y, z) {
        const {cellSize, cellSliceSize} = this;
        const voxelX = /*THREE.MathUtils.euclideanModulo(x, cellSize)*/( ( x % cellSize ) + cellSize ) % cellSize | 0;
        const voxelY = /*THREE.MathUtils.euclideanModulo(y, cellSize)*/( ( y % cellSize ) + cellSize ) % cellSize | 0;
        const voxelZ = /*THREE.MathUtils.euclideanModulo(z, cellSize)*/( ( z % cellSize ) + cellSize ) % cellSize | 0;
        return voxelY * cellSliceSize +
            voxelZ * cellSize +
            voxelX;
    }
    computeCellId(x, y, z) {
        const {cellSize} = this;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellZ = Math.floor(z / cellSize);
        return `${cellX},${cellY},${cellZ}`;
    }
    addCellForVoxel(x, y, z) {
        const cellId = this.computeCellId(x, y, z);
        let cell = this.cells[cellId];
        if (!cell) {
            const {cellSize} = this;
            cell = new Uint8Array(cellSize * cellSize * cellSize);
            this.cells[cellId] = cell;
        }
        return cell;
    }
    getCellForVoxel(x, y, z) {
        return this.cells[this.computeCellId(x, y, z)];
    }
    setVoxel(x, y, z, v, addCell = true) {
        let cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            if (!addCell) {
                return;
            }
            cell = this.addCellForVoxel(x, y, z);
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        cell[voxelOffset] = v;
    }
    getVoxel(x, y, z) {
        const cell = this.getCellForVoxel(x, y, z);
        if (!cell) {
            return 0;
        }
        const voxelOffset = this.computeVoxelOffset(x, y, z);
        return cell[voxelOffset];
    }
    generateGeometryDataForCell(cellX, cellY, cellZ) {
        const {cellSize, tileSize, tileTextureWidth, tileTextureHeight} = this;
        const positions = [];
        const normals = [];
        const uvs = [];
        const indices = [];
        const startX = cellX * cellSize;
        const startY = cellY * cellSize;
        const startZ = cellZ * cellSize;

        for (let y = 0; y < cellSize; ++y) {
            const voxelY = startY + y;
            for (let z = 0; z < cellSize; ++z) {
                const voxelZ = startZ + z;
                for (let x = 0; x < cellSize; ++x) {
                    const voxelX = startX + x;
                    const voxel = this.getVoxel(voxelX, voxelY, voxelZ);
                    if (voxel) {
                        // voxel 0 is sky (empty) so for UVs we start at 0
                        const uvVoxel = voxel - 1;
                        // There is a voxel here but do we need faces for it?
                        for (const {dir, corners, uvRow} of VoxelWorld.faces) {
                            const neighbor = this.getVoxel(
                                voxelX + dir[0],
                                voxelY + dir[1],
                                voxelZ + dir[2]);
                            if (!neighbor) {
                                // this voxel has no neighbor in this direction so we need a face.
                                const ndx = positions.length / 3;
                                for (const {pos, uv} of corners) {
                                    positions.push(pos[0] + x, pos[1] + y, pos[2] + z);
                                    normals.push(...dir);
                                    uvs.push(
                                        (uvVoxel +   uv[0]) * tileSize / tileTextureWidth,
                                        1 - (uvRow + 1 - uv[1]) * tileSize / tileTextureHeight);
                                }
                                indices.push(
                                    ndx, ndx + 1, ndx + 2,
                                    ndx + 2, ndx + 1, ndx + 3,
                                );
                            }
                        }
                    }
                }
            }
        }

        return {
            positions,
            normals,
            uvs,
            indices,
        };
    }

    generateGeometryDataForCell_meshView(cellX, cellY, cellZ) {
        var res = this.generateGeometryDataForCell(cellX, cellY, cellZ);
        return {
            cells:  chunkArray(res.indices,3),
            positions: chunkArray(res.positions,3),
            normals: chunkArray(res.normals,3),
            uvs: chunkArray(res.uvs,2),
        };
    }

    // from
    // https://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.42.3443&rep=rep1&type=pdf
    intersectRay(start, end) {
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let dz = end.z - start.z;
        const lenSq = dx * dx + dy * dy + dz * dz;
        const len = Math.sqrt(lenSq);

        dx /= len;
        dy /= len;
        dz /= len;

        let t = 0.0;
        let ix = Math.floor(start.x);
        let iy = Math.floor(start.y);
        let iz = Math.floor(start.z);

        const stepX = (dx > 0) ? 1 : -1;
        const stepY = (dy > 0) ? 1 : -1;
        const stepZ = (dz > 0) ? 1 : -1;

        const txDelta = Math.abs(1 / dx);
        const tyDelta = Math.abs(1 / dy);
        const tzDelta = Math.abs(1 / dz);

        const xDist = (stepX > 0) ? (ix + 1 - start.x) : (start.x - ix);
        const yDist = (stepY > 0) ? (iy + 1 - start.y) : (start.y - iy);
        const zDist = (stepZ > 0) ? (iz + 1 - start.z) : (start.z - iz);

        // location of nearest voxel boundary, in units of t
        let txMax = (txDelta < Infinity) ? txDelta * xDist : Infinity;
        let tyMax = (tyDelta < Infinity) ? tyDelta * yDist : Infinity;
        let tzMax = (tzDelta < Infinity) ? tzDelta * zDist : Infinity;

        let steppedIndex = -1;

        // main loop along raycast vector
        while (t <= len) {
            const voxel = this.getVoxel(ix, iy, iz);
            if (voxel) {
                return {
                    position: [
                        start.x + t * dx,
                        start.y + t * dy,
                        start.z + t * dz,
                    ],
                    normal: [
                        steppedIndex === 0 ? -stepX : 0,
                        steppedIndex === 1 ? -stepY : 0,
                        steppedIndex === 2 ? -stepZ : 0,
                    ],
                    voxel,
                };
            }

            // advance t to next nearest voxel boundary
            if (txMax < tyMax) {
                if (txMax < tzMax) {
                    ix += stepX;
                    t = txMax;
                    txMax += txDelta;
                    steppedIndex = 0;
                } else {
                    iz += stepZ;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            } else {
                if (tyMax < tzMax) {
                    iy += stepY;
                    t = tyMax;
                    tyMax += tyDelta;
                    steppedIndex = 1;
                } else {
                    iz += stepZ;
                    t = tzMax;
                    tzMax += tzDelta;
                    steppedIndex = 2;
                }
            }
        }
        return null;
    }

    generateWorld(){
        var cellSize = this.cellSize;
        for (let y = 0; y < cellSize; ++y) {
            for (let z = 0; z < cellSize; ++z) {
                for (let x = 0; x < cellSize; ++x) {
                    const height = (Math.sin(x / cellSize * Math.PI * 2) + Math.sin(z / cellSize * Math.PI * 3)) * (cellSize / 6) + (cellSize / 2);
                    if (y < height) {
                        this.setVoxel(x, y, z, 1);//randInt(1, 17));
                    }
                }
            }
        }
    }

    updateCellGeometry(x, y, z) {
        const world = this;
        const cellSize = this.cellSize;
        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);
        const cellZ = Math.floor(z / cellSize);
        const cellId = world.computeCellId(x, y, z);
        let mesh = this.cellIdToMesh[cellId];
        const geometry = mesh ? mesh.geometry : {
            positions: [],
            normals: [],
            uvs: [],
            indices: []
        };

        const { positions, normals, uvs, indices } = world.generateGeometryDataForCell(cellX, cellY, cellZ);
        geometry.positions = positions;
        geometry.normals = normals;
        geometry.uvs = uvs;
        geometry.indices = indices;

        if (!mesh) {
            mesh = {
                geometry,
                position: { x: cellX * cellSize, y: cellY * cellSize, z: cellZ * cellSize },
                name: cellId
            };
            this.cellIdToMesh[cellId] = mesh;
            // Add the mesh to the scene or perform any other required operations
        }
    }

    cloneCell(_x,_y,_z, stringifyPayload=true){ //clone the cell at position x,y,z, as a new voxelworld instance, with the cell shifted to the origin
        const clonedVW = new VoxelWorld({cellSize:this.cellSize, tileSize:this.tileSize, tileTextureWidth:this.tileTextureWidth, tileTextureHeight:this.tileTextureHeight, payload:stringifyPayload ? JSON.parse(JSON.stringify(this.payload)) : this.payload});

        const cellSize = this.cellSize;
        const cellX = Math.floor(_x / cellSize);
        const cellY = Math.floor(_y / cellSize);
        const cellZ = Math.floor(_z / cellSize);

        const ox = Math.floor(_x / cellSize) * cellSize;
        const oy = Math.floor(_y / cellSize) * cellSize;
        const oz = Math.floor(_z / cellSize) * cellSize;

        for (let x = ox; x < ox+this.cellSize; x++) {
            for (let y = oy; y < oy+this.cellSize; y++) {
                for (let z = oz; z < oz+this.cellSize; z++) {
                    var valueHere = this.getVoxel(x,y,z);
                    clonedVW.setVoxel(x-ox, y-oy, z-oz, valueHere);
                }
            }
        }

        return clonedVW;
    }
}

VoxelWorld.faces = [
    { // left
        uvRow: 0,
        dir: [ -1,  0,  0, ],
        corners: [
            { pos: [ 0, 1, 0 ], uv: [ 0, 1 ], },
            { pos: [ 0, 0, 0 ], uv: [ 0, 0 ], },
            { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
            { pos: [ 0, 0, 1 ], uv: [ 1, 0 ], },
        ],
    },
    { // right
        uvRow: 0,
        dir: [  1,  0,  0, ],
        corners: [
            { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 1, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 1, 1 ], },
            { pos: [ 1, 0, 0 ], uv: [ 1, 0 ], },
        ],
    },
    { // bottom
        uvRow: 1,
        dir: [  0, -1,  0, ],
        corners: [
            { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
            { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 0, 0 ], uv: [ 1, 1 ], },
            { pos: [ 0, 0, 0 ], uv: [ 0, 1 ], },
        ],
    },
    { // top
        uvRow: 2,
        dir: [  0,  1,  0, ],
        corners: [
            { pos: [ 0, 1, 1 ], uv: [ 1, 1 ], },
            { pos: [ 1, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 0, 1, 0 ], uv: [ 1, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 0, 0 ], },
        ],
    },
    { // back
        uvRow: 0,
        dir: [  0,  0, -1, ],
        corners: [
            { pos: [ 1, 0, 0 ], uv: [ 0, 0 ], },
            { pos: [ 0, 0, 0 ], uv: [ 1, 0 ], },
            { pos: [ 1, 1, 0 ], uv: [ 0, 1 ], },
            { pos: [ 0, 1, 0 ], uv: [ 1, 1 ], },
        ],
    },
    { // front
        uvRow: 0,
        dir: [  0,  0,  1, ],
        corners: [
            { pos: [ 0, 0, 1 ], uv: [ 0, 0 ], },
            { pos: [ 1, 0, 1 ], uv: [ 1, 0 ], },
            { pos: [ 0, 1, 1 ], uv: [ 0, 1 ], },
            { pos: [ 1, 1, 1 ], uv: [ 1, 1 ], },
        ],
    },
];

module.exports = {VoxelWorld} ;