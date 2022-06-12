function sign1 (x) {return typeof x === 'number' ? x ? x < 0.0 ? -1.0 : 1.0 : x === x ? 0.0 : NaN : NaN;}//see https://jsperf.com/signs/3
function clamp1(x){return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;} //see https://jsperf.com/clamp-functions/7

var _va = new Float32Array(36);

function triangleDFuncTurbo_arr(_p,_t){
    return triangleDFuncTurbo(_p, _t[0],_t[1],_t[2]);
}

function triangleDFuncTurboSquared_arr(_p,_t){
    return triangleDFuncTurboSquared(_p, _t[0],_t[1],_t[2]);
}

function triangleDFuncTurbo(_p, _a, _b, _c){
    return Math.sqrt(triangleDFuncTurboSquared(_p, _a, _b, _c));
}

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

module.exports.triangleDistance = triangleDFuncTurbo;
module.exports.triangleDistanceSquared = triangleDFuncTurboSquared;
module.exports.triangleDistance_arr = triangleDFuncTurbo_arr;
module.exports.triangleDistanceSquared_arr = triangleDFuncTurboSquared_arr;


