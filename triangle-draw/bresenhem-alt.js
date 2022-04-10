/*

this file based on `npm bresenhem`

changes by stonkpunk:
fn replaced w inline func

original license:

The MIT License (MIT)

Copyright (c) 2014 Bence Dányi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
module.exports = function(x0, y0, x1, y1) {
    var arr = [];
    var dx = x1 - x0;
    var dy = y1 - y0;
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);
    var eps = 0;
    var sx = dx > 0 ? 1 : -1;
    var sy = dy > 0 ? 1 : -1;
    if(adx > ady) {
        for(var x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
            arr.push({ x: x, y: y });
            eps += ady;
            if((eps<<1) >= adx) {
                y += sy;
                eps -= adx;
            }
        }
    } else {
        for(var x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
            arr.push({ x: x, y: y });
            eps += adx;
            if((eps<<1) >= ady) {
                x += sx;
                eps -= ady;
            }
        }
    }
    return arr;
};
