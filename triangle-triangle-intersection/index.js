
//see optimizations at http://web.stanford.edu/class/cs277/resources/papers/Moller1997b.pdf

function triangleTriangleIntersect(tri0, tri1){ //0.25
    var p1 = triangle2PlaneObjNormalized(tri1);
    var tri0CrossPts = triPtsCrossingNormalizedPlane(tri0, p1);

    if(tri0CrossPts){
        var p0 = triangle2PlaneObjNormalized(tri0);
        var tri1CrossPts = triPtsCrossingNormalizedPlane(tri1, p0);
        if(tri1CrossPts){
            var intLine = planePlaneIntersectionLine(p0,p1);
            return lineCrossingsIntervalLine(intLine, tri0CrossPts, tri1CrossPts) ;//|| lineCrossingsIntervalLine([intLine[1], intLine[0]], tri0CrossPts, tri1CrossPts);
        }
    }

    return null;
}

function triangle2PlaneObjNormalized(tri){ //normalized meaning no translation -- normal vector here is NOT normalized!
    //equiv:
    //var n = _crossProduct([tri[0], tri[1]],[tri[0], tri[2]]);
    //var nline = triangle2NormalLine(tri);
    //return normalLine2PlaneObjNormalized(nline);

    var res = {};
    var a = [tri[2][0]-tri[0][0], tri[2][1]-tri[0][1], tri[2][2]-tri[0][2]]; //side A
    var b = [tri[1][0]-tri[0][0], tri[1][1]-tri[0][1], tri[1][2]-tri[0][2]]; //side B
    res.nx = a[1] * b[2] - a[2] * b[1];
    res.ny = a[2] * b[0] - a[0] * b[2];
    res.nz = a[0] * b[1] - a[1] * b[0];
    res.w=-res.nx*tri[0][0] - res.ny*tri[0][1] - res.nz*tri[0][2];
    return res;
}

function planePlaneIntersectionLine(p0,p1){ //needs NORMALIZED planes not regular planeObjs
    var orthoNormal = _crossProduct([p0.nx,p0.ny,p0.nz],[p1.nx,p1.ny,p1.nz]);
    var orthoPlane = {nx: orthoNormal[0], ny: orthoNormal[1], nz: orthoNormal[2], w:0};

    var pointOnLine = intersectionPtOf3Planes(p0,p1,orthoPlane);
    var theLine = [pointOnLine, [pointOnLine[0]+orthoNormal[0], pointOnLine[1]+orthoNormal[1], pointOnLine[2]+orthoNormal[2]]];
    return theLine;
}

var _crossProduct = function (a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
};

function triPtsCrossingNormalizedPlane(tri, po){
    /*
    //equiv:
    var lines = triLinesCrossingNormalizedPlane(tri, po);
    if(lines.length==2){
        return [crossingLinePlaneIntersectionPt(lines[0], po), crossingLinePlaneIntersectionPt(lines[1], po)];
    }
    return null;
     */

    var df0 = tri[0][0]*po.nx+tri[0][1]*po.ny+tri[0][2]*po.nz+po.w;
    var df1 = tri[1][0]*po.nx+tri[1][1]*po.ny+tri[1][2]*po.nz+po.w;
    var df2 = tri[2][0]*po.nx+tri[2][1]*po.ny+tri[2][2]*po.nz+po.w;

    if(df0*df1<0.0){//edge A crosses...
        var d0 = Math.abs(df0);
        var d1 = Math.abs(df1);
        var d2 = Math.abs(df2);
        var t01 = d0 / (d1 + d0);

        if(df1*df2<0.0){ //edge B crosses...
            //return A, B

            var t12 = d1 / (d2 + d1);

            return [[
                tri[0][0] + (tri[1][0]-tri[0][0])*t01,
                tri[0][1] + (tri[1][1]-tri[0][1])*t01,
                tri[0][2] + (tri[1][2]-tri[0][2])*t01,
            ], [
                tri[1][0] + (tri[2][0]-tri[1][0])*t12,
                tri[1][1] + (tri[2][1]-tri[1][1])*t12,
                tri[1][2] + (tri[2][2]-tri[1][2])*t12,
            ]];

        }else{//edge B _not_ cross...
            //edge C must cross
            //return A, C

            var t20 = d2 / (d0 + d2);

            return [[
                tri[0][0] + (tri[1][0]-tri[0][0])*t01,
                tri[0][1] + (tri[1][1]-tri[0][1])*t01,
                tri[0][2] + (tri[1][2]-tri[0][2])*t01,
            ], [
                tri[2][0] + (tri[0][0]-tri[2][0])*t20,
                tri[2][1] + (tri[0][1]-tri[2][1])*t20,
                tri[2][2] + (tri[0][2]-tri[2][2])*t20,
            ]];
        }
    }else{//edge A _not_ cross...
        if(df1*df2<0.0){  //edge B cross...
            //edge C must cross
            //return B, C

            var d0 = Math.abs(df0);
            var d1 = Math.abs(df1);
            var d2 = Math.abs(df2);
            var t12 = d1 / (d2 + d1);
            var t20 = d2 / (d0 + d2);

            return [[
                tri[1][0] + (tri[2][0]-tri[1][0])*t12,
                tri[1][1] + (tri[2][1]-tri[1][1])*t12,
                tri[1][2] + (tri[2][2]-tri[1][2])*t12,
            ], [
                tri[2][0] + (tri[0][0]-tri[2][0])*t20,
                tri[2][1] + (tri[0][1]-tri[2][1])*t20,
                tri[2][2] + (tri[0][2]-tri[2][2])*t20,
            ]];
        }
    }
    return null;
}

