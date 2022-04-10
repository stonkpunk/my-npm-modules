function determinant(m00,m01,m02,m03,
                     m10,m11,m12,m13,
                     m20,m21,m22,m23,
                     m30,m31,m32,m33){ //http://www.euclideanspace.com/maths/algebra/matrix/functions/determinant/fourD/index.htm

    return  m03 * m12 * m21 * m30 - m02 * m13 * m21 * m30-
        m03 * m11 * m22 * m30 +m01 * m13 * m22 * m30+
        m02 * m11 * m23 * m30 -m01 * m12 * m23 * m30-
        m03 * m12 * m20 * m31 +m02 * m13 * m20 * m31+
        m03 * m10 * m22 * m31 -m00 * m13 * m22 * m31-
        m02 * m10 * m23 * m31 +m00 * m12 * m23 * m31+
        m03 * m11 * m20 * m32 -m01 * m13 * m20 * m32-
        m03 * m10 * m21 * m32 +m00 * m13 * m21 * m32+
        m01 * m10 * m23 * m32 -m00 * m11 * m23 * m32-
        m02 * m11 * m20 * m33 +m01 * m12 * m20 * m33+
        m02 * m10 * m21 * m33 -m00 * m12 * m21 * m33-
        m01 * m10 * m22 * m33 +m00 * m11 * m22 * m33;
}

function tetraDeterminants(tet, pt){

    //http://steve.hollasch.net/cgindex/geometry/ptintet.html

    /*
    Then the point P is in the tetrahedron if following five determinants all have the same sign.

             |x1, y1, z1, 1,|
        D0 = |x2, y2, z2, 1,|
             |x3, y3, z3, 1,|
             |x4, y4, z4, 1,|

             |x , y , z , 1,|
        D1 = |x2, y2, z2, 1,|
             |x3, y3, z3, 1,|
             |x4, y4, z4, 1,|

             |x1, y1, z1, 1,|
        D2 = |x , y , z , 1,|
             |x3, y3, z3, 1,|
             |x4, y4, z4, 1,|

             |x1, y1, z1, 1,|
        D3 = |x2, y2, z2, 1,|
             |x , y , z , 1,|
             |x4, y4, z4, 1,|

             |x1, y1, z1, 1|
        D4 = |x2, y2, z2, 1|
             |x3, y3, z3, 1|
             |x , y , z , 1|

            Some additional notes:

            If by chance the D0=0, then your tetrahedron is degenerate (the points are coplanar).
            If any other Di=0, then P lies on boundary i (boundary i being that boundary formed by the three points other than Vi).
            If the sign of any Di differs from that of D0 then P is outside boundary i.
            If the sign of any Di equals that of D0 then P is inside boundary i.
            If P is inside all 4 boundaries, then it is inside the tetrahedron.
            As a check, it must be that D0 = D1+D2+D3+D4.
            The pattern here should be clear; the computations can be extended to simplicies of any dimension. (The 2D and 3D case are the triangle and the tetrahedron).
            If it is meaningful to you, the quantities bi = Di/D0 are the usual barycentric coordinates.
            Comparing signs of Di and D0 is only a check that P and Vi are on the same side of boundary i.

     */
    var x=pt[0]; var y=pt[1]; var z=pt[2];
    var x1=tet[0][0];var y1=tet[0][1];var z1=tet[0][2];
    var x2=tet[1][0];var y2=tet[1][1];var z2=tet[1][2];
    var x3=tet[2][0];var y3=tet[2][1];var z3=tet[2][2];
    var x4=tet[3][0];var y4=tet[3][1];var z4=tet[3][2];

    var d0 = determinant(x1, y1, z1, 1,
        x2, y2, z2, 1,
        x3, y3, z3, 1,
        x4, y4, z4, 1);

    var d1 = determinant(x , y , z , 1,
        x2, y2, z2, 1,
        x3, y3, z3, 1,
        x4, y4, z4, 1);

    var d2 = determinant(x1, y1, z1, 1,
        x , y , z , 1,
        x3, y3, z3, 1,
        x4, y4, z4, 1);

    var d3 = determinant(x1, y1, z1, 1,
        x2, y2, z2, 1,
        x , y , z , 1,
        x4, y4, z4, 1);

    var d4 = determinant(x1, y1, z1, 1,
        x2, y2, z2, 1,
        x3, y3, z3, 1,
        x , y , z , 1);

    return [d0,d1,d2,d3,d4];
}

