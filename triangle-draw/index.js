const pointsInTriangle = require('./points-in-triangle-cropped.js');
const pointsInTriangleVertexColors = require('./points-in-triangle-cropped-barycentric.js');

module.exports.drawTriangle = function(tri2d, colorRGB255, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangle(tri2d, imgWidth,imgHeight, function(x,y){
        var o = 4*(imgWidth*y+x);
        buffer[o] = colorRGB255[0];
        buffer[o+1] = colorRGB255[1];
        buffer[o+2] = colorRGB255[2];
    }, edgesOnly);
}

module.exports.drawTriangleColored = function(tri2d, triVertColors, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangleVertexColors(tri2d, triVertColors, imgWidth,imgHeight, function(x,y,color){
        var o = 4*(imgWidth*y+x);
        buffer[o] =    Math.max(0,Math.min(Math.floor(color[0]),255));
        buffer[o+1] =  Math.max(0,Math.min(Math.floor(color[1]),255));
        buffer[o+2] =  Math.max(0,Math.min(Math.floor(color[2]),255));
    }, edgesOnly);
}