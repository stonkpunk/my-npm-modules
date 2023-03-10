
var crossProductLines = function (a, b) {
    return _crossProduct(
        [a[1][0]-a[0][0], a[1][1]-a[0][1], a[1][2]-a[0][2]],
        [b[1][0]-b[0][0], b[1][1]-b[0][1], b[1][2]-b[0][2]]
    );
};
var _crossProduct = function (a, b) { //from gl-vec3 cross
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    var out = [0,0,0];
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out;
};

function triangleFlatNormal(triangleFlat){
    var p0 = [triangleFlat[0],triangleFlat[1],triangleFlat[2]];
    var p1 = [triangleFlat[3],triangleFlat[4],triangleFlat[5]];
    var p2 = [triangleFlat[6],triangleFlat[7],triangleFlat[8]];
    return crossProductLines([p0, p1], [p0, p2]);
}

function triangleNormal(tri){
    var p0 = tri[0];
    var p1 = tri[1];
    var p2 = tri[2];
    return crossProductLines([p0, p1], [p0, p2]);
}

module.exports = {triangleNormal, triangleFlatNormal};