var bv = new Float32Array(17); //baryvars
function triangleBarycentricCoords(pt, tri){ //see https://people.cs.clemson.edu/~dhouse/courses/404/notes/barycentric.pdf
    var a = tri[0];
    var b = tri[1];
    var c = tri[2];

    bv[0] = b[0]-a[0];
    bv[1] = c[0]-a[0];
    bv[2] = pt[0]-a[0];

    bv[3] = b[1]-a[1];
    bv[4] = c[1]-a[1];
    bv[5] = pt[1]-a[1];

    bv[6] = b[2]-a[2];
    bv[7] = c[2]-a[2];
    bv[8] = pt[2]-a[2];

    bv[9]  = bv[0]*bv[0]+bv[3]*bv[3]+bv[6]*bv[6];
    bv[10] = bv[0]*bv[1]+bv[3]*bv[4]+bv[6]*bv[7];

    bv[11] = bv[1]*bv[1]+bv[4]*bv[4]+bv[7]*bv[7];
    bv[12] = bv[2]*bv[0]+bv[5]*bv[3]+bv[8]*bv[6];

    bv[13] = bv[2]*bv[1]+bv[5]*bv[4]+bv[8]*bv[7];
    bv[14] = bv[9] * bv[11] - bv[10] * bv[10];

    bv[15] = (bv[11] * bv[12] - bv[10] * bv[13]) / bv[14];
    bv[16] = (bv[9] * bv[13] - bv[10] * bv[12]) / bv[14];

    return [1.0-bv[15]-bv[16],bv[16],bv[15]];
}

function triangleInterpolateNormals(pt, tri, normalA, normalB, normalC){
    var bc = triangleBarycentricCoords(pt,tri);
    return triangleCartesianCoords(bc,[normalA, normalB, normalC])
}

//this version inlined version of the above code, with identical results. much faster.
function triangleInterpolateNormalsB(pt, tri, normalA, normalB, normalC) {
    var a = tri[0];
    var b = tri[1];
    var c = tri[2];

    var bax = b[0] - a[0];
    var cax = c[0] - a[0];
    var pax = pt[0] - a[0];

    var bay = b[1] - a[1];
    var cay = c[1] - a[1];
    var pay = pt[1] - a[1];

    var baz = b[2] - a[2];
    var caz = c[2] - a[2];
    var paz = pt[2] - a[2];

    var v9 = bax * bax + bay * bay + baz * baz; //9
    var v10 = bax * cax + bay * cay + baz * caz; //10

    var v11 = cax * cax + cay * cay + caz * caz; //11
    var v12 = pax * bax + pay * bay + paz * baz; //12

    var v13 = pax * cax + pay * cay + paz * caz; //13

    var v14 = v9 * v11 - v10 * v10; //14

    var v15 = (v11 * v12 - v10 * v13) / v14; //15
    var v16 = (v9 * v13 - v10 * v12) / v14; //16

    var tbcA = 1.0 - v15 - v16;
    var tbcB = v16;
    var tbcC = v15;

    return [
        normalA[0] * tbcA + normalB[0] * tbcB + normalC[0] * tbcC,
        normalA[1] * tbcA + normalB[1] * tbcB + normalC[1] * tbcC,
        normalA[2] * tbcA + normalB[2] * tbcB + normalC[2] * tbcC,
    ];
}

