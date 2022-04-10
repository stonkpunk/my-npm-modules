function lineLength2(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return (a*a+b*b+c*c);
};

//note -- without depth buffer / painters also, this fails for the base of the skirt of generate-heightmap-mesh
//sorting using farest pt on each tri -- dist desc
function triangles_pigeonHoleSort(tris,cameraPt){
    var trisPerDist = [];
    var slots = 10000;
    var slotScale = 10.0;
    for(var i=0; i<slots; i++){
        trisPerDist.push([]);
    }

    for(var i=0; i<tris.length; i++){
        var tri = tris[i];

        var d0 = lineLength2([cameraPt, tri[0]]);
        var d1 = lineLength2([cameraPt, tri[1]]);
        var d2 = lineLength2([cameraPt, tri[2]]);
        var dMax = Math.sqrt((Math.max(d0,d1,d2)));

        var dist = Math.floor(dMax*slotScale);
        tri.dist = dMax;
        trisPerDist[Math.min(slots-1, dist*slotScale)].push(tri);
    }

    // var t0 = Date.now();
    // var sorted = tris.sort(function(a,b){return b.dist-a.dist});
    //
    // return sorted;
    //
    // console.log('sort',Date.now()-t0);

    //var t1=Date.now();
    var trisSorted = []; //sort by dist asc
    for(var i=0; i<slots; i++){
        var t = trisPerDist[i];
        for(var j=0;j<t.length;j++){
            trisSorted.push(t[j]);
        }
    }

    trisSorted.reverse();
    //console.log('sort2',Date.now()-t1);
    return trisSorted;
    //return trisSorted;
}

module.exports = triangles_pigeonHoleSort;