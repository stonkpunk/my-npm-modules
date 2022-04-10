/***
 points-in-triangle - implementation of bresenham based triangle rasterization
 by Michael Strassburger <codepoet@cpan.org>
 ***/

//stonkpunk -- added cropping

const bresenham = require('bresenham');

//const line = (from, to) => bresenham(from[0], from[1], to[0], to[1]);

var tibf = require('./triangle-inside-bounds-flat.js')
const tobf = require("./triangle-outside-bounds-flat.js");

module.exports = (triArrFlat, triangleIndex, w, h, callback, edgesOnly=false) => {

    var croppingNeeded = !tibf(triArrFlat,triangleIndex*6 ,w,h);
    var skipTriangle = tobf(triArrFlat,triangleIndex*6,w,h); if(skipTriangle){return;}

    // Get all points on the triangles' sides ...
    let points = [].concat(
        bresenham(triArrFlat[triangleIndex*6+2*1+0], triArrFlat[triangleIndex*6+2*1+1], triArrFlat[triangleIndex*6+2*2+0], triArrFlat[triangleIndex*6+2*2+1]),
        bresenham(triArrFlat[triangleIndex*6+2*0+0], triArrFlat[triangleIndex*6+2*0+1], triArrFlat[triangleIndex*6+2*2+0], triArrFlat[triangleIndex*6+2*2+1]),
        bresenham(triArrFlat[triangleIndex*6+2*0+0], triArrFlat[triangleIndex*6+2*0+1], triArrFlat[triangleIndex*6+2*1+0], triArrFlat[triangleIndex*6+2*1+1])
        // bresenham(triangle[1][0], triangle[1][1], triangle[2][0], triangle[2][1])
        // bresenham(triangle[0][0], triangle[0][1], triangle[2][0], triangle[2][1])
        // bresenham(triangle[0][0], triangle[0][1], triangle[1][0], triangle[1][1])
        // line(triangle[1], triangle[2]),
        // line(triangle[0], triangle[2]),
        // line(triangle[0], triangle[1])
    )
        // ... and sort them by y, x
        .sort((a, b) => a.y === b.y ? a.x-b.x : a.y-b.y)

    if(croppingNeeded){
        points = points.map(function(pt){
            pt.x=Math.max(pt.x,0);
            pt.y=Math.max(pt.y,0);
            pt.x=Math.min(pt.x,w-1);
            pt.y=Math.min(pt.y,h-1);
            return pt;
        });
    }

    if(edgesOnly){
        // To finally iterate over the space between each point
        points.forEach((point, i) => {
            //let next = points[i+1];
            //if (next && point.y === next.y) {
                // for(let x=point.x; x<next.x; x++) {
                //     callback(x, point.y);
                // }
            //} else {
                callback(point.x, point.y);
            //}
        });
    }else{
        points.forEach((point, i) => {
            let next = points[i+1];
            if (next && point.y === next.y) {
                for(let x=point.x; x<next.x; x++) {
                    callback(x, point.y);
                }
            } else {
                callback(point.x, point.y);
            }
        });
    }
};
