module.exports = function(t,index=0,w,h){
    var i = index;
    if(t[i+0]<0 || t[i+0]>=w){
        return false;
    }
    if(t[i+1]<0 || t[i+1]>=h){
        return false;
    }

    i+=2;

    if(t[i+0]<0 || t[i+0]>=w){
        return false;
    }
    if(t[i+1]<0 || t[i+1]>=h){
        return false;
    }

    i+=2;

    if(t[i+0]<0 || t[i+0]>=w){
        return false;
    }
    if(t[i+1]<0 || t[i+1]>=h){
        return false;
    }

    return true;
}