function lineLengthSquared(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return a*a+b*b+c*c;
};

function lineCrossingsIntervalLine(line, triIntPts0, triIntPts1){

    var lineLength2 = lineLengthSquared(line);
    var triIntTs0_0=-1.0*((line[0][0]-triIntPts0[0][0])*(line[1][0]-line[0][0]) + (line[0][1]-triIntPts0[0][1]) * (line[1][1]-line[0][1]) + (line[0][2]-triIntPts0[0][2])*(line[1][2]-line[0][2])) /lineLength2;
    var triIntTs1_0=-1.0*((line[0][0]-triIntPts1[0][0])*(line[1][0]-line[0][0]) + (line[0][1]-triIntPts1[0][1]) * (line[1][1]-line[0][1]) + (line[0][2]-triIntPts1[0][2])*(line[1][2]-line[0][2])) /lineLength2;
    var triIntTs0_1=-1.0*((line[0][0]-triIntPts0[1][0])*(line[1][0]-line[0][0]) + (line[0][1]-triIntPts0[1][1]) * (line[1][1]-line[0][1]) + (line[0][2]-triIntPts0[1][2])*(line[1][2]-line[0][2])) /lineLength2;
    var triIntTs1_1=-1.0*((line[0][0]-triIntPts1[1][0])*(line[1][0]-line[0][0]) + (line[0][1]-triIntPts1[1][1]) * (line[1][1]-line[0][1]) + (line[0][2]-triIntPts1[1][2])*(line[1][2]-line[0][2])) /lineLength2;

    var intersectedSpan = null;

    if(triIntTs0_0<triIntTs0_1){
        if(triIntTs1_0<triIntTs1_1){
            intersectedSpan = intersectSpans(triIntTs0_0, triIntTs0_1, triIntTs1_0, triIntTs1_1);
        }else{
            intersectedSpan = intersectSpans(triIntTs0_0, triIntTs0_1, triIntTs1_1, triIntTs1_0);
        }
    }else{
        if(triIntTs1_0<triIntTs1_1){
            intersectedSpan = intersectSpans(triIntTs0_1, triIntTs0_0, triIntTs1_0, triIntTs1_1);
        }else{
            intersectedSpan = intersectSpans(triIntTs0_1, triIntTs0_0, triIntTs1_1, triIntTs1_0);
        }
    }

    if(!intersectedSpan)return null;

    return [ //gettings points along line at t values returned by intersectSpans
        [
            line[0][0] + (line[1][0]-line[0][0])*intersectedSpan[0],
            line[0][1] + (line[1][1]-line[0][1])*intersectedSpan[0],
            line[0][2] + (line[1][2]-line[0][2])*intersectedSpan[0],
        ],
        [
            line[0][0] + (line[1][0]-line[0][0])*intersectedSpan[1],
            line[0][1] + (line[1][1]-line[0][1])*intersectedSpan[1],
            line[0][2] + (line[1][2]-line[0][2])*intersectedSpan[1],
        ]
    ];
}

function intersectSpans(a0,a1, b0, b1){ //https://stackoverflow.com/questions/5390941/get-number-range-intersection?rq=1&utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    var maxStart = Math.max(a0, b0);
    var minEnd = Math.min(a1, b1);

    if(maxStart <= minEnd) {
        return [maxStart, minEnd];
    }

    return null;
}

//closest pt between 2 lines: http://morroworks.palitri.com/Content/Docs/Rays%20closest%20point.pdf

//http://www.ambrsoft.com/TrigoCalc/Plan3D/3PlanesIntersection_.htm
function intersectionPtOf3Planes(p0,p1,p2){ //intersect3planes 3planeintersection planes3Intersection

    var d0 = determinant3x3(
        p0.nx,p0.ny,p0.nz,
        p1.nx,p1.ny,p1.nz,
        p2.nx,p2.ny,p2.nz,
    );

    if(d0==0){
        console.log("determinant zero!", p0, p1, p2);
        return null;
    }

    var dx = determinant3x3(
        -p0.w,p0.ny,p0.nz,
        -p1.w,p1.ny,p1.nz,
        -p2.w,p2.ny,p2.nz,
    );

    var dy = determinant3x3(
        p0.nx,-p0.w,p0.nz,
        p1.nx,-p1.w,p1.nz,
        p2.nx,-p2.w,p2.nz,
    );

    var dz = determinant3x3(
        p0.nx,p0.ny,-p0.w,
        p1.nx,p1.ny,-p1.w,
        p2.nx,p2.ny,-p2.w,
    );

    return [dx/d0, dy/d0, dz/d0];
}

function determinant3x3( //doesnt matter if transposed, det(A) = det(A^transposed)
    a1,b1,c1,
    a2,b2,c2,
    a3,b3,c3
){
    return a1*b2*c3-a1*b3*c2+a3*b1*c2-a2*b1*c3+a2*b3*c1-a3*b2*c1;
}


module.exports = triangleTriangleIntersect;
