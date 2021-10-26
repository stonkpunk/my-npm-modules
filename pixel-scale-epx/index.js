//https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function rgbToHex(r, g, b) {
  return ((1 << 24) + (r << 16) + (g << 8) + b);
}

function rgbToHex8bit(_r, _g, _b) {
  var r=Math.floor(_r/16);
  var g=Math.floor(_g/16);
  var b=Math.floor(_b/16);
  return ((1 << 24) + (r << 16) + (g << 8) + b);
}

function placePixel(rgba_arr,w,h,x,y,rgb){
    rgba_arr[(x+y*w)*4] = rgb[0];
    rgba_arr[(x+y*w)*4+1] = rgb[1];
    rgba_arr[(x+y*w)*4+2] = rgb[2];
    rgba_arr[(x+y*w)*4+3] = 255;
}

function upscaleRgba8x(rgba_arr, w, h, use8Bit=false){
    return upscaleRgba2x(upscaleRgba2x(upscaleRgba2x(rgba_arr, w, h, use8Bit), w*2, h*2, use8Bit), w*4, h*4, use8Bit);
}

function upscaleRgba6x(rgba_arr, w, h, use8Bit=false){
    return upscaleRgba3x(upscaleRgba2x(rgba_arr, w, h, use8Bit), w*2, h*2, use8Bit);
}

// removed because it looks much worse than 8x version
// function upscaleRgba9x(rgba_arr, w, h, use8Bit=false){
//     return upscaleRgba3x(upscaleRgba3x(rgba_arr, w, h, use8Bit), w*3, h*3, use8Bit);
// }

function upscaleRgba4x(rgba_arr, w, h, use8Bit=false){
    return upscaleRgba2x(upscaleRgba2x(rgba_arr, w, h, use8Bit), w*2, h*2, use8Bit);
}

//https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97
function upscaleRgba2x(rgba_arr, w, h, use8Bit=false){

    var pickingFunc = rgbToHex8bit;

    if(!use8Bit){
        pickingFunc = rgbToHex;
    }

    var expandedArr = new Uint8Array(w*h*4*4);

    for(var x=0; x<w; x++){
        var prevX = Math.max(x-1,0);
        var nextX = Math.min(x+1,w-1);
        for(var y=0; y<h; y++){
            var prevY = Math.max(y-1,0);
            var nextY = Math.min(y+1,h-1);

            var oA = (x+prevY*w)*4;
            var oB = (nextX+y*w)*4;
            var oC = (prevX+y*w)*4;
            var oD = (x+nextY*w)*4;
            var oP = (x+y*w)*4;

            //colors, 8bit rgb as hex longs
            //var P = rgbToHex8bit(rgba_arr[oP],rgba_arr[oP+1],rgba_arr[oP+2]); //colorRgb_P
            var A = pickingFunc(rgba_arr[oA],rgba_arr[oA+1],rgba_arr[oA+2]);
            var B = pickingFunc(rgba_arr[oB],rgba_arr[oB+1],rgba_arr[oB+2]);
            var C = pickingFunc(rgba_arr[oC],rgba_arr[oC+1],rgba_arr[oC+2]);
            var D = pickingFunc(rgba_arr[oD],rgba_arr[oD+1],rgba_arr[oD+2]);

            var _P = [rgba_arr[oP],rgba_arr[oP+1],rgba_arr[oP+2]];
            var _A = [rgba_arr[oA],rgba_arr[oA+1],rgba_arr[oA+2]];
            var _B = [rgba_arr[oB],rgba_arr[oB+1],rgba_arr[oB+2]];
            var _C = [rgba_arr[oC],rgba_arr[oC+1],rgba_arr[oC+2]];
            var _D = [rgba_arr[oD],rgba_arr[oD+1],rgba_arr[oD+2]];

            var r1=_P,r2=_P,r3=_P,r4=_P; //result vars...
            if(C==A && C!=D && A!=B){r1=_A;}
            if(A==B && A!=C && B!=D){r2=_B;}
            if(D==C && D!=B && C!=A){r3=_C;}
            if(B==D && B!=A && D!=C){r4=_D;}

            placePixel(expandedArr,w*2,h*2,x*2,y*2, r1);
            placePixel(expandedArr,w*2,h*2,x*2+1,y*2, r2);
            placePixel(expandedArr,w*2,h*2,x*2,y*2+1, r3);
            placePixel(expandedArr,w*2,h*2,x*2+1,y*2+1, r4);
        }
    }

    return expandedArr;
};

