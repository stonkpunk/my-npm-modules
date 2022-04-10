//MIT LICENSE --- SEE LICENSES-MIT.txt

var wasmBuffer2 = require('./xatlas_web.js');

var generateAtlas = require('./generate-atlas.js').generateAtlas;
var addMesh = require('./add-mesh.js').addMesh;
var flattenMesh = require('./flatten-mesh.js');

var ti = require('triangles-index');

var XATLAS = null;

function atlasForTriangles(tris,cbRes){
    var indexed = ti.indexTriangles_meshView(tris);
    atlasForIndexedTriangles(indexed,cbRes);
}

var DO_LOG_PROGRESS = true;
function atlasForIndexedTriangles(bunny, cbRes){

    function onGotXAtlas(xatlas){
        XATLAS = xatlas;

        xatlas.createAtlas();
        meshes.push(addMesh(xatlas, flatIndex, DO_LOG_PROGRESS));

        var atlasRes = generateAtlas(meshes, xatlas);

        //console.log(atlasRes);
        //console.log(atlasRes[0].vertex);

        var destroyRes = xatlas.destroyAtlas();

        //console.log('destroy',destroyRes); //undef

        cbRes(atlasRes);
    }

    var meshes = [];
    var flattened = flattenMesh(bunny)

    var flatIndex = {
        indexes: flattened.indexes,//new Uint16Array(bunny.cells.length*3),
        vertices: flattened.vertices//new Float32Array( bunny.positions.length*3)
    }

    if(XATLAS){
        onGotXAtlas(XATLAS)
    }else{
        wasmBuffer2().then(onGotXAtlas);
    }
}

var at = require('./atlas-tools.js');
function atlasToVertList(atlasRow){
    return at.rebuildVertList(atlasRow.vertex.vertices);///res[0].vertex.vertices)
}
function atlasToCellList(atlasRow){
    return at.rebuildCellList(atlasRow.index);
}
function atlasToUVList(atlasRow){
    return  at.rebuildUVList(atlasRow.vertex.coords);
}

function atlasToTrianglesObjsList(atlasRow){
    var positions = atlasToVertList(atlasRow); //unique verts [x,y,z]
    var cells = atlasToCellList(atlasRow); //cell per triangle [a,b,c]
    var uvs = atlasToUVList(atlasRow); //uv per unique vert, each [u,v]
    var trianglesObj = at.rebuildTriangles(positions, cells, uvs);
    var triangles = trianglesObj.triangles; //triangles in 3d
    var trianglesUVs = trianglesObj.trianglesUvs; //triplets of uv coords, per-triangle
    var trianglesUVPreview = at.uvs2TrianglesXZ(trianglesUVs); //3d triangles in 2d, to show UV layout
    return {
        positions, //unique verts [x,y,z]
        cells, //cell per triangle [a,b,c]
        uvs, //uv per unique vert, each [u,v]
        triangles, //triangles in 3d
        trianglesUVs, //triplets of uv coords, per-triangle
        trianglesUVPreview //3d triangles in 2d, to show UV layout
    }
}

module.exports = {
    atlasToUVList,
    atlasToVertList,
    atlasToCellList,
    atlasToTrianglesObjsList,
    atlasForIndexedTriangles,
    atlasForTriangles
}


