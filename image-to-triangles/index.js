var st = require('simplify-triangles');

function sampleTexture(texBuffer, texHeight, texWidth, u, v){
    var x = Math.floor((u*texWidth+texWidth)%texWidth);
    var y = Math.floor((v*texHeight+texHeight)%texHeight);
    var o = 4*(texWidth*y+x);
    return [
        texBuffer[o], texBuffer[o+1], texBuffer[o+2]
    ]
}

function triangleColorSamples(tris,ox,oy,s,pixelsBuffer,texWidth,texHeight){
    return tris.map(function(tri){
        var t = tri;

        var samplerA = [(t[0][0]-ox)/s/texWidth,(t[0][2]-oy)/s/texHeight];
        var samplerC = [(t[1][0]-ox)/s/texWidth,(t[1][2]-oy)/s/texHeight];
        var samplerB = [(t[2][0]-ox)/s/texWidth,(t[2][2]-oy)/s/texHeight];

        return [
            sampleTexture(pixelsBuffer,texWidth,texHeight, samplerA[0],samplerA[1]),
            sampleTexture(pixelsBuffer,texWidth,texHeight, samplerB[0],samplerB[1]),
            sampleTexture(pixelsBuffer,texWidth,texHeight, samplerC[0],samplerC[1]),
        ]
    });
}

function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function flattenY(tri){
    tri[0][1]=0;
    tri[1][1]=0;
    tri[2][1]=0;
    return tri;
}

function sampleTextureDiff(texBuffer, texHeight, texWidth, u, v){
    var resRgb = sampleTexture(texBuffer, texHeight, texWidth, u, v);
    var resRgb_n11 = sampleTexture(texBuffer, texHeight, texWidth, u-1.0/texHeight, v-1.0/texWidth);
    var dist = lineLength([[0,0,0],ptDiff(resRgb, resRgb_n11)]) / 255 ;
    return dist*dist*16;
}

function image2Triangles(pixelsBuffer,texWidth,texHeight, simplifyPercent=0.25, vertColorFlip=false){

    var tris = [];
    var trisColors = [];
    var trisColorsFlat = [];

    // xy
    // 01     11
    // ┌──────┐
    // │ a  / │
    // │   /  │
    // │  /   │
    // │ /  b │
    // └──────┘
    // 00     10

    var w = texWidth;
    var h = texHeight;

    var s = 1.0; //pixel size

    var oy = -texHeight/2;
    var ox = -texWidth/2;

    for(var y=0;y<texHeight;y++){
        for(var x=0;x<texWidth;x++){

            var v00 = sampleTextureDiff(pixelsBuffer, texHeight, texWidth,x/w,y/h);
            var v01 = sampleTextureDiff(pixelsBuffer, texHeight, texWidth,x/w,(y+1)/h);
            var v10 = sampleTextureDiff(pixelsBuffer, texHeight, texWidth,(x+1)/w,y/h);
            var v11 = sampleTextureDiff(pixelsBuffer, texHeight, texWidth,(x+1)/w,(y+1)/h);

            var p00 = [x*s+ox  ,v00,y*s+oy];
            var p01 = [x*s+ox  ,v01,y*s+s+oy];
            var p10 = [x*s+s+ox,v10,y*s+oy];
            var p11 = [x*s+s+ox,v11,y*s+s+oy];

            var c00 = sampleTexture(pixelsBuffer, texHeight, texWidth,x/w,y/h);
            var c01 = sampleTexture(pixelsBuffer, texHeight, texWidth,x/w,(y+1)/h);
            var c10 = sampleTexture(pixelsBuffer, texHeight, texWidth,(x+1)/w,y/h);
            var c11 = sampleTexture(pixelsBuffer, texHeight, texWidth,(x+1)/w,(y+1)/h);

            tris.push([p00, p11, p01]);
            tris.push([p10, p11, p00]);

            if(vertColorFlip){ //not sure why the flip is sometimes needed
                trisColors.push([c00, c01, c11]);
                trisColors.push([c10, c00, c11]);
            }else{
                trisColors.push([c00, c11, c01]);
                trisColors.push([c10, c11, c00]);
            }

            trisColorsFlat.push(averagePts3(c00, c01, c11));
            trisColorsFlat.push(averagePts3(c10, c00, c11));
        }
    }

    var simpTris = [];

    if(simplifyPercent>0 && simplifyPercent<1){
        simpTris = st.simplify(tris,simplifyPercent).map(flattenY);
    }

    tris = tris.map(flattenY);

    var simpTrisColors = triangleColorSamples(simpTris,ox,oy,s,pixelsBuffer,texWidth,texHeight);

    var simpTrisColorsFlat = simpTrisColors.map(cols=>averagePts3(...cols));

    return {
        tris,
        trisColors,
        trisColorsFlat,
        simpTris,
        simpTrisColors,
        simpTrisColorsFlat
    }
}

// function averagePts4(p0, p1, p2, p3){
//     return [(p0[0]+p1[0]+p2[0]+p3[0])/4, (p0[1]+p1[1]+p2[1]+p3[1])/4, (p0[2]+p1[2]+p2[2]+p3[2])/4];
// }

//TODO alt version with grayscale, y = luminance?

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3];
}

module.exports = {
    image2Triangles
}