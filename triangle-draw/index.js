const pointsInTriangle = require('./points-in-triangle-cropped.js');
const pointsInTriangleVertexColors = require('./points-in-triangle-cropped-barycentric.js');

const pointsInTriangle_flat = require('./points-in-triangle-cropped-flat.js');
const pointsInTriangleVertexColors_flat = require('./points-in-triangle-cropped-barycentric-flat.js');
const pointsInTriangleVertexColors_flat_texUpdate = require('./points-in-triangle-cropped-barycentric-flat-texUpdate.js');
const pointsInTriangleVertexColors_flat_depth = require('./points-in-triangle-cropped-barycentric-flat-depth.js');

module.exports.drawTriangle = function(tri2d, colorRGB255, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangle(tri2d, imgWidth,imgHeight, function(x,y){
        var o = 4*(imgWidth*y+x);
        buffer[o] = colorRGB255[0];
        buffer[++o] = colorRGB255[1];
        buffer[++o] = colorRGB255[2];
    }, edgesOnly);
}

module.exports.drawTriangleColored = function(tri2d, triVertColors, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangleVertexColors(tri2d, triVertColors, imgWidth,imgHeight, function(x,y,color){
        var o = 4*(imgWidth*y+x);
        buffer[o] =    color[0]//Math.max(0,Math.min(Math.floor(color[0]),255));
        buffer[++o] =  color[1]//Math.max(0,Math.min(Math.floor(color[1]),255));
        buffer[++o] =  color[2]//Math.max(0,Math.min(Math.floor(color[2]),255));
    }, edgesOnly);
}

function sampleTexture(texBuffer,texHeight,texWidth,u,v){
    var x = Math.floor((u*texWidth+texWidth)%texWidth);
    var y = Math.floor((v*texHeight+texHeight)%texHeight);
    var o = 4*(texWidth*y+x);
    return [
        texBuffer[o], texBuffer[o+1], texBuffer[o+2]
    ]
}

function sampleTexture_updateBuffer(screenBuffer, screenWidth, screenX,screenY, texBuffer,texHeight,texWidth,u,v){
    var _x = u*texWidth << 0 ;
    var _y = v*texHeight << 0 ;
    var o = (texWidth*_y+_x) << 2;
    var _o = (screenWidth*screenY+screenX) << 2;
    screenBuffer[_o] =    texBuffer[o];
    screenBuffer[++_o] =  texBuffer[++o];
    screenBuffer[++_o] =  texBuffer[++o];;
}

module.exports.drawTriangleTextured = function(tri2d, triVertUVs, screenBuffer, screenWidth, screenHeight, texBuffer, texWidth, texHeight, edgesOnly = false){
    var uvsRemapped = triVertUVs;
    if(triVertUVs[0].length==2){uvsRemapped = triVertUVs.map(uv=>[uv[0],uv[1],0])} //only if needed, change 2d uvs to 3d pts to use the existing vertex color interp func to interp the uvs
    pointsInTriangleVertexColors(tri2d, uvsRemapped, screenWidth,screenHeight, function(x,y,color){
        sampleTexture_updateBuffer(screenBuffer,screenWidth,x,y,texBuffer,texHeight,texWidth,color[0],color[1])
    }, edgesOnly);
}

module.exports.drawTriangle_flat = function(triArrFlat, triangleIndex, colorRGB255, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangle_flat(triArrFlat, triangleIndex, imgWidth,imgHeight, function(x,y){
        var o = 4*(imgWidth*y+x);
        buffer[o] = colorRGB255[0];
        buffer[++o] = colorRGB255[1];
        buffer[++o] = colorRGB255[2];
    }, edgesOnly);
}

module.exports.drawTriangleColored_flat = function(triArrFlat, triangleIndex, triVertColors, buffer, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangleVertexColors_flat(triArrFlat, triangleIndex, triVertColors, imgWidth,imgHeight, function(x,y,color){
        var o = 4*(imgWidth*y+x);
        buffer[o] =    color[0];
        buffer[++o] =  color[1];
        buffer[++o] =  color[2];
    }, edgesOnly);
}

// module.exports.drawTriangleTextured_flat = function(triArrFlat, triangleIndex, triVertUVs, screenBuffer, screenWidth, screenHeight, texBuffer, texWidth, texHeight, edgesOnly = false){
//     var uvsRemapped = triVertUVs;
//     if(triVertUVs[0].length==2){uvsRemapped = triVertUVs.map(uv=>[uv[0],uv[1],0])} //only if needed, change 2d uvs to 3d pts to use the existing vertex color interp func to interp the uvs
//     pointsInTriangleVertexColors_flat(triArrFlat, triangleIndex, uvsRemapped, screenWidth,screenHeight, function(x,y,color){
//         sampleTexture_updateBuffer(screenBuffer,screenWidth,x,y,texBuffer,texHeight,texWidth,color[0],color[1])
//     }, edgesOnly);
// }

//inline version of the above...
module.exports.drawTriangleTextured_flat = function(triArrFlat, triangleIndex, triVertUVs, screenBuffer, screenWidth, screenHeight, texBuffer, texWidth, texHeight, edgesOnly = false){
    var uvsRemapped = triVertUVs;
    //if(triVertUVs[0].length==2){uvsRemapped = triVertUVs.map(uv=>[uv[0],uv[1],0])} //only if needed, change 2d uvs to 3d pts to use the existing vertex color interp func to interp the uvs
    pointsInTriangleVertexColors_flat_texUpdate(triArrFlat, triangleIndex, uvsRemapped, screenWidth, screenHeight, edgesOnly, screenBuffer, texBuffer, texWidth, texHeight);
}


module.exports.drawTriangleColored_flat_depth = function(triArrFlat, triangleIndex, triVertColors, triDepths, buffer, bufferDepth, imgWidth, imgHeight, edgesOnly = false){
    pointsInTriangleVertexColors_flat_depth(triArrFlat, triangleIndex, triVertColors, triDepths, bufferDepth, imgWidth,imgHeight, function(x,y,color, depthHere){
        var o = 4*(imgWidth*y+x);
        buffer[o] =    color[0];
        buffer[++o] =  color[1];
        buffer[++o] =  color[2];
        bufferDepth[imgWidth*y+x] = Math.min(bufferDepth[imgWidth*y+x], depthHere);
    }, edgesOnly);
}