var defaults = require('./default-options.js')
var defaultChartOptions = defaults.defaultChartOptions;
var defaultPackOptions = defaults.defaultPackOptions;

function generateAtlas(meshes, xatlas, chartOptions, packOptions, returnMeshes = true){
    //if(!this.loaded || !this.atlasCreated) throw "Create atlas first";
    if(meshes.length < 1) throw "Add meshes first";
    chartOptions = { ...defaultChartOptions(), ...chartOptions};
    packOptions = { ...defaultPackOptions(), ...packOptions };
    xatlas.generateAtlas(chartOptions, packOptions);
    if(!returnMeshes) return [];
    let returnVal = [];
    for (let {meshId, meshObj, vertices, normals, coords} of meshes){
        let ret = xatlas.getMeshData(meshId);

        //console.log("MESH DATA", ret);

        let index = new Uint16Array(xatlas.HEAPU32.subarray(ret.indexOffset/4, ret.indexOffset/4+ret.newIndexCount));
        let oldIndexes = new Uint16Array(xatlas.HEAPU32.subarray(ret.originalIndexOffset/4, ret.originalIndexOffset/4+ret.newVertexCount));
        let xcoords = new Float32Array(xatlas.HEAPF32.subarray(ret.uvOffset/4, ret.uvOffset/4+ret.newVertexCount*2));
        xatlas.destroyMeshData(ret);

        let vertex = {};
        vertex.vertices = new Float32Array(ret.newVertexCount * 3);
        vertex.coords1 = xcoords;
        if(normals)
            vertex.normals = new Float32Array(ret.newVertexCount * 3);
        if(coords)
            vertex.coords = new Float32Array(ret.newVertexCount * 2);
        else vertex.coords = vertex.coords1;


        for(let i =0, l=ret.newVertexCount; i<l; i++){
            let oldIndex = oldIndexes[i];
            vertex.vertices[3*i + 0] = vertices[3*oldIndex + 0];
            vertex.vertices[3*i + 1] = vertices[3*oldIndex + 1];
            vertex.vertices[3*i + 2] = vertices[3*oldIndex + 2];
            if(vertex.normals&&normals){
                vertex.normals[3*i + 0] = normals[3*oldIndex + 0];
                vertex.normals[3*i + 1] = normals[3*oldIndex + 1];
                vertex.normals[3*i + 2] = normals[3*oldIndex + 2];
            }
            if(vertex.coords&&coords){
                vertex.coords[2*i + 0] = coords[2*oldIndex + 0];
                vertex.coords[2*i + 1] = coords[2*oldIndex + 1];
            }
        }
        returnVal.push({index: index, vertex: vertex, mesh: meshObj})
    }
    return returnVal;
}

module.exports = {
    generateAtlas
};


// Generate an atlas (JS API)
// Create an empty atlas with createAtlas.
//     Add one or more meshes with addMesh.
//     Call generateAtlas. Meshes are segmented into charts, which are parameterized and packed into an atlas. The updated vertex and index buffers are returned along with the mesh object.
//     See source/web/index.js for complete API and example. The returned buffers are of different size than the inputs. Cleanup with destroyAtlas. This also does a leak check if enabled in build-web.sh. see line 40.

//see https://github.com/repalash/xatlas.js/blob/build_v1/source/web/index.js
//for example how to use .....

// createAtlas: [Function: createAtlas] { argCount: 0 },
// createMesh: [Function: createMesh] { argCount: 4 },
// createUvMesh: [Function: createUvMesh] { argCount: 2 },
// addMesh: [Function: addMesh] { argCount: 0 },
// addUvMesh: [Function: addUvMesh] { argCount: 0 },
// generateAtlas: [Function: generateAtlas] { argCount: 2 },
// computeCharts: [Function: computeCharts] { argCount: 1 },
// packCharts: [Function: packCharts] { argCount: 1 },
// getMeshData: [Function: getMeshData] { argCount: 1 },
// destroyAtlas: [Function: destroyAtlas] { argCount: 0 },
// destroyMeshData: [Function: destroyMeshData] { argCount: 1 },
// defaultChartOptions: [Function: defaultChartOptions] { argCount: 0 },
// defaultPackOptions: [Function: defaultPackOptions] { argCount: 0 },
// setProgressLogging: [Function: setProgressLogging] { argCount: 1 },
// doLeakCheck: [Function: doLeakCheck] { argCount: 0 }
