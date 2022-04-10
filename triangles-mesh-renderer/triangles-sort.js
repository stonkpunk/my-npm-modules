function lineLength2(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return (a*a+b*b+c*c);
};

//note -- without depth buffer / painters also, this fails for the base of the skirt of generate-heightmap-mesh
//sorting using farest pt on each tri -- dist desc
function triangles_sort(tris,cameraPt){

    for(var i=0; i<tris.length; i++){
        var tri = tris[i];
        var d0 = lineLength2([cameraPt, tri[0]]);
        var d1 = lineLength2([cameraPt, tri[1]]);
        var d2 = lineLength2([cameraPt, tri[2]]);
        var dMax = Math.max(d0,d1,d2);
        tri.dist = dMax;
    }

    var sorted = tris.sort(function(a,b){return b.dist-a.dist});

    return sorted;
}

module.exports = triangles_sort;