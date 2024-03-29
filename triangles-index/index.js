function indexTriangles(tris){
    var posMap = {};
    function hashBy100(v){return Math.floor(v*100);}
    function hashPos(pt){return `${hashBy100(pt[0])}_${hashBy100(pt[1])}_${hashBy100(pt[2])}`}
    var index=0;
    var cells=[];
    var pts=[];
    tris.forEach(function(tri){
        var h0 = hashPos(tri[0]);
        var h1 = hashPos(tri[1]);
        var h2 = hashPos(tri[2]);
        if(!posMap[h0]){posMap[h0] = {pos: tri[0], index: index}; index++; pts.push(tri[0]);}
        if(!posMap[h1]){posMap[h1] = {pos: tri[1], index: index}; index++; pts.push(tri[1]);}
        if(!posMap[h2]){posMap[h2] = {pos: tri[2], index: index}; index++; pts.push(tri[2]);}
        cells.push([posMap[h0].index, posMap[h1].index, posMap[h2].index]);
    });
    return {cells: cells, pts: pts}
}

function deIndexTriangles(index){
    var ptsIndexName = "pts";
    return index.cells.map(function(cell){
        return [
            index[ptsIndexName][cell[0]],
            index[ptsIndexName][cell[1]],
            index[ptsIndexName][cell[2]]
        ]
    });
}

function indexTriangles_meshView(tris){
    var res = indexTriangles(tris);
    return {
        cells: res.cells,
        positions: res.pts
    }
}

function deindexTriangles_meshView(index){
    var _index = {cells: index.cells, pts: index.positions};
    return deIndexTriangles(_index);
}

function demergeMeshTriangles_meshView(bunny){
    var tris = deindexTriangles_meshView(bunny);
    var newMesh = {
        cells: [],
        positions: []
    }
    tris.forEach(function(t,i){
        newMesh.cells.push([i*3,i*3+1,i*3+2]);
        newMesh.positions.push(t[0],t[1],t[2]);
    });
    return newMesh;
}

function demergeMeshTriangles(bunny){
    var tris = deindexTriangles_meshView(bunny);
    var newMesh = {
        cells: [],
        pts: []
    }
    tris.forEach(function(t,i){
        newMesh.cells.push([i*3,i*3+1,i*3+2]);
        newMesh.pts.push(t[0],t[1],t[2]);
    });
    return newMesh;
}

module.exports = {indexTriangles, deIndexTriangles, indexTriangles_meshView, deindexTriangles_meshView, demergeMeshTriangles, demergeMeshTriangles_meshView};