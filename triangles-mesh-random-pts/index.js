var normals = require("normals");
var Chance = require('chance');
var chance = new Chance();
var bc = require('barycentric-coordinates');
var trp = require('triangle-random-pts');
var ti = require('triangles-index');
var triArea = require('triangle-area-fast');

var _nplen = new Float32Array(1);
function normalizePt(pt){
    _nplen[0] = Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2]);
    return [pt[0]/_nplen[0],pt[1]/_nplen[0],pt[2]/_nplen[0]];
}

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function randomPtsNormalsForMesh(tris,numberPts){
    var trisIndexed = ti.indexTriangles_meshView(tris);
    return randomPtsNormalsForMeshIndexed(trisIndexed, numberPts, tris);
}

function randomPtsNormalsForMeshIndexed(bunny, numberPts=25, bunny_deIndexed=null){
    var tris = bunny_deIndexed || ti.deindexTriangles_meshView(bunny);

    var eps = 0.001;

    var totalPts = numberPts;

    var vertexNormals = normals.vertexNormals(bunny.cells, bunny.positions,eps).map(p=>normalizePt(p));
    var vertexNormals_perTri = bunny.cells.map(function(cell){
        return [
            vertexNormals[cell[0]],
            vertexNormals[cell[1]],
            vertexNormals[cell[2]]
        ];
    });

    tris=tris.map(function(t,i){
        t.index=i;
        return t;
    });

    var trisArea = tris.map(t=>triArea(t));
    var pts_w_normals = [];

    while(pts_w_normals.length<totalPts) {
        var randomTri = chance.weighted(tris,trisArea);
        var pt = trp.randomPointsInTriangle(randomTri,1)[0];
        var norms = vertexNormals_perTri[randomTri.index];
        var normAtPt = bc.triangleInterpolateNormals(pt, randomTri,  norms[0],norms[1],norms[2]);
        pts_w_normals.push({
            pt: pt, normal: normAtPt, normalLine: [pt,addPts(pt,normAtPt)], triangleIndex: randomTri.index //, len: lineLength([pt,addPts(pt,normAtPt)])
        })
    }

    //console.log(pts_w_normals);

    return pts_w_normals;
}

module.exports = {randomPtsNormalsForMeshIndexed, randomPtsNormalsForMesh};



