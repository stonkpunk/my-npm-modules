function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function ptLength(pt){
    return Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2]);
}

function _crossProduct(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
}

function triArea(tri){
    var a = ptDiff(tri[1], tri[0]);
    var b = ptDiff(tri[2], tri[0]);
    return 0.5*ptLength(_crossProduct(a,b));
}

module.exports = triArea;