function upscaleRgba3x(rgba_arr, w, h, use8Bit=false){

    var pickingFunc = rgbToHex8bit;

    if(!use8Bit){
        pickingFunc = rgbToHex;
    }

    var expandedArr = new Uint8Array(w*h*4*9);

    for(var x=0; x<w; x++){
        var prevX = Math.max(x-1,0);
        var nextX = Math.min(x+1,w-1);
        for(var y=0; y<h; y++){
            var prevY = Math.max(y-1,0);
            var nextY = Math.min(y+1,h-1);

            var oA = (prevX+prevY*w)*4;
            var oB = (x+prevY*w)*4;
            var oC = (nextX+nextY*w)*4;
            var oD = (prevX+y*w)*4;
            var oE = (x+y*w)*4;
            var oF = (nextX+y*w)*4;
            var oG = (prevX+nextY*w)*4;
            var oH = (x+nextY*w)*4;
            var oI = (nextX+nextY*w)*4;

            var A = pickingFunc(rgba_arr[oA],rgba_arr[oA+1],rgba_arr[oA+2]);
            var B = pickingFunc(rgba_arr[oB],rgba_arr[oB+1],rgba_arr[oB+2]);
            var C = pickingFunc(rgba_arr[oC],rgba_arr[oC+1],rgba_arr[oC+2]);
            var D = pickingFunc(rgba_arr[oD],rgba_arr[oD+1],rgba_arr[oD+2]);
            var E = pickingFunc(rgba_arr[oE],rgba_arr[oE+1],rgba_arr[oE+2]);
            var F = pickingFunc(rgba_arr[oF],rgba_arr[oF+1],rgba_arr[oF+2]);
            var G = pickingFunc(rgba_arr[oG],rgba_arr[oG+1],rgba_arr[oG+2]);
            var H = pickingFunc(rgba_arr[oH],rgba_arr[oH+1],rgba_arr[oH+2]);
            var I = pickingFunc(rgba_arr[oI],rgba_arr[oI+1],rgba_arr[oI+2]);

            //var _A = [rgba_arr[oA],rgba_arr[oA+1],rgba_arr[oA+2]];
            var _B = [rgba_arr[oB],rgba_arr[oB+1],rgba_arr[oB+2]];
            //var _C = [rgba_arr[oC],rgba_arr[oC+1],rgba_arr[oC+2]];
            var _D = [rgba_arr[oD],rgba_arr[oD+1],rgba_arr[oD+2]];
            var _E = [rgba_arr[oE],rgba_arr[oE+1],rgba_arr[oE+2]];
            var _F = [rgba_arr[oF],rgba_arr[oF+1],rgba_arr[oF+2]];
            //var _G = [rgba_arr[oG],rgba_arr[oG+1],rgba_arr[oG+2]];
            var _H = [rgba_arr[oH],rgba_arr[oH+1],rgba_arr[oH+2]];
            //var _I = [rgba_arr[oI],rgba_arr[oI+1],rgba_arr[oI+2]];

            var r = [_E,_E,_E, _E,_E,_E, _E,_E,_E];

            if(D==B &&  D!=H &&  B!=F                                                ){r[0]=_D;}
            if((D==B &&  D!=H &&  B!=F &&  E!=C) || (B==F &&  B!=D &&  F!=H &&  E!=A)){r[1]=_B;}
            if(B==F &&  B!=D &&  F!=H                                                ){r[2]=_F;}
            if((H==D &&  H!=F &&  D!=B &&  E!=A) || (D==B &&  D!=H &&  B!=F &&  E!=G)){r[3]=_D;}
            if((B==F &&  B!=D &&  F!=H &&  E!=I) || (F==H &&  F!=B &&  H!=D &&  E!=C)){r[5]=_F;}
            if(H==D &&  H!=F &&  D!=B                                                ){r[6]=_D;}
            if((F==H &&  F!=B &&  H!=D &&  E!=G) || (H==D &&  H!=F &&  D!=B &&  E!=I)){r[7]=_H;}
            if(F==H &&  F!=B &&  H!=D                                                ){r[8]=_F;}

            placePixel(expandedArr,w*3,h*3,x*3-1,y*3-1, r[0]);
            placePixel(expandedArr,w*3,h*3,x*3,y*3-1, r[1]);
            placePixel(expandedArr,w*3,h*3,x*3+1,y*3-1, r[2]);

            placePixel(expandedArr,w*3,h*3,x*3-1,y*3, r[3]);
            placePixel(expandedArr,w*3,h*3,x*3,y*3, r[4]);
            placePixel(expandedArr,w*3,h*3,x*3+1,y*3, r[5]);

            placePixel(expandedArr,w*3,h*3,x*3-1,y*3+1, r[6]);
            placePixel(expandedArr,w*3,h*3,x*3,y*3+1, r[7]);
            placePixel(expandedArr,w*3,h*3,x*3+1,y*3+1, r[8]);
        }
    }

    return expandedArr;
};



module.exports = {upscaleRgba2x, upscaleRgba3x, upscaleRgba4x, upscaleRgba6x, upscaleRgba8x};