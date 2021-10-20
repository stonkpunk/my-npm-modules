function sign1 (x) {return typeof x === 'number' ? x ? x < 0.0 ? -1.0 : 1.0 : x === x ? 0.0 : NaN : NaN;}//see https://jsperf.com/signs/3
function clamp1(x){return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;} //see https://jsperf.com/clamp-functions/7

var _va = new Float32Array(36);
function triangleDFuncTurboSquared(_p, _a, _b, _c){
    _va[0]=_b[0]-_a[0]; _va[1]=_b[1]-_a[1]; _va[2]= _b[2]-_a[2];
    _va[3]=_p[0]-_a[0]; _va[4]=_p[1]-_a[1]; _va[5]= _p[2]-_a[2];
    _va[6]=_c[0]-_b[0]; _va[7]=_c[1]-_b[1]; _va[8]= _c[2]-_b[2];
    _va[9]=_p[0]-_b[0]; _va[10]=_p[1]-_b[1]; _va[11]= _p[2]-_b[2];
    _va[12]=_a[0]-_c[0]; _va[13]=_a[1]-_c[1]; _va[14]= _a[2]-_c[2];
    _va[15]=_p[0]-_c[0]; _va[16]=_p[1]-_c[1]; _va[17]= _p[2]-_c[2];

    _va[18] = _va[1] * _va[14] - _va[2] * _va[13];
    _va[19] = _va[2] * _va[12] - _va[0] * _va[14];
    _va[20] = _va[0] * _va[13] - _va[1] * _va[12];

    _va[30] = (_va[1] * _va[20] - _va[2] * _va[19])*_va[3] + (_va[2] * _va[18] - _va[0] * _va[20])*_va[4] + (_va[0] * _va[19] - _va[1] * _va[18])*_va[5];
    _va[31] = (_va[7] * _va[20] - _va[8] * _va[19])*_va[9] + (_va[8] * _va[18] - _va[6] * _va[20])*_va[10] + (_va[6] * _va[19] - _va[7] * _va[18])*_va[11];
    _va[32] = (_va[13] * _va[20] - _va[14] * _va[19])*_va[15] + (_va[14] * _va[18] - _va[12] * _va[20])*_va[16] + (_va[12] * _va[19] - _va[13] * _va[18])*_va[17];

    if(sign1(_va[30])+sign1(_va[31])+sign1(_va[32])<2.0){

        _va[33]= clamp1((_va[0]*_va[3]+_va[1]*_va[4]+_va[2]*_va[5])/(_va[0]*_va[0]+_va[1]*_va[1]+_va[2]*_va[2]));
        _va[34]= clamp1((_va[6]*_va[9]+_va[7]*_va[10]+_va[8]*_va[11])/(_va[6]*_va[6]+_va[7]*_va[7]+_va[8]*_va[8]));
        _va[35]= clamp1((_va[12]*_va[15]+_va[13]*_va[16]+_va[14]*_va[17])/(_va[12]*_va[12]+_va[13]*_va[13]+_va[14]*_va[14]));

        _va[21]=_va[0]*_va[33]-_va[3]; _va[22]= _va[1]*_va[33]-_va[4];_va[23]= _va[2]*_va[33]-_va[5];
        _va[24]=_va[6]*_va[34]-_va[9]; _va[25]= _va[7]*_va[34]-_va[10];_va[26]= _va[8]*_va[34]-_va[11];
        _va[27]=_va[12]*_va[35]-_va[15]; _va[28]= _va[13]*_va[35]-_va[16];_va[29]= _va[14]*_va[35]-_va[17];
        return (Math.min(Math.min(_va[21]*_va[21]+_va[22]*_va[22]+_va[23]*_va[23], _va[24]*_va[24]+_va[25]*_va[25]+_va[26]*_va[26]),  _va[27]*_va[27]+_va[28]*_va[28]+_va[29]*_va[29]));
    }else{

        _va[27] = _va[18]*_va[3] + _va[19]*_va[4] + _va[20]*_va[5]; //re-using 27
        return (_va[27]*_va[27]/(_va[18]*_va[18]+_va[19]*_va[19]+_va[20]*_va[20]));
    }
}

