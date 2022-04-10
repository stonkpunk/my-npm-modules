//var invSqrt  = require("fast-inv-sqrt").invSqrt;

module.exports = function(tri){
    var b = tri[0], a=tri[1], c=tri[2]; //a,b flipped to correct sign
    var ax = c[0]-a[0], ay = c[1]-a[1], az = c[2]-a[2],
        bx = b[0]-a[0], by = b[1]-a[1], bz = b[2]-a[2];
    var cx = ay * bz - az * by
    var cy = az * bx - ax * bz
    var cz = ax * by - ay * bx
    var len = 1.0/Math.sqrt(cx*cx+cy*cy+cz*cz);
    return [cx*len,cy*len,cz*len];
}

// module.exports = function(tri){
//     var b = tri[0], a=tri[1], c=tri[2]; //a,b flipped to correct sign
//     var ax = c[0]-a[0], ay = c[1]-a[1], az = c[2]-a[2],
//         bx = b[0]-a[0], by = b[1]-a[1], bz = b[2]-a[2];
//     var cx = ay * bz - az * by
//     var cy = az * bx - ax * bz
//     var cz = ax * by - ay * bx
//     var len = Math.sqrt(cx*cx+cy*cy+cz*cz);
//     return [cx/len,cy/len,cz/len];
// }