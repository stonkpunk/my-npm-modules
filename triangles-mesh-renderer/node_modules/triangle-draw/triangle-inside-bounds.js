module.exports = function(t,w,h){
    for(var i=0;i<3;i++){
        var p = t[i];
        if(p[0]<0 || p[0]>=w){
            return false;
        }
        if(p[1]<0 || p[1]>=h){
            return false;
        }
    }
    return true;
}