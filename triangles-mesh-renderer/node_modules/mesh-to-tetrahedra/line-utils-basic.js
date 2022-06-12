function normalizePt(pt){
    var ilen = 1.0/(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2])
    return [pt[0]*ilen,pt[1]*ilen,pt[2]*ilen];
}

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function ptLength(pt){
    return lineLength([[0,0,0],pt]);
}

function scalePt(pt,s){
    return [pt[0]*s,pt[1]*s,pt[2]*s];
}

var normalizeLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var ilen = 1.0/(Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    //var ilen = invSqrt(dx*dx+dy*dy+dz*dz)+0.000001;
    return [line[0],[line[0][0]+dx*ilen, line[0][1]+dy*ilen, line[0][2]+dz*ilen]];
    //return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};



var _dotProduct = function(a, b){
    return  a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
};

var dotProductLines = function (a, b) {
    return _dotProduct(
        [a[1][0]-a[0][0], a[1][1]-a[0][1], a[1][2]-a[0][2]],
        [b[1][0]-b[0][0], b[1][1]-b[0][1], b[1][2]-b[0][2]]
    );
};


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

var getPointAlongLine_dist = function(line, dist){
    var _t = dist/lineLength(line);
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

var getPointAlongLine = function(line, _t){
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

var normalizeLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var ilen = 1.0/(Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    //var ilen = invSqrt(dx*dx+dy*dy+dz*dz)+0.000001;
    return [line[0],[line[0][0]+dx*ilen, line[0][1]+dy*ilen, line[0][2]+dz*ilen]];
    //return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

var normalizeAndCenterLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var ilen = 1.0/(Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    //var ilen = invSqrt(dx*dx+dy*dy+dz*dz)+0.000001;
    return [[0,0,0],[dx*ilen, dy*ilen, dz*ilen]];
};

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3];
}


function averagePts4(p0, p1, p2, p3){
    return [(p0[0]+p1[0]+p2[0]+p3[0])/4, (p0[1]+p1[1]+p2[1]+p3[1])/4, (p0[2]+p1[2]+p2[2]+p3[2])/4];
}

module.exports = {averagePts3,averagePts4,crossProductLines,dotProductLines,lineLength,normalizeLine,normalizeAndCenterLine,normalizePt,getPointAlongLine,getPointAlongLine_dist,ptLength,scalePt,normalizeLine,ptDiff,addPts}