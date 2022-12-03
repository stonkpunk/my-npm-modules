function aabb2LinesEdges(aabb){
    //check edges (12) ...
    var s0 = aabb[0];
    var s1 = aabb[1];
    var topEdge0 = [[s0[0],s0[1],s0[2]],[s0[0],s0[1],s1[2]]];
    var topEdge1 = [[s0[0],s0[1],s1[2]],[s1[0],s0[1],s1[2]]];
    var topEdge2 = [[s1[0],s0[1],s1[2]],[s1[0],s0[1],s0[2]]];
    var topEdge3 = [[s1[0],s0[1],s0[2]],[s0[0],s0[1],s0[2]]];

    var botEdge0 = [[s0[0],s1[1],s0[2]],[s0[0],s1[1],s1[2]]];
    var botEdge1 = [[s0[0],s1[1],s1[2]],[s1[0],s1[1],s1[2]]];
    var botEdge2 = [[s1[0],s1[1],s1[2]],[s1[0],s1[1],s0[2]]];
    var botEdge3 = [[s1[0],s1[1],s0[2]],[s0[0],s1[1],s0[2]]];

    var sideEdge0 = [[s0[0],s0[1],s0[2]],[s0[0],s1[1],s0[2]]];
    var sideEdge1 = [[s0[0],s0[1],s1[2]],[s0[0],s1[1],s1[2]]];
    var sideEdge2 = [[s1[0],s0[1],s1[2]],[s1[0],s1[1],s1[2]]];
    var sideEdge3 = [[s1[0],s0[1],s0[2]],[s1[0],s1[1],s0[2]]];

    var listOfEdges = [
        topEdge0, topEdge1, topEdge2, topEdge3,
        botEdge0, botEdge1, botEdge2, botEdge3,
        sideEdge0, sideEdge1, sideEdge2, sideEdge3,
    ];

    return listOfEdges;
}

function jitterPt(pt, S=0.2){ //pt = [x,y,z];
    return [pt[0]+Math.random()*S-S/2,pt[1]+Math.random()*S-S/2,pt[2]+Math.random()*S-S/2];
}

function addBoundingBoxLinesToMesh(bunny){
    var bb = meshBoundingBox(bunny);
    var bbEdges = aabb2LinesEdges(bb);
    bbEdges.forEach(function(line){
        //add 2 degenerate triangles as edge line

        var currentPosition = bunny.positions.length+0;
        var newPts = [jitterPt(line[0]),line[0],line[1]]
        bunny.positions.push(...newPts);
        bunny.cells.push([currentPosition, currentPosition+1, currentPosition+2]);

        currentPosition = bunny.positions.length+0;
        newPts = [jitterPt(line[1]),line[1],line[0]]
        bunny.positions.push(...newPts);
        bunny.cells.push([currentPosition, currentPosition+1, currentPosition+2]);
    })
}

