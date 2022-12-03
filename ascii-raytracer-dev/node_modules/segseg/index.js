/*  Ported from Mukesh Prasad's public domain code:
 *    http://tog.acm.org/resources/GraphicsGems/gemsii/xlines.c
 *
 *   This function computes whether two line segments,
 *   respectively joining the input points (x1,y1) -- (x2,y2)
 *   and the input points (x3,y3) -- (x4,y4) intersect.
 *   If the lines intersect, the return value is an array
 *   containing coordinates of the point of intersection.
 *
 *   Params
 *        x1, y1,  x2, y2   Coordinates of endpoints of one segment.
 *        x3, y3,  x4, y4   Coordinates of endpoints of other segment.
 *
 *   Also Accepts:
 *    4 objects with the minimal object structure { x: .., y: ..}
 *    4 arrays where [0] is x and [1] is y
 *
 *   The value returned by the function is one of:
 *
 *        undefined - no intersection
 *        array     - intersection
 *        true      - colinear
 */

function segseg(x1, y1, x2, y2, x3, y3, x4, y4) {

  if (arguments.length === 4) {
    var p1 = x1;
    var p2 = y1;
    var p3 = x2;
    var p4 = y2;

    // assume array [x, y]
    if (p1.length && p1.length === 2) {
      x1 = p1[0];
      y1 = p1[1];
      x2 = p2[0];
      y2 = p2[1];
      x3 = p3[0];
      y3 = p3[1];
      x4 = p4[0];
      y4 = p4[1];

    // assume object with obj.x and obj.y
    } else {
      x1 = p1.x;
      y1 = p1.y;
      x2 = p2.x;
      y2 = p2.y;
      x3 = p3.x;
      y3 = p3.y;
      x4 = p4.x;
      y4 = p4.y;
    }
  }


  var a1, a2, b1, b2, c1, c2; // Coefficients of line eqns.
  var r1, r2, r3, r4;         // 'Sign' values
  var denom, offset;          // Intermediate values
  var x, y;                   // Intermediate return values

  // Compute a1, b1, c1, where line joining points 1 and 2
  // is "a1 x  +  b1 y  +  c1  =  0".
  a1 = y2 - y1;
  b1 = x1 - x2;
  c1 = x2 * y1 - x1 * y2;

  // Compute r3 and r4.
  r3 = a1 * x3 + b1 * y3 + c1;
  r4 = a1 * x4 + b1 * y4 + c1;

  // Check signs of r3 and r4.  If both point 3 and point 4 lie on
  // same side of line 1, the line segments do not intersect.
  if ( r3 !== 0 && r4 !== 0 && ((r3 >= 0 && r4 >= 0) || (r3 < 0 && r4 < 0))) {
    return; // no intersection
  }


  // Compute a2, b2, c2
  a2 = y4 - y3;
  b2 = x3 - x4;
  c2 = x4 * y3 - x3 * y4;

  // Compute r1 and r2
  r1 = a2 * x1 + b2 * y1 + c2;
  r2 = a2 * x2 + b2 * y2 + c2;

  // Check signs of r1 and r2.  If both point 1 and point 2 lie
  // on same side of second line segment, the line segments do
  // not intersect.
  if (r1 !== 0 && r2 !== 0 && ((r1 >= 0 && r2 >= 0) || (r1 < 0 && r2 < 0))) {
    return; // no intersections
  }

  // Line segments intersect: compute intersection point.
  denom = a1 * b2 - a2 * b1;

  if ( denom === 0 ) {
    return true;
  }

  offset = denom < 0 ? - denom / 2 : denom / 2;

  x = b1 * c2 - b2 * c1;
  y = a2 * c1 - a1 * c2;

  return [
    ( x < 0 ? x : x ) / denom,
    ( y < 0 ? y : y ) / denom,
  ];
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = segseg;
}

if (typeof window !== 'undefined') {
  window.segseg = window.segseg || segseg;
}
