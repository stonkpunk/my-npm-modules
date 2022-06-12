const rcu = require("raycasting-utils");
const lu = require("./lines-utils-basic.js");
const tmrp = require("triangles-mesh-random-pts");

function triangleNormalInward(tri){ //normal direction, but pointing "in"
    var a = tri[0], b=tri[1], c=tri[2];
    var ax = c[0]-a[0], ay = c[1]-a[1], az = c[2]-a[2],
        bx = b[0]-a[0], by = b[1]-a[1], bz = b[2]-a[2];
    var cx = ay * bz - az * by
    var cy = az * bx - ax * bz
    var cz = ax * by - ay * bx
    var len = Math.sqrt(cx*cx+cy*cy+cz*cz);
    return [cx/len,cy/len,cz/len];
}

function triangleCenter(t){
    return [
        (t[0][0]+t[1][0]+t[2][0])/3.0,
        (t[0][1]+t[1][1]+t[2][1])/3.0,
        (t[0][2]+t[1][2]+t[2][2])/3.0
    ]
}


function getSkeletalPoints_resampled(triangles, numPts, eps=0.01){
    var traceFunc = rcu.trianglesTraceFast_useLine(triangles, false);

    var rndPts = tmrp.randomPtsNormalsForMesh(triangles, numPts);
    //each result has format {pt: [x,y,z], normal: [x,y,z], normalLine: [[x,y,z],[x,y,z]], triangleIndex: int}

    var skeletonPtsObjs = rndPts.map(function(rndPt,i){
        // var normalDir = triangleNormalInward(tri);
        // var triCenter = triangleCenter(tri);
        var triCenter_shifted = lu.getPointAlongLine_dist(rndPt.normalLine, -eps);
        var rayLine = [triCenter_shifted,lu.getPointAlongLine_dist(rndPt.normalLine, -1)];

        var traceDist = traceFunc(rayLine);
        if(traceDist<9990){
            var centralPt = lu.getPointAlongLine_dist(rayLine,traceDist/2);
            return {
                pt: centralPt,
                dist: traceDist / 2.0,
                triangleIndex: i
            }
        }
        return null;
    }).filter(i=>i);

    return skeletonPtsObjs;
}


function getSkeletalPoints(triangles, eps=0.01){
    var traceFunc = rcu.trianglesTraceFast_useLine(triangles, false);

    var skeletonPtsObjs = triangles.map(function(tri,i){
        var normalDir = triangleNormalInward(tri);
        var triCenter = triangleCenter(tri);
        var triCenter_shifted = lu.addPts(triCenter,lu.scalePt(normalDir,eps));
        var rayLine = [triCenter_shifted,lu.addPts(triCenter,normalDir)];
        var traceDist = traceFunc(rayLine);
        if(traceDist<9990){
            var centralPt = lu.getPointAlongLine_dist(rayLine,traceDist/2);
            return {
                pt: centralPt,
                dist: traceDist / 2.0,
                triangleIndex: i
            }
        }
        return null;
    }).filter(i=>i);

    return skeletonPtsObjs;
}

module.exports = {getSkeletalPoints, getSkeletalPoints_resampled}