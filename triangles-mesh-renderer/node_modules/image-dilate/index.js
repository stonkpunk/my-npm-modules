function dilateColors_loop(dt,h,w,bgColor,rad){
    for(var i=0;i<rad;i++){
        dilateColors(dt,h,w, bgColor, 1);
    }
    return dt;
}

//on its own, this func produces results which "lean" to one side, better to use looped version above
function dilateColors(dt,_h,_w, _bgColor, _rad){ //replace bgColor with nearest color
    var h = _w;
    var w = _h; //h, w were swapped in the loops by accident, whoops , here we swap them back
    var bgColor = _bgColor || [0,255,0];
    var rad = _rad||1;
    var data = dt;
    var i=0;
    var recentColorIndex = 0;
    var count=0;
    var prevWasBg = false;
    var prevI = 0;
    var x=0;
    var y=0;

    //dialate along X
    for(y=0; y<w; y++){
        recentColorIndex=0;
        count=0;
        prevWasBg=false;
        for(x=0; x<h; x++){
            i = (x+y*h)*4;
            if(data[i]==bgColor[0] && data[i+1]==bgColor[1] && data[i+2]==bgColor[2]){
                if(count<rad){
                    data[i] = data[recentColorIndex];
                    data[i+1] = data[recentColorIndex+1];
                    data[i+2] = data[recentColorIndex+2];
                    prevWasBg=false;
                }else{
                    prevWasBg=true;
                    prevI=i;
                }
                count++;
            }else{
                recentColorIndex=i;
                if(prevWasBg){ //dialate in other direction if this pixel is nonBg but the one before it was bg
                    data[prevI] = data[recentColorIndex];
                    data[prevI+1] = data[recentColorIndex+1];
                    data[prevI+2] = data[recentColorIndex+2];
                }
                prevWasBg=false;
                count=0;
            }
        }
    }

    //dialate along Y
    for(x=0; x<w; x++){
        recentColorIndex = 0;
        count=0;
        prevWasBg=false;
        for(y=0; y<h; y++){
            i = (x+y*h)*4;
            if(data[i]==bgColor[0] && data[i+1]==bgColor[1] && data[i+2]==bgColor[2]){
                if(count<rad){
                    data[i] = data[recentColorIndex];
                    data[i+1] = data[recentColorIndex+1];
                    data[i+2] = data[recentColorIndex+2];
                    prevWasBg=false;
                }else{
                    prevWasBg=true;
                    prevI=i;
                }
                count++;
            }else{
                recentColorIndex=i;
                if(prevWasBg){ //dialate in other direction if this pixel is nonBg but the one before it was bg
                    data[prevI] = data[recentColorIndex];
                    data[prevI+1] = data[recentColorIndex+1];
                    data[prevI+2] = data[recentColorIndex+2];
                }
                prevWasBg=false;
                count=0;
            }
        }
    }

    return data;
}

module.exports = {dilateColors: dilateColors_loop};