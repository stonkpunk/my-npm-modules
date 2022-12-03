// The MIT License
// Copyright © 2018 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// Ray Tracing - Primitives. Created by Reinder Nijhoff 2019
// The MIT License
// @reindernijhoff

//https://www.shadertoy.com/view/tl23Rm
//https://www.shadertoy.com/view/MlKfzm
// // Rounded Cone:    https://www.shadertoy.com/view/MlKfzm
// float iRoundedCone( in vec3 ro, in vec3 rd, in vec2 distBound, inout vec3 normal,
// in vec3  pa, in vec3  pb, in float ra, in float rb ) {
//     vec3  ba = pb - pa;
//     vec3  oa = ro - pa;
//     vec3  ob = ro - pb;
//     float rr = ra - rb;
//     float m0 = dot(ba,ba);
//     float m1 = dot(ba,oa);
//     float m2 = dot(ba,rd);
//     float m3 = dot(rd,oa);
//     float m5 = dot(oa,oa);
//     float m6 = dot(ob,rd);
//     float m7 = dot(ob,ob);
//
//     float d2 = m0-rr*rr;
//
//     float k2 = d2    - m2*m2;
//     float k1 = d2*m3 - m1*m2 + m2*rr*ra;
//     float k0 = d2*m5 - m1*m1 + m1*rr*ra*2. - m0*ra*ra;
//
//     float h = k1*k1 - k0*k2;
//     if (h < 0.0) {
//         return MAX_DIST;
//     }
//
//     float t = (-sqrt(h)-k1)/k2;
//
//     float y = m1 - ra*rr + t*m2;
//     if (y>0.0 && y<d2) {
//         if (t >= distBound.x && t <= distBound.y) {
//             normal = normalize( d2*(oa + t*rd)-ba*y );
//             return t;
//         } else {
//             return MAX_DIST;
//         }
//     } else {
//         float h1 = m3*m3 - m5 + ra*ra;
//         float h2 = m6*m6 - m7 + rb*rb;
//
//         if (max(h1,h2)<0.0) {
//             return MAX_DIST;
//         }
//
//         vec3 n = vec3(0);
//         float r = MAX_DIST;
//
//         if (h1 > 0.) {
//             r = -m3 - sqrt( h1 );
//             n = (oa+r*rd)/ra;
//         }
//         if (h2 > 0.) {
//             t = -m6 - sqrt( h2 );
//             if( t<r ) {
//                 n = (ob+t*rd)/rb;
//                 r = t;
//             }
//         }
//         if (r >= distBound.x && r <= distBound.y) {
//             normal = n;
//             return r;
//         } else {
//             return MAX_DIST;
//         }
//     }
// }