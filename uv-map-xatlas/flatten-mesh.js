module.exports = function(bunny) {
    var resVerts = new Float32Array( bunny.positions.length*3);
    var resIndexes = new Uint16Array(bunny.cells.length*3);

    for(var i=0; i<bunny.cells.length;i++){
        resIndexes[i*3+0] = bunny.cells[i][0];
        resIndexes[i*3+1] = bunny.cells[i][1];
        resIndexes[i*3+2] = bunny.cells[i][2];
    }

    for(var i=0; i<bunny.positions.length;i++){
        resVerts[i*3+0] = bunny.positions[i][0];
        resVerts[i*3+1] = bunny.positions[i][1];
        resVerts[i*3+2] = bunny.positions[i][2];
    }

    return {
        indexes: resIndexes,
        vertices: resVerts
    }
}
