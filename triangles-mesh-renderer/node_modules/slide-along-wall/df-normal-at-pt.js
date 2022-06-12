function normalAtPt(df,pt,eps=0.1){
    //based on https://github.com/nicoptere/raymarching-for-THREE/blob/master/glsl/fragment.glsl
    //in turn from https://github.com/stackgl/glsl-sdf-normal -- mit license
    var x = pt[0];
    var y = pt[1];
    var z = pt[2];
    var dv1 = df(x+eps,y-eps,z-eps);
    var dv2 = df(x-eps,y-eps,z+eps);
    var dv3 = df(x-eps,y+eps,z-eps);
    var dv4 = df(x+eps,y+eps,z+eps);
    var vecSum = [
        dv1-dv2-dv3+dv4,
        -dv1-dv2+dv3+dv4,
        -dv1+dv2-dv3+dv4];
    var dlen = Math.sqrt(vecSum[0]*vecSum[0]+vecSum[1]*vecSum[1]+vecSum[2]*vecSum[2]);
    return [vecSum[0]/dlen,vecSum[1]/dlen,vecSum[2]/dlen];
}

module.exports = {normalAtPt};