function dfTetrahedronSurface_direct(x,y,z,p0,p1,p2,p3){

    //layout of verts:

    //  p0
    //  |\ \
    // d| \b \p3
    //  |a \ / |
    //  |   \  |
    //  | / c\ |
    //  p1----p2
    //
    // var faceA = [p0, p1, p2];
    // var faceB = [p0, p3, p2];
    // var faceC = [p1, p2, p3];
    // var faceD = [p0, p1, p3];

    var p = [x,y,z];
    var distA = triangleDFuncTurboSquared(p,p0, p1, p2); //_p, _a, _b, _c
    var distB = triangleDFuncTurboSquared(p,p0, p3, p2);
    var distC = triangleDFuncTurboSquared(p,p1, p2, p3);
    var distD = triangleDFuncTurboSquared(p,p0, p1, p3);
    return Math.sqrt(Math.min(Math.min(distA,distB),Math.min(distC,distD))); //"union" of 4 surface triangle distances
}

// function tetraContainsPt(tet,pt){
//     var d = tetraDeterminants_turbo(tet,pt);
//     return d[0]*d[1]>=0 && d[0]*d[2]>=0 && d[2]*d[3]>=0 && d[4]*d[3]>=0; //checking if all signs equal
// }

var tfv = new Float32Array(20);
function tetraContainsPt_turbo(tet, pt) { //based on determinants -- see http://steve.hollasch.net/cgindex/geometry/ptintet.html
    tfv[0]=pt[0]; //x
    tfv[1]=pt[1]; //y
    tfv[2]=pt[2]; //z
    tfv[3]=tet[0][0]; //x1
    tfv[4]=tet[0][1]; //y1
    tfv[5]=tet[0][2]; //z1
    tfv[6]=tet[1][0]; //x2
    tfv[7]=tet[1][1]; //y2
    tfv[8]=tet[1][2]; //z2
    tfv[9]=tet[2][0]; //x3
    tfv[10]=tet[2][1]; //y3
    tfv[11]=tet[2][2]; //z3
    tfv[12]=tet[3][0]; //x4
    tfv[13]=tet[3][1]; //y4
    tfv[14]=tet[3][2]; //z4

    //d0
    tfv[15] = 1 * tfv[8] * tfv[10] * tfv[12]  - tfv[5] * 1 * tfv[10] * tfv[12]-
        1 * tfv[7] * tfv[11] * tfv[12] +tfv[4] * 1 * tfv[11] * tfv[12]+
        tfv[5] * tfv[7] * 1 * tfv[12] -tfv[4] * tfv[8] * 1 * tfv[12]-
        1 * tfv[8] * tfv[9] * tfv[13] +tfv[5] * 1 * tfv[9] * tfv[13]+
        1 * tfv[6] * tfv[11] * tfv[13] -tfv[3] * 1 * tfv[11] * tfv[13]-
        tfv[5] * tfv[6] * 1 * tfv[13] +tfv[3] * tfv[8] * 1 * tfv[13]+
        1 * tfv[7] * tfv[9] * tfv[14] -tfv[4] * 1 * tfv[9] * tfv[14]-
        1 * tfv[6] * tfv[10] * tfv[14] +tfv[3] * 1 * tfv[10] * tfv[14]+
        tfv[4] * tfv[6] * 1 * tfv[14] -tfv[3] * tfv[7] * 1 * tfv[14]-
        tfv[5] * tfv[7] * tfv[9] * 1 +tfv[4] * tfv[8] * tfv[9] * 1+
        tfv[5] * tfv[6] * tfv[10] * 1 -tfv[3] * tfv[8] * tfv[10] * 1-
        tfv[4] * tfv[6] * tfv[11] * 1 +tfv[3] * tfv[7] * tfv[11] * 1;

    //d1
    tfv[16] = 1 * tfv[8] * tfv[10] * tfv[12]  - tfv[2] * 1 * tfv[10] * tfv[12]-
        1 * tfv[7] * tfv[11] * tfv[12] +tfv[1] * 1 * tfv[11] * tfv[12]+
        tfv[2] * tfv[7] * 1 * tfv[12] -tfv[1] * tfv[8] * 1 * tfv[12]-
        1 * tfv[8] * tfv[9] * tfv[13] +tfv[2] * 1 * tfv[9] * tfv[13]+
        1 * tfv[6] * tfv[11] * tfv[13] -tfv[0] * 1 * tfv[11] * tfv[13]-
        tfv[2] * tfv[6] * 1 * tfv[13] +tfv[0] * tfv[8] * 1 * tfv[13]+
        1 * tfv[7] * tfv[9] * tfv[14] -tfv[1] * 1 * tfv[9] * tfv[14]-
        1 * tfv[6] * tfv[10] * tfv[14] +tfv[0] * 1 * tfv[10] * tfv[14]+
        tfv[1] * tfv[6] * 1 * tfv[14] -tfv[0] * tfv[7] * 1 * tfv[14]-
        tfv[2] * tfv[7] * tfv[9] * 1 +tfv[1] * tfv[8] * tfv[9] * 1+
        tfv[2] * tfv[6] * tfv[10] * 1 -tfv[0] * tfv[8] * tfv[10] * 1-
        tfv[1] * tfv[6] * tfv[11] * 1 +tfv[0] * tfv[7] * tfv[11] * 1;

    //d2
    tfv[17] = 1 * tfv[2] * tfv[10] * tfv[12]  - tfv[5] * 1 * tfv[10] * tfv[12]-
        1 * tfv[1] * tfv[11] * tfv[12] +tfv[4] * 1 * tfv[11] * tfv[12]+
        tfv[5] * tfv[1] * 1 * tfv[12] -tfv[4] * tfv[2] * 1 * tfv[12]-
        1 * tfv[2] * tfv[9] * tfv[13] +tfv[5] * 1 * tfv[9] * tfv[13]+
        1 * tfv[0] * tfv[11] * tfv[13] -tfv[3] * 1 * tfv[11] * tfv[13]-
        tfv[5] * tfv[0] * 1 * tfv[13] +tfv[3] * tfv[2] * 1 * tfv[13]+
        1 * tfv[1] * tfv[9] * tfv[14] -tfv[4] * 1 * tfv[9] * tfv[14]-
        1 * tfv[0] * tfv[10] * tfv[14] +tfv[3] * 1 * tfv[10] * tfv[14]+
        tfv[4] * tfv[0] * 1 * tfv[14] -tfv[3] * tfv[1] * 1 * tfv[14]-
        tfv[5] * tfv[1] * tfv[9] * 1 +tfv[4] * tfv[2] * tfv[9] * 1+
        tfv[5] * tfv[0] * tfv[10] * 1 -tfv[3] * tfv[2] * tfv[10] * 1-
        tfv[4] * tfv[0] * tfv[11] * 1 +tfv[3] * tfv[1] * tfv[11] * 1;

    //d3
    tfv[18] = 1 * tfv[8] * tfv[1] * tfv[12]  - tfv[5] * 1 * tfv[1] * tfv[12]-
        1 * tfv[7] * tfv[2] * tfv[12] +tfv[4] * 1 * tfv[2] * tfv[12]+
        tfv[5] * tfv[7] * 1 * tfv[12] -tfv[4] * tfv[8] * 1 * tfv[12]-
        1 * tfv[8] * tfv[0] * tfv[13] +tfv[5] * 1 * tfv[0] * tfv[13]+
        1 * tfv[6] * tfv[2] * tfv[13] -tfv[3] * 1 * tfv[2] * tfv[13]-
        tfv[5] * tfv[6] * 1 * tfv[13] +tfv[3] * tfv[8] * 1 * tfv[13]+
        1 * tfv[7] * tfv[0] * tfv[14] -tfv[4] * 1 * tfv[0] * tfv[14]-
        1 * tfv[6] * tfv[1] * tfv[14] +tfv[3] * 1 * tfv[1] * tfv[14]+
        tfv[4] * tfv[6] * 1 * tfv[14] -tfv[3] * tfv[7] * 1 * tfv[14]-
        tfv[5] * tfv[7] * tfv[0] * 1 +tfv[4] * tfv[8] * tfv[0] * 1+
        tfv[5] * tfv[6] * tfv[1] * 1 -tfv[3] * tfv[8] * tfv[1] * 1-
        tfv[4] * tfv[6] * tfv[2] * 1 +tfv[3] * tfv[7] * tfv[2] * 1;

    //d4
    tfv[19] = 1 * tfv[8] * tfv[10] * tfv[0]  - tfv[5] * 1 * tfv[10] * tfv[0]-
        1 * tfv[7] * tfv[11] * tfv[0] +tfv[4] * 1 * tfv[11] * tfv[0]+
        tfv[5] * tfv[7] * 1 * tfv[0] -tfv[4] * tfv[8] * 1 * tfv[0]-
        1 * tfv[8] * tfv[9] * tfv[1] +tfv[5] * 1 * tfv[9] * tfv[1]+
        1 * tfv[6] * tfv[11] * tfv[1] -tfv[3] * 1 * tfv[11] * tfv[1]-
        tfv[5] * tfv[6] * 1 * tfv[1] +tfv[3] * tfv[8] * 1 * tfv[1]+
        1 * tfv[7] * tfv[9] * tfv[2] -tfv[4] * 1 * tfv[9] * tfv[2]-
        1 * tfv[6] * tfv[10] * tfv[2] +tfv[3] * 1 * tfv[10] * tfv[2]+
        tfv[4] * tfv[6] * 1 * tfv[2] -tfv[3] * tfv[7] * 1 * tfv[2]-
        tfv[5] * tfv[7] * tfv[9] * 1 +tfv[4] * tfv[8] * tfv[9] * 1+
        tfv[5] * tfv[6] * tfv[10] * 1 -tfv[3] * tfv[8] * tfv[10] * 1-
        tfv[4] * tfv[6] * tfv[11] * 1 +tfv[3] * tfv[7] * tfv[11] * 1;

    return tfv[15]*tfv[16]>=0 && tfv[15]*tfv[17]>=0 && tfv[17]*tfv[18]>=0 && tfv[19]*tfv[18]>=0;
}

