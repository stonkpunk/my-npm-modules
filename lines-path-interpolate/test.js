var lpi = require('./index.js');

//each pt is [x,y,z]
var ptA = [0,0,0];
var ptB = [0,0,1];
var ptC = [1,0,1];
var ptD = [1,0,0];

//each segment consists of two 3d points
var segs = [
    [ptA,ptB],
    [ptB,ptC],
    [ptC,ptD],
    [ptD,ptA]
];

//alternatively, let the library create segments from the pts:
var _segs = lpi.pts2Lines([ptA,ptB,ptC,ptD])

//get linear interpolated point, using fraction of total path length:
var fraction = 0.75;
var pt = lpi.interpAlongLines(segs, fraction); //returns 3d point [x,y,z]

//instead of a fraction of the total path, can also use absolute units:
var theDist = 0.25;
var pt_by_dist = lpi.interpAlongLines_dist(segs, theDist);

//get quadratic bezier interpolated point, with interpolant padding:
var fraction = 0.75;
var bezier_padding = 2.0;
var pt_bez = lpi.interpAlongLines_bezier(segs, fraction, bezier_padding);

//again using distance instead of fraction:
var pt_bez_by_dist = lpi.interpAlongLines_bezier_dist(segs, theDist, bezier_padding);

//get total path length:
var pathLength = lpi.getTraversedLength(segs);

console.log({pt,pt_by_dist,pt_bez,pt_bez_by_dist,pathLength})