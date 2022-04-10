//based on require('from-3d-to-2d')
/*
license -- https://github.com/hughsk/from-3d-to-2d/blob/master/LICENSE.md
This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function from3Dto2D(arr2dtris, index, v3d, m, w,h) {
    var ix = v3d[0]
    var iy = v3d[1]
    var iz = v3d[2]
    var ox = m[0] * ix + m[4] * iy + m[8] * iz + m[12]
    var oy = m[1] * ix + m[5] * iy + m[9] * iz + m[13]
    var ow = m[3] * ix + m[7] * iy + m[11] * iz + m[15]
    var i2 = index<<1;
    var x =     (ox / ow + 1) / 2
    var y = 1 - (oy / ow + 1) / 2
    arr2dtris[i2] = Math.floor(x*w);
    arr2dtris[++i2] = Math.floor(y*h);
    return arr2dtris
}

function projectTriangles_flat(tris, pvMatrix,w,h) {
    var tris2d = new Float32Array(2 * 3 * tris.length); //use int32 instead? any diff?
    for (var i = 0; i < tris.length; i++) {
        var tri = tris[i];
        var i3 = i*3;
        from3Dto2D(tris2d, i3, tri[0], pvMatrix,w,h);
        from3Dto2D(tris2d, ++i3, tri[1], pvMatrix,w,h);
        from3Dto2D(tris2d, ++i3, tri[2], pvMatrix,w,h);
    }
    return tris2d;
}

module.exports = projectTriangles_flat;