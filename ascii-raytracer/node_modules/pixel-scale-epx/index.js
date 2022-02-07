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

function upscaleRgba4x(rgba_arr, w, h, use8Bit=false){
    return upscaleRgba2x(upscaleRgba2x(rgba_arr, w, h, use8Bit), w*2, h*2, use8Bit);
}

//https://en.wikipedia.org/wiki/Pixel-art_scaling_algorithms#EPX/Scale2%C3%97/AdvMAME2%C3%97
function upscaleRgba2x(rgba_arr, w, h, use8Bit=false){

    if(!use8Bit){
        return upscaleRgba2x_255(rgba_arr,w,h);
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
            var A = rgbToHex8bit(rgba_arr[oA],rgba_arr[oA+1],rgba_arr[oA+2]);
            var B = rgbToHex8bit(rgba_arr[oB],rgba_arr[oB+1],rgba_arr[oB+2]);
            var C = rgbToHex8bit(rgba_arr[oC],rgba_arr[oC+1],rgba_arr[oC+2]);
            var D = rgbToHex8bit(rgba_arr[oD],rgba_arr[oD+1],rgba_arr[oD+2]);

            //TODO reduce these bits too?
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

function upscaleRgba2x_255(rgba_arr, w, h){

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
            var A = rgbToHex(rgba_arr[oA],rgba_arr[oA+1],rgba_arr[oA+2]);
            var B = rgbToHex(rgba_arr[oB],rgba_arr[oB+1],rgba_arr[oB+2]);
            var C = rgbToHex(rgba_arr[oC],rgba_arr[oC+1],rgba_arr[oC+2]);
            var D = rgbToHex(rgba_arr[oD],rgba_arr[oD+1],rgba_arr[oD+2]);

            //TODO reduce these bits too?
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


module.exports = {upscaleRgba2x, upscaleRgba4x, upscaleRgba8x};