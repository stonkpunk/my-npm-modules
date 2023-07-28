//note the voxel world stores data in "cells" -- each cell is a cube-shaped block of voxels of size cellSize^3
//tileSize, tileTextureWidth, tileTextureHeight are used for uv mapping only

var VoxelWorld = require('./index.js').VoxelWorld;
//default options = {cellSize:16, tileSize:32, tileTextureWidth:32, tileTextureHeight:32}
var voxWorld = new VoxelWorld(/*options*/);
voxWorld.generateWorld();

//computeVoxelOffset(x, y, z)
//computeCellId(x, y, z)
//addCellForVoxel(x, y, z)
//getCellForVoxel(x, y, z)
//setVoxel(x, y, z, v, addCell = true)
//getVoxel(x, y, z)
//generateGeometryDataForCell(cellX, cellY, cellZ)
//generateGeometryDataForCell_meshView(cellX, cellY, cellZ)
//intersectRay(start, end) //takes pts {x,y,z}
//generateWorld()
//updateCellGeometry(x, y, z)

//get geom for first 'cell' (eg block of voxels)
var geom = voxWorld.generateGeometryDataForCell_meshView(0,0,0);

//generateGeometryDataForCell_meshView returns
//     {
//         cells:  chunkArray(res.indices,3),
//         positions: chunkArray(res.positions,3),
//         normals: chunkArray(res.normals,3),
//         uvs: chunkArray(res.uvs,2),
//     };

//generateGeometryDataForCell returns
//     {
//         positions, //flat array for each
//         normals,
//         uvs,
//         indices,
//     }

var art = require('ascii-raytracer');

var triangles = require('triangles-index').deindexTriangles_meshView(geom).map(function(t){
    t.color = [Math.random(),Math.random(),Math.random()]; //random colors
    return t;
})

var config = {
    triangles: triangles,
    resolution: 64,
    aspectRatio: 1.0,
    cameraMode:1,
    screenShotScaleUp: 8
}

art.runScene(config);