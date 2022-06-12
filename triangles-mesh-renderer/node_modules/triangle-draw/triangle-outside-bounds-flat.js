module.exports = function(t,index=0,w,h){
    var i = index;
    var ptsOutside = 0;
    if((t[i+0]<0 || t[i+0]>=w)||(t[i+1]<0 || t[i+1]>=h)){
        ptsOutside++;
    }

    i+=2;

    if((t[i+0]<0 || t[i+0]>=w)||(t[i+1]<0 || t[i+1]>=h)){
        ptsOutside++;
    }

    i+=2;

    if((t[i+0]<0 || t[i+0]>=w)||(t[i+1]<0 || t[i+1]>=h)){
        ptsOutside++;
    }

    return ptsOutside==3;
}