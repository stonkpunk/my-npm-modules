module.exports = function(t,w,h){
    var pointsOutside =0;
    for(var i=0;i<3;i++){
        var p = t[i];
        if((p[0]<0 || p[0]>=w) || (p[1]<0 || p[1]>=h)){
            pointsOutside++;
        }
    }
    return pointsOutside==3;
}