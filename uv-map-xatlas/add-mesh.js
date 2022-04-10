function addMesh(xatlas, flatIndex, DO_LOG_PROGRESS=false){
    var scale = 1;

    var meshDesc = xatlas.createMesh(flatIndex.vertices.length/3, flatIndex.indexes.length, false, false);//, normals != null && useNormals, coords != null && useCoords)

    xatlas.setProgressLogging(DO_LOG_PROGRESS);

    xatlas.HEAPU16.set(flatIndex.indexes, meshDesc.indexOffset/2);

    let vs = new Float32Array([...flatIndex.vertices]);
    if(scale!==1) {
        if(typeof scale === "number") scale = [scale, scale, scale]
        for (let i = 0, l = vs.length; i < l; i+=3) {
            vs[i] *= scale[0];
            vs[i+1] *= scale[1];
            vs[i+2] *= scale[2];
        }
    }

    xatlas.HEAPF32.set(vs, meshDesc.positionOffset/4);
    //if(normals != null && useNormals) this.xatlas.HEAPF32.set(normals, meshDesc.normalOffset/4);
    //if(coords != null && useCoords) this.xatlas.HEAPF32.set(coords, meshDesc.uvOffset/4);
    var addMeshRes = xatlas.addMesh();

    if(addMeshRes !== 0) {
        console.log("Error adding mesh: ", addMeshRes);
        return null;
    }

    //var r2 = addMeshRes;

    let ret = {
        meshId: meshDesc.meshId,
        //meshObj: meshObj,
        vertices: flatIndex.vertices,
        normals: /*normals ||*/ null,
        indexes: /*normals ||*/ null,
        coords: /*coords ||*/ null,
    };

    //onMeshAdded(ret);
    return ret;
}

module.exports = {addMesh}