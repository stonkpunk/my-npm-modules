/***
 points-in-triangle - implementation of bresenham based triangle rasterization
 by Michael Strassburger <codepoet@cpan.org>
 ***/

//license

/*
The MIT License (MIT) Copyright (c) 2014 Matt DesLauriers

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

//stonkpunk -- added cropping + barycentric coordinate color mapping

var bresenham = require('./bresenhem-alt.js');
var bc = require('barycentric-coordinates');

// var line = (from, to) => bresenham(from[0], from[1], to[0], to[1]);

// var tib = require('./triangle-inside-bounds.js')
const tibf = require("./triangle-inside-bounds-flat.js");
const tobf = require("./triangle-outside-bounds-flat.js");
//const pointsInTriangleVertexColors_flat = require("./points-in-triangle-cropped-barycentric-flat");

// pointsInTriangleVertexColors_flat(triArrFlat, triangleIndex, uvsRemapped, screenWidth,screenHeight, function(x,y,color){
//     sampleTexture_updateBuffer(screenBuffer,screenWidth,x,y,texBuffer,texHeight,texWidth,color[0],color[1])
// }, edgesOnly);

function sampleTexture_updateBuffer(screenBuffer, screenWidth, screenX,screenY, texBuffer,texHeight,texWidth,u,v){
    // var _x = u*texWidth << 0 ;
    // var _y = v*texHeight << 0 ;
    var o = (texWidth*(v*texHeight << 0)+(u*texWidth << 0)) << 2;
    var _o = (screenWidth*screenY+screenX) << 2;
    screenBuffer[_o++] = texBuffer[o++];
    screenBuffer[_o++] = texBuffer[o++];
    screenBuffer[_o] =  texBuffer[o];
}

function compare(a,b){
    return a.y === b.y ? a.x-b.x : a.y-b.y
}

module.exports = (triArrFlat, triangleIndex, triangleVertexUVs, w, h, edgesOnly=false, screenBuffer, texBuffer,texHeight,texWidth) => {

    var screenWidth = w;

    var ti6 = triangleIndex*6;
    var croppingNeeded = !tibf(triArrFlat,ti6 ,w,h);
    var skipTriangle = tobf(triArrFlat,ti6,w,h); if(skipTriangle){return;}

    var tri3d = [
        [triArrFlat[ti6+2*0+0], 0,triArrFlat[ti6+2*0+1]],
        [triArrFlat[ti6+2*1+0], 0,triArrFlat[ti6+2*1+1]],
        [triArrFlat[ti6+2*2+0], 0,triArrFlat[ti6+2*2+1]]
    ];

    // Get all points on the triangles' sides ...
    // let points = [].concat(
    //     bresenham(triArrFlat[ti6+2], triArrFlat[ti6+3], triArrFlat[ti6+4], triArrFlat[ti6+5]),
    //     bresenham(triArrFlat[ti6], triArrFlat[ti6+1], triArrFlat[ti6+4], triArrFlat[ti6+5]),
    //     bresenham(triArrFlat[ti6], triArrFlat[ti6+1], triArrFlat[ti6+2], triArrFlat[ti6+3])
    // )
    // pre-flip lines for asc y coords
    let points = [].concat(
        //if y0<y1, dont flip, otherwise, flip
        triArrFlat[ti6+3] < triArrFlat[ti6+5] ? bresenham(triArrFlat[ti6+2], triArrFlat[ti6+3], triArrFlat[ti6+4], triArrFlat[ti6+5]) : bresenham(triArrFlat[ti6+4], triArrFlat[ti6+5], triArrFlat[ti6+2], triArrFlat[ti6+3]),
        triArrFlat[ti6+1] < triArrFlat[ti6+5] ? bresenham(triArrFlat[ti6], triArrFlat[ti6+1], triArrFlat[ti6+4], triArrFlat[ti6+5]) : bresenham(triArrFlat[ti6+4], triArrFlat[ti6+5], triArrFlat[ti6], triArrFlat[ti6+1]),
        triArrFlat[ti6+1] < triArrFlat[ti6+3] ? bresenham(triArrFlat[ti6], triArrFlat[ti6+1], triArrFlat[ti6+2], triArrFlat[ti6+3]) : bresenham(triArrFlat[ti6+2], triArrFlat[ti6+3], triArrFlat[ti6], triArrFlat[ti6+1])
    )
        // ... and sort them by y, x
    if(!edgesOnly){
        points = points.sort(compare);
    }

    var pl = points.length;

    if(croppingNeeded){
        for(var i=0;i<pl; i++){
            var pt = points[i];
            pt.x=Math.max(pt.x,0);
            pt.y=Math.max(pt.y,0);
            pt.x=Math.min(pt.x,w-1);
            pt.y=Math.min(pt.y,h-1);
        }
    }

    if(edgesOnly){
        //here we draw the edges
        for(var i=0;i<pl;i++){
            var point = points[i];
            var color = bc.triangleInterpolateUVs([point.x,0,point.y],tri3d, triangleVertexUVs[0],triangleVertexUVs[1],triangleVertexUVs[2])
            sampleTexture_updateBuffer(screenBuffer, screenWidth, point.x,point.y, texBuffer,texHeight,texWidth,color[0],color[1])
        }
    }else{
        for(var i=0;i<pl;i++) {
            var point = points[i];
            let next = points[i+1];
            var thePt = [point.x,0,point.y];
            var thePt0 = [point.x+0,0,point.y];

            if (next && point.y === next.y) {
                //var color = point.color;
                for(let x=point.x; x<next.x; x++) { //here we draw the volume
                    var color = bc.triangleInterpolateUVs(thePt0,tri3d, triangleVertexUVs[0],triangleVertexUVs[1],triangleVertexUVs[2])
                    sampleTexture_updateBuffer(screenBuffer, screenWidth, x,point.y, texBuffer,texHeight,texWidth,color[0],color[1])
                    thePt0[0]++;
                }
            } else {
                //here we draw the edges
                var color = bc.triangleInterpolateUVs(thePt,tri3d, triangleVertexUVs[0],triangleVertexUVs[1],triangleVertexUVs[2])
                sampleTexture_updateBuffer(screenBuffer, screenWidth, point.x, point.y, texBuffer,texHeight,texWidth,color[0],color[1])
            }
        }
    }


};
