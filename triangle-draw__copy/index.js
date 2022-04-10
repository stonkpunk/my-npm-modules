const pointsInTriangle = require('./points-in-triangle-cropped.js');
const pointsInTriangleVertexColors = require('./points-in-triangle-cropped-barycentric.js');

const pointsInTriangle_flat = require('./points-in-triangle-cropped-flat.js');
const pointsInTriangleVertexColors_flat = require('./points-in-triangle-cropped-barycentric-flat.js');
const pointsInTriangleVertexColors_flat_depth = require('./points-in-triangle-cropped-barycentric-flat-depth.js');

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

function sampleTexture(texBuffer,texHeight,texWidth,uv){
    var x = Math.floor((uv[0]*texWidth+texWidth)%texWidth);
    var y = Math.floor((uv[1]*texHeight+texHeight)%texHeight);
    var o = 4*(texWidth*y+x);
    return [
        texBuffer[o], texBuffer[o+1], texBuffer[o+2]
    ]
}

module.exports.drawTriangleTextured = function(tri2d, triVertUVs, screenBuffer, screenWidth, screenHeight, texBuffer, texWidth, texHeight, edgesOnly = false){
    pointsInTriangleVertexColors(tri2d, triVertUVs.map(uv=>[uv[0],uv[1],0]), screenWidth,screenHeight, function(x,y,color){
        var uv = [color[0],color[1]]; //interpolated uv position
        var colorTex = sampleTexture(texBuffer,texHeight,texWidth,uv);
        var o = 4*(screenWidth*y+x);
        screenBuffer[o] =    Math.max(0,Math.min(Math.floor(colorTex[0]),255));
        screenBuffer[o+1] =  Math.max(0,Math.min(Math.floor(colorTex[1]),255));
        screenBuffer[o+2] =  Math.max(0,Math.min(Math.floor(colorTex[2]),255));
    }, edgesOnly);
}

module.exports.drawTriangle_flat = function(triArrFlat, triangleIndex, colorRGB255, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangle_flat(triArrFlat, triangleIndex, imgWidth,imgHeight, function(x,y){
        var o = 4*(imgWidth*y+x);
        buffer[o] = colorRGB255[0];
        buffer[o+1] = colorRGB255[1];
        buffer[o+2] = colorRGB255[2];
    }, edgesOnly);
}

module.exports.drawTriangleColored_flat = function(triArrFlat, triangleIndex, triVertColors, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangleVertexColors_flat(triArrFlat, triangleIndex, triVertColors, imgWidth,imgHeight, function(x,y,color){
        var o = 4*(imgWidth*y+x);
        buffer[o] =    Math.max(0,Math.min(Math.floor(color[0]),255));
        buffer[o+1] =  Math.max(0,Math.min(Math.floor(color[1]),255));
        buffer[o+2] =  Math.max(0,Math.min(Math.floor(color[2]),255));
    }, edgesOnly);
}

module.exports.drawTriangleTextured_flat = function(triArrFlat, triangleIndex, triVertUVs, screenBuffer, screenWidth, screenHeight, texBuffer, texWidth, texHeight, edgesOnly = false){
    pointsInTriangleVertexColors_flat(triArrFlat, triangleIndex, triVertUVs.map(uv=>[uv[0],uv[1],0]), screenWidth,screenHeight, function(x,y,color){
        var uv = [color[0],color[1]]; //interpolated uv position
        var colorTex = sampleTexture(texBuffer,texHeight,texWidth,uv);
        var o = 4*(screenWidth*y+x);
        screenBuffer[o] =    Math.max(0,Math.min(Math.floor(colorTex[0]),255));
        screenBuffer[o+1] =  Math.max(0,Math.min(Math.floor(colorTex[1]),255));
        screenBuffer[o+2] =  Math.max(0,Math.min(Math.floor(colorTex[2]),255));
    }, edgesOnly);
}


module.exports.drawTriangleColored_flat_depth = function(triArrFlat, triangleIndex, triVertColors, triDepths, buffer, bufferDepth, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangleVertexColors_flat_depth(triArrFlat, triangleIndex, triVertColors, triDepths, bufferDepth, imgWidth,imgHeight, function(x,y,color, depthHere){
        var o = 4*(imgWidth*y+x);
        buffer[o] =    Math.max(0,Math.min(Math.floor(color[0]),255));
        buffer[o+1] =  Math.max(0,Math.min(Math.floor(color[1]),255));
        buffer[o+2] =  Math.max(0,Math.min(Math.floor(color[2]),255));
        bufferDepth[imgWidth*y+x] = Math.min(bufferDepth[imgWidth*y+x], depthHere);
    }, edgesOnly);
}