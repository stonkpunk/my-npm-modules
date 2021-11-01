//blur functions by Ivan Kutskir, http://blog.ivank.net/fastest-gaussian-blur.html
// My solution is based on Fast image convolutions by Wojciech Jarosz. [http://elynxsdk.free.fr/ext-docs/Blur/Fast_box_blur.pdf]
// Presented ideas are very simple and I don't know who is the original author.
// I am going to describe it a little better and add some mathematics.
// To get motivated, take a glance at the results.
// I have implemented this code into Photopea under Filter - Blur - Gaussian Blur.
// - Ivan Kutskir

// function gaussBlur_1 (scl, tcl, w, h, r) {
//     var rs = Math.ceil(r * 2.57);     // significant radius
//     for(var i=0; i<h; i++)
//         for(var j=0; j<w; j++) {
//             var val = 0, wsum = 0;
//             for(var iy = i-rs; iy<i+rs+1; iy++)
//                 for(var ix = j-rs; ix<j+rs+1; ix++) {
//                     var x = Math.min(w-1, Math.max(0, ix));
//                     var y = Math.min(h-1, Math.max(0, iy));
//                     var dsq = (ix-j)*(ix-j)+(iy-i)*(iy-i);
//                     var wght = Math.exp( -dsq / (2*r*r) ) / (Math.PI*2*r*r);
//                     val += scl[y*w+x] * wght;  wsum += wght;
//                 }
//             tcl[i*w+j] = (val/wsum);
//         }
// }
//
// function gaussBlur_2 (scl, tcl, w, h, r) {
//     var bxs = boxesForGauss(r, 3);
//     boxBlur_2 (scl, tcl, w, h, (bxs[0]-1)/2);
//     boxBlur_2 (tcl, scl, w, h, (bxs[1]-1)/2);
//     boxBlur_2 (scl, tcl, w, h, (bxs[2]-1)/2);
// }
//
// function boxBlur_2 (scl, tcl, w, h, r) {
//     for(var i=0; i<h; i++)
//         for(var j=0; j<w; j++) {
//             var val = 0;
//             for(var iy=i-r; iy<i+r+1; iy++)
//                 for(var ix=j-r; ix<j+r+1; ix++) {
//                     var x = Math.min(w-1, Math.max(0, ix));
//                     var y = Math.min(h-1, Math.max(0, iy));
//                     val += scl[y*w+x];
//                 }
//             tcl[i*w+j] = val/((r+r+1)*(r+r+1));
//         }
// }

function updateDataTextureFromChannelArrs(dt,w,h,arrR, arrG, arrB, arrA){
    for(var i=0; i<w*h; i++){
        dt[i*4] = arrR[i];
        dt[i*4+1] = arrG[i];
        dt[i*4+2] = arrB[i];
        dt[i*4+3] = arrA[i];
    }
    return dt;
}

function splitDataTextureIntoChannelArrays(dt,w,h){
    var arrR=[];
    var arrG=[];
    var arrB=[];
    var arrA=[];
    for(var i=0; i<w*h; i++){
        arrR.push(dt[i*4]);
        arrG.push(dt[i*4+1]);
        arrB.push(dt[i*4+2]);
        arrA.push(dt[i*4+3]);
    }
    return [arrR, arrG, arrB, arrA];
}

function blurTexture(dt,w,h,blurRadius){
    var dtChannelsOld = splitDataTextureIntoChannelArrays(dt,w,h);
    var dtChannelsBlurred = splitDataTextureIntoChannelArrays(dt,w,h);
    gaussBlur_4(dtChannelsOld[0], dtChannelsBlurred[0],w,h,blurRadius);
    gaussBlur_4(dtChannelsOld[1], dtChannelsBlurred[1],w,h,blurRadius);
    gaussBlur_4(dtChannelsOld[2], dtChannelsBlurred[2],w,h,blurRadius);
    updateDataTextureFromChannelArrs(dt,w,h,dtChannelsBlurred[0],dtChannelsBlurred[1],dtChannelsBlurred[2],dtChannelsBlurred[3]);
    return dt;
}

function gaussBlur_4 (scl, tcl, w, h, r) {
    var bxs = boxesForGauss(r, 3);
    boxBlur_4 (scl, tcl, w, h, (bxs[0]-1)/2);
    boxBlur_4 (tcl, scl, w, h, (bxs[1]-1)/2);
    boxBlur_4 (scl, tcl, w, h, (bxs[2]-1)/2);
}

function boxBlur_4 (scl, tcl, w, h, r) {
    for(var i=0; i<scl.length; i++) tcl[i] = scl[i];
    boxBlurH_4(tcl, scl, w, h, r);
    boxBlurT_4(scl, tcl, w, h, r);
}

function boxBlurH_4 (scl, tcl, w, h, r) {
    var iarr = 1 / (r+r+1);
    for(var i=0; i<h; i++) {
        var ti = i*w, li = ti, ri = ti+r;
        var fv = scl[ti], lv = scl[ti+w-1], val = (r+1)*fv;
        for(var j=0; j<r; j++) val += scl[ti+j];
        for(var j=0  ; j<=r ; j++) { val += scl[ri++] - fv       ;   tcl[ti++] = (val*iarr); }
        for(var j=r+1; j<w-r; j++) { val += scl[ri++] - scl[li++];   tcl[ti++] = (val*iarr); }
        for(var j=w-r; j<w  ; j++) { val += lv        - scl[li++];   tcl[ti++] = (val*iarr); }
    }
}

function boxBlurT_4 (scl, tcl, w, h, r) {
    var iarr = 1 / (r+r+1);
    for(var i=0; i<w; i++) {
        var ti = i, li = ti, ri = ti+r*w;
        var fv = scl[ti], lv = scl[ti+w*(h-1)], val = (r+1)*fv;
        for(var j=0; j<r; j++) val += scl[ti+j*w];
        for(var j=0  ; j<=r ; j++) { val += scl[ri] - fv     ;  tcl[ti] = (val*iarr);  ri+=w; ti+=w; }
        for(var j=r+1; j<h-r; j++) { val += scl[ri] - scl[li];  tcl[ti] = (val*iarr);  li+=w; ri+=w; ti+=w; }
        for(var j=h-r; j<h  ; j++) { val += lv      - scl[li];  tcl[ti] = (val*iarr);  li+=w; ti+=w; }
    }
}

function boxesForGauss(sigma, n){  // standard deviation, number of boxes
    var wIdeal = Math.sqrt((12*sigma*sigma/n)+1);  // Ideal averaging filter width
    var wl = Math.floor(wIdeal);  if(wl%2==0) wl--;
    var wu = wl+2;

    var mIdeal = (12*sigma*sigma - n*wl*wl - 4*n*wl - 3*n)/(-4*wl - 4);
    var m = Math.round(mIdeal);
    // var sigmaActual = Math.sqrt( (m*wl*wl + (n-m)*wu*wu - n)/12 );

    var sizes = [];  for(var i=0; i<n; i++) sizes.push(i<m?wl:wu);
    return sizes;
}

module.exports = {blurTexture};