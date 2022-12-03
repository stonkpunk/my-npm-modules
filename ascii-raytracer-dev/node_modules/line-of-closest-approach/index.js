function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

var dotProduct = function(a, b){
    return  a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
};

var clamp01=function(a){return Math.max(0.0,Math.min(1.0,a));};

function getPointAlongLine(line, _t){
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

//closest approach
function lineLineClosestPtsLine(line0,line1, doClamp=true){ //get shortest line joining line0, line1
    //rays a,b [init pt A, direction a]
    //http://morroworks.palitri.com/Content/Docs/Rays%20closest%20point.pdf
    // D = A + a* (-(a.b)(b.c)+(a.c)(b.b) / ((a.a)(b.b) - (a.b)(a.b))
    // E = B + b* ((a.b)(a.c) - (b.c)(a.a)) / ((a.a)(b.b) - (a.b)(a.b))

    //t0 =  (-(a.b)(b.c) + (a.c)(b.b) / ((a.a)(b.b) - (a.b)(a.b))
    //t1 =  ((a.b)(a.c) - (b.c)(a.a)) / ((a.a)(b.b) - (a.b)(a.b))

    // where D is point along line a
    //   and E is point along line b

    var c = ptDiff(line1[0], line0[0]);
    var a = ptDiff(line0[1], line0[0]);
    var b = ptDiff(line1[1], line1[0]);

    var t0 =  (-dotProduct(a,b)*dotProduct(b,c)+dotProduct(a,c)*dotProduct(b,b)) / (dotProduct(a,a)*dotProduct(b,b) - dotProduct(a,b)*dotProduct(a,b));
    var t1 =  (dotProduct(a,b)*dotProduct(a,c) -dotProduct(b,c)*dotProduct(a,a)) / (dotProduct(a,a)*dotProduct(b,b) - dotProduct(a,b)*dotProduct(a,b));

    if(doClamp){
        t0 = clamp01(t0);
        t1 = clamp01(t1);
    }

    return [
        getPointAlongLine(line0, t0),
        getPointAlongLine(line1, t1),
        t0,
        t1
    ];
}

module.exports = lineLineClosestPtsLine