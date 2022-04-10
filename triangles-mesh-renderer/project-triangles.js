//based on require('from-3d-to-2d')
/*
license -- https://github.com/hughsk/from-3d-to-2d/blob/master/LICENSE.md
This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function from3Dto2D(out, v3d, m, w,h) {
    var ix = v3d[0]
    var iy = v3d[1]
    var iz = v3d[2]
    var ox = m[0] * ix + m[4] * iy + m[8] * iz + m[12]
    var oy = m[1] * ix + m[5] * iy + m[9] * iz + m[13]
    var ow = m[3] * ix + m[7] * iy + m[11] * iz + m[15]

    out[0] =     (ox / ow + 1) / 2
    out[1] = 1 - (oy / ow + 1) / 2

    out[0] = Math.floor(out[0]*w/2+w/2);
    out[1] = Math.floor(out[1]*h/2+h/2);

    // arr2dtris[2*index+0] *= 500;
    // arr2dtris[2*index+1] *= 500;

    // vec3 ndc = gl_Position.xyz / gl_Position.w; //perspective divide/normalize
    // vec2 viewportCoord = ndc.xy * 0.5 + 0.5; //ndc is -1 to 1 in GL. scale for 0 to 1
    // vec2 viewportPixelCoord = viewportCoord * viewportSize;

    //console.log(out)

    return out
}

function projectTriangles(tris, pvMatrix,w,h) {
    var tris2d = [];
    for (var i = 0; i < tris.length; i++) {
        var tri = tris[i];
        var a = from3Dto2D([0,0], tri[0], pvMatrix,w,h);
        var b = from3Dto2D([0,0], tri[1], pvMatrix,w,h);
        var c = from3Dto2D([0,0], tri[2], pvMatrix,w,h);
        tris2d.push([a,b,c]);
    }
    return tris2d;
}

module.exports = projectTriangles