if(!Math.clamp01){
    (function(){Math.clamp01=function(a/*,b,c*/){return Math.max(0.0,Math.min(1.0,a));}})();
}

var _t_typed = new Float32Array(16);
function distanceFromLineSegmentThickCone_pts(p, a, b, r0, r1){
    _t_typed[0] = p[0]-a[0];
    _t_typed[1] = p[1]-a[1];
    _t_typed[2] = p[2]-a[2];
    _t_typed[3] = b[0]-a[0];
    _t_typed[4] = b[1]-a[1];
    _t_typed[5] = b[2]-a[2];
    _t_typed[6] = Math.clamp01((_t_typed[0]*_t_typed[3]+_t_typed[1]*_t_typed[4]+_t_typed[2]*_t_typed[5]) / (_t_typed[3]*_t_typed[3]+_t_typed[4]*_t_typed[4]+_t_typed[5]*_t_typed[5])); //h
    _t_typed[7] = _t_typed[0]-_t_typed[6]*_t_typed[3]; //[, , _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[8] = _t_typed[2]-_t_typed[6]*_t_typed[5];//[_t_typed[0]-_t_typed[6]*_t_typed[3], _t_typed[1]-_t_typed[6]*_t_typed[4], _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[9] = _t_typed[1]-_t_typed[6]*_t_typed[4]; //[ _t_typed[1]-_t_typed[6]*_t_typed[4],];
    return Math.sqrt(_t_typed[7]*_t_typed[7]+_t_typed[9]*_t_typed[9]+_t_typed[8]*_t_typed[8]) - r0 - (r1-r0)*_t_typed[6];
}

function distanceFromLineSegmentThickCone_pts_squared(p, a, b, r0, r1){
    _t_typed[0] = p[0]-a[0];
    _t_typed[1] = p[1]-a[1];
    _t_typed[2] = p[2]-a[2];
    _t_typed[3] = b[0]-a[0];
    _t_typed[4] = b[1]-a[1];
    _t_typed[5] = b[2]-a[2];
    _t_typed[6] = Math.clamp01((_t_typed[0]*_t_typed[3]+_t_typed[1]*_t_typed[4]+_t_typed[2]*_t_typed[5]) / (_t_typed[3]*_t_typed[3]+_t_typed[4]*_t_typed[4]+_t_typed[5]*_t_typed[5])); //h
    _t_typed[7] = _t_typed[0]-_t_typed[6]*_t_typed[3]; //[, , _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[8] = _t_typed[2]-_t_typed[6]*_t_typed[5];//[_t_typed[0]-_t_typed[6]*_t_typed[3], _t_typed[1]-_t_typed[6]*_t_typed[4], _t_typed[2]-_t_typed[6]*_t_typed[5]];
    _t_typed[9] = _t_typed[1]-_t_typed[6]*_t_typed[4]; //[ _t_typed[1]-_t_typed[6]*_t_typed[4],];
    return (_t_typed[7]*_t_typed[7]+_t_typed[9]*_t_typed[9]+_t_typed[8]*_t_typed[8]) - r0 - (r1-r0)*_t_typed[6];
}

module.exports.roundConeDistance = distanceFromLineSegmentThickCone_pts;
module.exports.roundConeDistanceSquared = distanceFromLineSegmentThickCone_pts_squared;