function dfTetrahedron(p0, p1, p2, p3){

    //layout of verts:
    //  p0
    //  |\ \
    // d| \b \p3
    //  |a \ / |
    //  |   \  |
    //  | / c\ |
    //  p1----p2

    return function(x,y,z){
        var dfsv = dfTetrahedronSurface_direct(x,y,z,p0,p1,p2,p3,0.0); //value from triangle surfaces
        return tetraContainsPt_turbo([p0,p1,p2,p3],[x,y,z]) ? -dfsv : dfsv;
    }
}

function dfTetrahedron_direct(pt,tet){

    //layout of verts:
    //  p0
    //  |\ \
    // d| \b \p3
    //  |a \ / |
    //  |   \  |
    //  | / c\ |
    //  p1----p2

    var dfsv = dfTetrahedronSurface_direct(pt[0],pt[1],pt[2],tet[0],tet[1],tet[2],tet[3]); //value from triangle surfaces
    return tetraContainsPt_turbo(tet,pt) ? -dfsv : dfsv;
}

module.exports.tetrahedronContainsPt = function(p,t){
    return tetraContainsPt_turbo(t,p);
}
module.exports.signedDistanceFunctionTetrahedron = dfTetrahedron;
module.exports.signedDistanceTetrahedron = dfTetrahedron_direct;