const lu = require("./lines-utils");

function sectorGetFacesSectors(s, thickness=0.1){//[LoX, HiX, LoY, HiY, LoZ, HiZ];
    var t = thickness;
    var s0 = s[0];
    var s1 = s[1];
    var LoX = [[s0[0]-t,s0[1],s0[2]],[s0[0],s1[1],s1[2]]];
    var HiX = [[s1[0],s0[1],s0[2]],[s1[0]+t,s1[1],s1[2]]];

    var LoY = [[s0[0],s0[1]-t,s0[2]],[s1[0],s0[1],s1[2]]];
    var HiY = [[s0[0],s1[1],s0[2]],[s1[0],s1[1]+t,s1[2]]];

    var LoZ = [[s0[0],s0[1],s0[2]-t],[s1[0],s1[1],s0[2]]];
    var HiZ = [[s0[0],s0[1],s1[2]],[s1[0],s1[1],s1[2]+t]];
    return [LoX, HiX, LoY, HiY, LoZ, HiZ];
}

function trianglesBounds(tris){
    var pts=[];
    for(var i=0;i<tris.length;i++){
        pts.push(tris[i][0]);
        pts.push(tris[i][1]);
        pts.push(tris[i][2]);
    }
    return lu.boundingBlockOfPts(pts);
}

function generateSkyBoxTriangles(tris){

    var s = trianglesBounds(tris);

    var secsGroups = sectorGetFacesSectors(s).map(sector2Triangles);
    var tris = [].concat(...secsGroups);
    return tris;
}

function sector2Triangles(s){
    var d = {
        p000: [s[0][0], s[0][1], s[0][2]],
        p001: [s[0][0], s[0][1], s[1][2]],
        p010: [s[0][0], s[1][1], s[0][2]],
        p011: [s[0][0], s[1][1], s[1][2]],
        p100: [s[1][0], s[0][1], s[0][2]],
        p101: [s[1][0], s[0][1], s[1][2]],
        p110: [s[1][0], s[1][1], s[0][2]],
        p111: [s[1][0], s[1][1], s[1][2]],
    }
    var tris = [
        [d.p010, d.p001, d.p000], //xlo 0
        [d.p010, d.p011, d.p001], //xlo 1
        [d.p111, d.p100, d.p101], //xhi 0
        [d.p111, d.p110, d.p100], //xhi 1
        [d.p001, d.p100, d.p000], //ylo 0
        [d.p001, d.p101, d.p100], //ylo 1
        [d.p111, d.p010, d.p110], //yhi 0
        [d.p111, d.p011, d.p010], //yhi 1
        [d.p110, d.p000, d.p100], //zlo 0
        [d.p110, d.p010, d.p000], //zlo 1
        [d.p011, d.p101, d.p001], //zhi 0
        [d.p011, d.p111, d.p101]  //zhi 1
    ];

    return tris;
}
