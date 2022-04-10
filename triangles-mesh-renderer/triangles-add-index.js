function addIndexToTriangles(tris){
    var l = tris.length;
    for(var i=0;i<l;i++){
        tris[i].i=i;
    }
    // tris = tris.map(function(tri,i){
    //     tri.i=i;
    //     return tri;
    // });
    return tris;
}

module.exports = addIndexToTriangles;