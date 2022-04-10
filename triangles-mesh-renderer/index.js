const projectTriangles_flat = require("./project-triangles-flat.js");
var td = require('triangle-draw');
var upscale = require('pixel-scale-epx');

//var drawTriangleColored = td.drawTriangleColored;
var drawTriangle_flat = td.drawTriangle_flat;
var drawTriangleColored_flat = td.drawTriangleColored_flat;
var drawTriangleTextured_flat = td.drawTriangleTextured_flat;
//var drawTriangleColored_flat_depth = td.drawTriangleColored_flat_depth;

var triangles_pigeonHoleSort = require('./triangles-pigeonhole-sort.js');
var triangles_sort = require('./triangles-sort.js');
// const triangles = require("./generate-sample-mesh");
var tia = require('./triangles-add-index.js');

var cullTriangles = require('./cull-triangles.js').cullTriangles;
var cullTrianglesInFrontOfCamera = require('./cull-triangles.js').cullTrisInFrontOfCamera;

var lu = require('./lines-utils.js');

var lineLengthSquared = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return a*a+b*b+c*c;
};

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function averagePts3(p0, p1, p2){
    return [(p0[0]+p1[0]+p2[0])/3, (p0[1]+p1[1]+p2[1])/3, (p0[2]+p1[2]+p2[2])/3];
}
function buildImageData(config){
    var {
        pixelBuffer,
        width,
        height,
        // trianglesGlobal,
        // trianglesIndexShared,
        // trianglesTotal,
        triangles,
        triangleColors,
        textureBuffer,
        textureWidth,
        textureHeight,
        triangleUvs,
        cameraEye,
        pvMatrix,
        edgesOnly=false,
        blockyMode=false,
        doAntiAlias=false,
        doUpscale8x=false,
        doUpscale4x=false,
        doUpscale2x=false,
        depthShading=false,
        flatShading=true,
        doFastSort=false,
        backfaceCulling=true,
        frontfaceCulling=false,
        cameraFrontCulling=true //only draw tris in FRONT of camera
    } = config;

    var tris = triangles;

    // if(trianglesGlobal && trianglesIndexShared && trianglesTotal){
    //     tris = [];
    //
    // }else{
    //     tris = triangles;
    // }

    var cameraDir = [pvMatrix[2],pvMatrix[6],pvMatrix[10]];
    // console.log("matrix dir is", normalizePt( ptDiff(target,cameraEye)) );
    // console.log("extracted dir is", [pvMatrix[2],pvMatrix[6],pvMatrix[10]]);

    if(cameraFrontCulling){
        var {trisFiltered, trisColorsFiltered, trianglesUvsFiltered} =
            cullTrianglesInFrontOfCamera(tris,cameraEye,cameraDir,triangleColors,triangleUvs);
        tris = trisFiltered;
        triangleColors = trisColorsFiltered;
        triangleUvs = trianglesUvsFiltered;
    }

    if(backfaceCulling || frontfaceCulling){

        var {trisFiltered, trisColorsFiltered, trianglesUvsFiltered} =
            cullTriangles(backfaceCulling,frontfaceCulling,cameraEye,cameraDir,tris,triangleColors,triangleUvs);

        tris = trisFiltered;
        triangleColors = trisColorsFiltered;
        triangleUvs = trianglesUvsFiltered;
    }

    var computeWidth = width;
    var computeHeight = height;

    var renderScaleDown = doUpscale8x ? 8 : (doUpscale4x ? 4 : (doUpscale2x ? 2 : 1)); //the scale of the render is reduced 4x if we plan on upscaling it 4x later

    computeWidth /=renderScaleDown;
    computeHeight /=renderScaleDown;

    if(tris.length>0) {

        //console.log("TRIS",tris);

        // if (typeof (tris[0].i) == "undefined" || backfaceCulling || frontfaceCulling) {
        //     tris = tia(tris); //add .i field to triangles
        // }
        tris = tia(tris); //add .i field to triangles so we can track colors after they get sorted...
        //var _t0=Date.now();
        //TODO sort indices not triangles...
        tris = doFastSort ? triangles_pigeonHoleSort(tris, cameraEye) : triangles_sort(tris, cameraEye);
        //console.log("sort took", Date.now()-_t0); //15-19 ms for normal sort, 3-5ms for fast sort
    }

    var tris2dFlatArr = projectTriangles_flat(tris, pvMatrix, computeWidth, computeHeight);

    if(depthShading){

        tris = tia(tris);

        textureWidth=0;
        if(flatShading){
            triangleColors = tris.map(function(tri){
                var d= (10*lu.lineLength([cameraEye, tri[0]]))%255;
                return [d,d,d];
            });
        }else{
            triangleColors = tris.map(function(tri){
                var d0= (10*lu.lineLength([cameraEye, tri[0]]))%255;
                var d1= (10*lu.lineLength([cameraEye, tri[2]]))%255;
                var d2= (10*lu.lineLength([cameraEye, tri[1]]))%255; //TODO why do we need to flip?
                return [[d0,d0,d0],[d1,d1,d1],[d2,d2,d2]];
            });
        }
    }

    if(textureBuffer && textureWidth && textureHeight && triangleUvs){
        for(var i=0;i<tris.length;i++){
            drawTriangleTextured_flat(tris2dFlatArr, i, triangleUvs[tris[i].i], pixelBuffer, computeWidth, computeHeight, textureBuffer, textureWidth, textureHeight, edgesOnly);
        }
    }else{
        if(flatShading){
            for(var i=0;i<tris.length;i++){
                //console.log("DRAW tri",i ,tris[i],tris.length, triangleColors[tris[i].i], tris[i].i);
                drawTriangle_flat(tris2dFlatArr, i, triangleColors[tris[i].i], pixelBuffer, computeWidth, computeHeight, edgesOnly);
            }
        }else{
            for(var i=0;i<tris.length;i++){
                drawTriangleColored_flat(tris2dFlatArr, i, triangleColors[tris[i].i], pixelBuffer, computeWidth, computeHeight, edgesOnly);
            }
        }
    }

    var res = pixelBuffer;
    if(doUpscale8x){
        if(!blockyMode){
            res = upscale.upscaleRgba8x(pixelBuffer,computeWidth,computeHeight,true); //8x bigger; epx upscale
        }else{
            res = upscale.upscaleRgba8x_blocky(pixelBuffer,computeWidth,computeHeight); //8x bigger;
        }
    }
    if(doUpscale4x){
         if(!blockyMode){
             res = upscale.upscaleRgba4x(pixelBuffer,computeWidth,computeHeight,true); //4x bigger; epx upscale
         }else{
             res = upscale.upscaleRgba4x_blocky(pixelBuffer,computeWidth,computeHeight); //4x bigger;
         }

    }else if(doUpscale2x){
        if(!blockyMode){
            res = upscale.upscaleRgba2x(pixelBuffer,computeWidth,computeHeight,true); //2x bigger; epx upscale
        }else{
            res = upscale.upscaleRgba2x_blocky(pixelBuffer,computeWidth,computeHeight); //2x bigger;
        }
    }

    if(doAntiAlias){
        if(doUpscale4x){
            res = upscale.antiAliasRgba2x_inPlace(res,computeWidth*4,computeHeight*4,true)
        }else if(doUpscale2x){
            res = upscale.antiAliasRgba2x_inPlace(res,computeWidth*2,computeHeight*2,true)
        }else{
            res = upscale.antiAliasRgba2x_inPlace(res,computeWidth,computeHeight,false)
        }
    }

    RECENT_TRIS = tris;

    return res;
}