function triangleInterpolateUVs(pt, tri, uvA, uvB, uvC) {
    var a = tri[0];
    var b = tri[1];
    var c = tri[2];

    var bax = b[0] - a[0];
    var cax = c[0] - a[0];
    var pax = pt[0] - a[0];

    var bay = b[1] - a[1];
    var cay = c[1] - a[1];
    var pay = pt[1] - a[1];

    var baz = b[2] - a[2];
    var caz = c[2] - a[2];
    var paz = pt[2] - a[2];

    var v9 = bax * bax + bay * bay + baz * baz; //9
    var v10 = bax * cax + bay * cay + baz * caz; //10

    var v11 = cax * cax + cay * cay + caz * caz; //11
    var v12 = pax * bax + pay * bay + paz * baz; //12

    var v13 = pax * cax + pay * cay + paz * caz; //13

    var v14 = v9 * v11 - v10 * v10; //14

    var v15 = (v11 * v12 - v10 * v13) / v14; //15
    var v16 = (v9 * v13 - v10 * v12) / v14; //16

    var tbcA = 1.0 - v15 - v16;
    var tbcB = v16;
    var tbcC = v15;

    return [
        uvA[0] * tbcA + uvB[0] * tbcB + uvC[0] * tbcC,
        uvA[1] * tbcA + uvB[1] * tbcB + uvC[1] * tbcC,
        //uvA[2] * tbcA + uvB[2] * tbcB + uvC[2] * tbcC,
    ];
}


// function generateRandomBarycoord(){
//     var pt = [Math.random(),Math.random(),0];
//     if(pt[0]+pt[1]>1){
//         pt[0]=1.0-pt[0];
//         pt[1]=1.0-pt[1];
//     }
//     pt[2] = 1.0-pt[0]-pt[1];
//     return pt;
// }

function triangleCartesianCoords(triBaryCoords, tri){
    var a = tri[0];
    var b = tri[1];
    var c = tri[2];
    return [
        a[0]*triBaryCoords[0] + b[0]*triBaryCoords[1] + c[0]*triBaryCoords[2],
        a[1]*triBaryCoords[0] + b[1]*triBaryCoords[1] + c[1]*triBaryCoords[2],
        a[2]*triBaryCoords[0] + b[2]*triBaryCoords[1] + c[2]*triBaryCoords[2],
    ];
}

function tetrahedronBarycentricCoords(pt,tet){
    var d = tetraDeterminants(tet,pt);
    if(d[0]==0){
        console.log("degenerate tetra!");
        return null;
    }
    return [
        d[1]/d[0],
        d[2]/d[0],
        d[3]/d[0],
        d[4]/d[0]
    ];
}

function tetrahedronCartesianCoords(tetBaryCoords, tet){
    return [
        tet[0][0]*tetBaryCoords[0] + tet[1][0]*tetBaryCoords[1] + tet[2][0]*tetBaryCoords[2] + tet[3][0]*tetBaryCoords[3],
        tet[0][1]*tetBaryCoords[0] + tet[1][1]*tetBaryCoords[1] + tet[2][1]*tetBaryCoords[2] + tet[3][1]*tetBaryCoords[3],
        tet[0][2]*tetBaryCoords[0] + tet[1][2]*tetBaryCoords[1] + tet[2][2]*tetBaryCoords[2] + tet[3][2]*tetBaryCoords[3],
    ];
}

module.exports.triangleInterpolateNormals = triangleInterpolateNormalsB;
module.exports.triangleInterpolateNormals_old = triangleInterpolateNormals;

module.exports.triangleInterpolateUVs = triangleInterpolateUVs;

module.exports.triangleBarycentricCoords = triangleBarycentricCoords;
module.exports.triangleCartesianCoords = triangleCartesianCoords;
module.exports.tetrahedronBarycentricCoords = tetrahedronBarycentricCoords;
module.exports.tetrahedronCartesianCoords = tetrahedronCartesianCoords;