var tf = require('./tetra-funcs.js');
var lu = require('./line-utils-basic.js');
var mts = require('mesh-to-skeleton');
var tf = require('./tetra-funcs.js');

function averagePts4(p0, p1, p2, p3){
    return [(p0[0]+p1[0]+p2[0]+p3[0])/4, (p0[1]+p1[1]+p2[1]+p3[1])/4, (p0[2]+p1[2]+p2[2]+p3[2])/4];
}

function scaleTetra(tet,s){
    var center = averagePts4(...tet);
    var scaledPts = tet.map(function(pt){
        return lu.getPointAlongLine([center,pt],s);
    });
    return scaledPts;
}

function mesh2Tetrahedra(triangles, tetPercent=1.0, tetDist= 2.0, rescaleAmt=1.0){
    var skeletonPtsObjs = mts.getSkeletalPoints(triangles); //list of {pt: [x,y,z], dist: distanceToSurface, triangleIndex: i}
    var tetradehraPts4Sets = skeletonPtsObjs.map(function(row){
        var j = row.triangleIndex;
        var tc = lu.averagePts3(...triangles[j]);
        return [
            !tetPercent ? lu.getPointAlongLine_dist([tc,row.pt],Math.min(row.dist/2.0,tetDist)) :
                lu.getPointAlongLine([tc,row.pt],Math.min(row.dist/2.0,tetPercent)),
            triangles[j][0],
            triangles[j][1],
            triangles[j][2]
        ]
    });

    // var res = {tets: tetradehraPts4Sets /*, tetsTriangles */};
    //
    // if(getTetraTriangles){
    //     res.tetsTriangles = tetradehraPts4Sets.map(function(t4){
    //         return tf.tetraTrisWithFlips(t4);
    //     });
    // }

    if(rescaleAmt!=1.0){
        return tetradehraPts4Sets.map(tet=>scaleTetra(tet,rescaleAmt));
    }else{
        return tetradehraPts4Sets;
    }
}

var ti = require('triangles-index');
function meshIndexed2Tetrahedra(bunny, tetPercent, tetDist, rescaleAmt){
    return mesh2Tetrahedra(ti.deindexTriangles_meshView(bunny), tetPercent, tetDist, rescaleAmt);
}

module.exports = {
    meshIndexed2Tetrahedra,
    mesh2Tetrahedra,
    tetra2Triangles: tf.tetraTrisWithFlips,
    tetraNormalLines: tf.tetraNormalLines,
    triangleNormal: require('./triangle-normal.js')
};

//meshIndexed2Tetrahedra(require('bunny'));