var RECENT_TRIS = [];
function getRecentlyDrawnTriangles(){
    return RECENT_TRIS;
}

var mat4       = require('gl-matrix').mat4

function buildPVMatrix(cameraEye, target=[0,0,0], up=[0, 1, 0], cameraFovRadians=Math.PI/4, aspect=320/240, _viewMatrix=null, NEAR=0.1, FAR=1000){
    var pvMatrix   = new Float32Array(16)
    var projection = new Float32Array(16)
    var viewMatrix   = new Float32Array(16)

    if(_viewMatrix){
        viewMatrix = _viewMatrix
    }else{
        mat4.lookAt(viewMatrix, cameraEye, target, up);
    }

    mat4.perspective(projection
        , cameraFovRadians                  // field of view
        , aspect //width / height // aspect ratio
        , NEAR
        , FAR
    )
    mat4.mul(pvMatrix, projection, viewMatrix)

    // these should be the same:
    // console.log("matrix dir is", normalizePt( ptDiff(target,cameraEye)) );
    // console.log("extracted dir is", [pvMatrix[2],pvMatrix[6],pvMatrix[10]]);

    return pvMatrix;
}

var startT = Date.now();
var pvMatrix   = new Float32Array(16)
var cameraEye = [0,0,1];
function autoRotateCamera(rad, target, speedInv=10, yCoord=rad, fov=Math.PI/4){
    var elapseT = (Date.now()-startT)/1000.0 / speedInv;
    var x = Math.cos(Math.PI*2.0*elapseT + Math.PI/2 )*rad;
    var z = Math.sin(Math.PI*2.0*elapseT + Math.PI/2 )*rad;
    cameraEye = [x,yCoord,z];
    var res = buildPVMatrix(cameraEye, target, [0,1,0], fov);
    pvMatrix = res;
    return {pvMatrix, cameraEye};
}

function randomColor(){
    return [
        Math.floor(Math.random()*255  ),
        Math.floor(Math.random()*255  ),
        Math.floor(Math.random()*255  )
    ]
}

module.exports.getRecentlyDrawnTriangles = getRecentlyDrawnTriangles;

module.exports.randomColor = randomColor;
module.exports.renderTriangles = buildImageData;
module.exports.buildPVMatrix = buildPVMatrix;
module.exports.autoRotateCamera = autoRotateCamera;
module.exports.generateSampleMesh = function(res=32){
    return require('./generate-sample-mesh.js')(res);
}

module.exports.clearBuffer = require('./clear-buffer.js');