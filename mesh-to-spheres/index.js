var mts = require('mesh-to-skeleton');
var _ = require('underscore');
var ti = require('triangles-index');
var lu = require('./line-utils-basic.js');
var tdf = require('triangles-distance-fast');
var dfu = require('./distance-function-utils.js');

function meshIndexed2Spheres(bunny, overlap=0.0, preShrink=1.0, doBruteForceMode=false, doResample=false, resamplePtsTotal=1000) {
    return mesh2Spheres(ti.deindexTriangles_meshView(bunny), overlap, preShrink, doBruteForceMode, doResample, resamplePtsTotal);
}

function mesh2Spheres(triangles, overlap=0.5, preShrink=1.0, doBruteForceMode=false, doResample=false, resamplePtsTotal=1000){

    //var triangles = ti.deindexTriangles_meshView(bunny);
    var skeletonPtsObjs = doResample ? mts.getSkeletalPoints_resampled(triangles, resamplePtsTotal) : mts.getSkeletalPoints(triangles); //list of {pt: [x,y,z], dist: distanceToSurface}
    var trisRTree = tdf.triangles2RTree(triangles);

    if(doBruteForceMode) {
        skeletonPtsObjs=skeletonPtsObjs.map(function(sko){
            sko.dist = Math.min(sko.dist, tdf.trianglesDistanceBruteForce(sko.pt, triangles))
            return sko;
        });
    }else{
        skeletonPtsObjs=skeletonPtsObjs.map(function(sko){
            sko.dist = Math.min(sko.dist, tdf.trianglesDistanceStable(sko.pt, triangles, trisRTree, 0.10))
            return sko;
        });
    }

    skeletonPtsObjs=skeletonPtsObjs.map(function(sko){
        sko.dist *=preShrink;
        return sko;
    });

    var spheresNearby = dfu.sectorsNearbyFunc(skeletonPtsObjs.map(skeletonPtToSector),0.1);

    var submittedSpheres = [];

    while(totalMarkedSpheres<skeletonPtsObjs.length){
        var biggest = getLargestUnmarkedSphere(skeletonPtsObjs);
        var nearbySpheres = spheresNearby(skeletonPtToSector(biggest)).map(s=>s.skeletalObj);

        markSphere(biggest);

        submittedSpheres.push(biggest);

        var spheresToMark = nearbySpheres.filter(function(skObj){
            return !skObj.marked && lu.lineLength([skObj.pt, biggest.pt]) < (biggest.dist - skObj.dist*(2*overlap-1));
        });

        spheresToMark.forEach(markSphere);

        //Zconsole.log("marked",spheresToMark.length,"of",skeletonPtsObjs.length)

        //console.log(totalMarkedSpheres);
    }

    return submittedSpheres;
}

function skeletonPtToSector(skObj,i){
    var midPt = skObj.pt;
    var d = skObj.dist;
    var theSector = [
        lu.addPts(midPt,[-d,-d,-d]),
        lu.addPts(midPt,[d,d,d])
    ]
    theSector.index = i;
    theSector.skeletalObj = skObj;
    return theSector;
}

var totalMarkedSpheres = 0;
function getLargestUnmarkedSphere(skObjs){
    var maxSize=0;
    var maxRes=null;
    for(var i=0;i<skObjs.length;i++){
        var obj = skObjs[i];
        if(!obj.marked && obj.dist>maxSize){
            maxRes=obj;
            maxSize=obj.dist;
        }
    }
    return maxRes;
}

function markSphere(skObj){
    if(!skObj.marked){
        totalMarkedSpheres++;
    }
    skObj.marked=true;
}

module.exports = {mesh2Spheres, meshIndexed2Spheres};
