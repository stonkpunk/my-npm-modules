function rebuildVertList(vertListFlat){
    var res = [];
    for(var i=0; i<vertListFlat.length; i+=3){
        res.push([
            vertListFlat[i],
            vertListFlat[i+1],
            vertListFlat[i+2],
        ])
    }
    return res;
}

function rebuildCellList(cellListFlat){ //same as rebuildVertList...
    var res=[];
    for(var i=0; i<cellListFlat.length; i+=3){
        res.push([
            cellListFlat[i],
            cellListFlat[i+1],
            cellListFlat[i+2],
        ])
    }
    return res;
}

function rebuildUVList(uvListFlat){
    var res=[];
    for(var i=0; i<uvListFlat.length; i+=2){
        res.push([
            uvListFlat[i],
            uvListFlat[i+1]
        ])
    }
    return res;
}

function rebuildTriangles(verts, cells, uvsPerVert){
    var res = {
        triangles: [],
        trianglesUvs: []
    };

    cells.forEach(function(cell){
        var theTri = [
            verts[cell[0]],
            verts[cell[1]],
            verts[cell[2]]
        ];
        var theTriUvs = [
            uvsPerVert[cell[0]],
            uvsPerVert[cell[1]],
            uvsPerVert[cell[2]]
        ];
        res.triangles.push(theTri);
        res.trianglesUvs.push(theTriUvs);
    });

    return res;
}

function uvs2TrianglesXZ(trisUvsList, scale = 10, y=0){
    //TODO bool add border outline
    var s = scale;
    return trisUvsList.map(function(triUvs){
        var a = triUvs[0];
        var b = triUvs[1];
        var c = triUvs[2];
        return [
            [a[0]*s,y,a[1]*s],
            [b[0]*s,y,b[1]*s],
            [c[0]*s,y,c[1]*s],
        ]
    })
}

module.exports = {
    rebuildVertList,
    rebuildCellList,
    rebuildUVList,
    rebuildTriangles,
    uvs2TrianglesXZ
}