function boundingBoxOfPts(sop){
    var bb = [sop[0],sop[0]];
    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        var xLo = Math.min(p[0],bb[0][0]);
        var xHi = Math.max(p[0],bb[1][0]);
        var yLo = Math.min(p[1],bb[0][1]);
        var yHi = Math.max(p[1],bb[1][1]);
        var zLo = Math.min(p[2],bb[0][2]);
        var zHi = Math.max(p[2],bb[1][2]);
        bb = [[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }
    return bb;
};

function addPts(a, b){ //pt = [x,y,z];
    return [a[0]+b[0],a[1]+b[1],a[2]+b[2]];
}

function scalePt(pt, s){ //pt = [x,y,z];
    return [pt[0]*s,pt[1]*s,pt[2]*s];
}

function distortionObjFromAABB(aabb){
    return {
        p000: [aabb[0][0], aabb[0][1], aabb[0][2]], //lower xyz corner
        p001: [aabb[0][0], aabb[0][1], aabb[1][2]],
        p010: [aabb[0][0], aabb[1][1], aabb[0][2]],
        p011: [aabb[0][0], aabb[1][1], aabb[1][2]],
        p100: [aabb[1][0], aabb[0][1], aabb[0][2]],
        p101: [aabb[1][0], aabb[0][1], aabb[1][2]],
        p110: [aabb[1][0], aabb[1][1], aabb[0][2]],
        p111: [aabb[1][0], aabb[1][1], aabb[1][2]], //upper xyz corner
    }
}

function distortionObjUnit(){
    var aabb = [[0,0,0],[1,1,1]]
    return {
        p000: [aabb[0][0], aabb[0][1], aabb[0][2]], //lower xyz corner
        p001: [aabb[0][0], aabb[0][1], aabb[1][2]],
        p010: [aabb[0][0], aabb[1][1], aabb[0][2]],
        p011: [aabb[0][0], aabb[1][1], aabb[1][2]],
        p100: [aabb[1][0], aabb[0][1], aabb[0][2]],
        p101: [aabb[1][0], aabb[0][1], aabb[1][2]],
        p110: [aabb[1][0], aabb[1][1], aabb[0][2]],
        p111: [aabb[1][0], aabb[1][1], aabb[1][2]], //upper xyz corner
    }
}

function distortionObjFromMesh(bunny){
    return distortionObjFromAABB(meshBoundingBox(bunny));
}

function meshBoundingBox(bunny){
    return boundingBoxOfPts(bunny.positions);
}

//https://en.wikipedia.org/wiki/Trilinear_interpolation - also check out alt linear system
function distortPtTrilinear(ptToDistort, containingAABB, distortedSectorObj){
    var s = containingAABB;
    var xp = (ptToDistort[0]-s[0][0])/(s[1][0]-s[0][0]);
    var yp = (ptToDistort[1]-s[0][1])/(s[1][1]-s[0][1]);
    var zp = (ptToDistort[2]-s[0][2])/(s[1][2]-s[0][2]);
    var dso = distortedSectorObj;
    var c00 = addPts(scalePt(dso.p000,1-xp),scalePt(dso.p100,xp));//dso.p000*(1-xp)+dso.p100;
    var c01 = addPts(scalePt(dso.p001,1-xp),scalePt(dso.p101,xp));//dso.p001*(1-xp)+dso.p101;
    var c10 = addPts(scalePt(dso.p010,1-xp),scalePt(dso.p110,xp));//dso.p010*(1-xp)+dso.p110;
    var c11 = addPts(scalePt(dso.p011,1-xp),scalePt(dso.p111,xp));//dso.p011*(1-xp)+dso.p111;
    var c0 = addPts(scalePt(c00,1-yp),scalePt(c10,yp));//c00*(1-yp)+c10*yp;
    var c1 = addPts(scalePt(c01,1-yp),scalePt(c11,yp));//c01*(1-yp)+c11*yp;
    var c = addPts(scalePt(c0,1-zp),scalePt(c1,zp));//c0*(1-zp)+c1*zp;
    return c;
}

function distortPtsTrilinear(ptsToDistort, containingAABB, distortedSectorObj){
    return ptsToDistort.map(pt=>distortPtTrilinear(pt, containingAABB, distortedSectorObj));
}

function distortMeshInPlace(bunnyOrig, distortionObj){
    var bb = meshBoundingBox(bunnyOrig);
    for(var i=0;i<bunnyOrig.positions.length;i++){
        bunnyOrig.positions[i] = distortPtTrilinear(bunnyOrig.positions[i],bb,distortionObj);
    }
}

function distortedMeshCopy(bunnyOrig, distortionObj){
    var bb = meshBoundingBox(bunnyOrig);
    return {
        cells: bunnyOrig.cells.map(c=>[c[0]+0,c[1]+0,c[2]+0]),
        positions: distortPtsTrilinear(bunnyOrig.positions, bb, distortionObj)
    }
}

function randomPt(s){
    return [Math.random()*s-s/2,Math.random()*s-s/2,Math.random()*s-s/2]
}

function jitterDistortionObjectInPlace(distortionObj,s=0.5){
    for(var corner in distortionObj){
        distortionObj[corner] = addPts(randomPt(s),distortionObj[corner]);
    }
    return distortionObj;
}

function jitterDistortionObjectCopy(distortionObj,s=0.5){
    var doc = JSON.parse(JSON.stringify(distortionObj)); //todo faster copy
    for(var corner in doc){
        doc[corner] = addPts(randomPt(s),distortionObj[corner]);
    }
    return doc;
}

module.exports = {meshBoundingBox, boundingBoxOfPts, addBoundingBoxLinesToMesh, jitterDistortionObjectInPlace, jitterDistortionObjectCopy, distortionObjUnit, distortionObjFromAABB, distortionObjFromMesh, distortPtTrilinear, distortPtsTrilinear, distortMeshInPlace, distortedMeshCopy};