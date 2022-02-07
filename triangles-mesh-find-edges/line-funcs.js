function angleBetweenRadians(ray0, ray1){ //https://math.stackexchange.com/questions/974178/how-to-calculate-the-angle-between-2-vectors-in-3d-space-given-a-preset-function
    //var dotRays = Vector.dotProduct(ray0.vector, ray1.vector);
    var dotRays = ray0.vector.x*ray1.vector.x + ray0.vector.y*ray1.vector.y + ray0.vector.z*ray1.vector.z;
    //var lenProd = Vector.length(ray0.vector)*Vector.length(ray1.vector);
    var lenProd = Math.sqrt((ray0.vector.x*ray0.vector.x+ray0.vector.y*ray0.vector.y+ray0.vector.z*ray0.vector.z)*(ray1.vector.x*ray1.vector.x+ray1.vector.y*ray1.vector.y+ray1.vector.z*ray1.vector.z));
    var cosQuot = dotRays/lenProd;
    var angleBeRadians = Math.acos(cosQuot);

    return angleBeRadians; //this by itself seems to do same as below...

    //if(dotRays<0){return angleBeRadians+Math.PI;} //obtuse
    //else if(dotRays>0){return angleBeRadians;} //acute
    //return 0; //parallel
}

var _nplen = new Float32Array(1);
function normalizePt(pt){ //pt = [x,y,z];
    //var len = ptLength(pt);
    _nplen[0] = Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2]);
    return [pt[0]/_nplen[0],pt[1]/_nplen[0],pt[2]/_nplen[0]];
}

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function lineDirection(line){
    return normalizePt(ptDiff(line[1],line[0]));
}

var normalizeLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var len = (Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3];
}

var _crossProduct = function (a, b) { //from gl-vec3 cross
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    var out = [0,0,0];
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out;
};

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};


function angleBetweenLines(line0, line1){
    var lineRay0 = lineDirection(line0);
    var lineRay1 = lineDirection(line1);
    var vec0 = {vector:{x:lineRay0[0],y:lineRay0[1],z:lineRay0[2]}};
    var vec1 = {vector:{x:lineRay1[0],y:lineRay1[1],z:lineRay1[2]}};
    return angleBetweenRadians(vec0,vec1);
}

module.exports = {averagePts3,addPts,ptDiff,normalizeLine,normalizePt,_crossProduct,lineDirection,angleBetweenLines}