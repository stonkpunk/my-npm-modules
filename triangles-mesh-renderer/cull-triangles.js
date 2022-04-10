
var triangleNormalDir = require('./triangle-normal.js');
var lu = require('./lines-utils.js');

function cullTriangles(backfaceCulling,frontfaceCulling,cameraEye,_cameraDir,tris,triangleColors,triangleUvs){
    var trisFiltered = [];
    var trisColorsFiltered = [];
    var trianglesUvsFiltered = [];

    //see https://amesweb.info/Physics/Dot-Product-Calculator.aspx
    //<0 --- 90 degree or more
    //<-0.5 --- 120 degree or more [compensate for camera fov]
    //<-0.70711 --- 135

    if(backfaceCulling){
        for(var i=0;i<tris.length;i++){

            var tri = tris[i];
            var triCenter = tri[0]; //just use vert instead
            var cameraDir = lu.normalizeAndCenterLine([cameraEye,triCenter])[1]; //direction from camera eye to the triangle -- different than _cameraDir which is fwd direction

            var a = triangleNormalDir(tri);
            var dotProductRes = a[0]*cameraDir[0]+a[1]*cameraDir[1]+a[2]*cameraDir[2];
            if(dotProductRes  < 0.0){ //isObtuseAngle
                trisFiltered.push(tri);
                if(triangleColors){trisColorsFiltered.push(triangleColors[i]);}
                if(triangleUvs){trianglesUvsFiltered.push(triangleUvs[i]);}
            }
        }
    }else if(frontfaceCulling){
        for(var i=0;i<tris.length;i++){

            var tri = tris[i];
            var triCenter = tri[0]; //just use vert instead
            var cameraDir = lu.normalizeAndCenterLine([cameraEye,triCenter])[1]; //direction from camera eye to the triangle -- different than _cameraDir which is fwd direction

            var a = triangleNormalDir(tri);
            var dotProductRes = a[0]*cameraDir[0]+a[1]*cameraDir[1]+a[2]*cameraDir[2];
            if(dotProductRes > 0.0){ //isAcuteAngle
                trisFiltered.push(tri);
                if(triangleColors){trisColorsFiltered.push(triangleColors[i]);}
                if(triangleUvs){trianglesUvsFiltered.push(triangleUvs[i]);}
            }
        }
    }
    return {
        trisFiltered, trisColorsFiltered, trianglesUvsFiltered
    }
}

function cullTrisInFrontOfCamera(tris,cameraEye,cameraDir, triangleColors, triangleUvs){
    var trisFiltered = [], trisColorsFiltered=[], trianglesUvsFiltered=[];
    //var p1 = lu.addPts(cameraEye,cameraDir);
    var p1d = lu.addPts(cameraEye,lu.scalePt(cameraDir,0.001));

    //TODO use plane op instead ...
    for(var i=0;i<tris.length;i++){
        var tri = tris[i];
        var inFront0 = lu.lineLengthSquared([cameraEye,tri[0]]) > lu.lineLengthSquared([p1d,tri[0]])
        if(inFront0){
            var inFront1 = lu.lineLengthSquared([cameraEye,tri[1]]) > lu.lineLengthSquared([p1d,tri[1]])
            if(inFront1){
                var inFront2 = lu.lineLengthSquared([cameraEye,tri[2]]) > lu.lineLengthSquared([p1d,tri[2]])
                var totallyInFront = inFront2;//inFront0 && inFront1 && inFront2;
                if(totallyInFront){
                    trisFiltered.push(tris[i]);
                    if(triangleColors && triangleColors.length == tris.length){
                        trisColorsFiltered.push(triangleColors[i]);
                    }
                    if(triangleUvs && triangleUvs.length == tris.length){
                        trianglesUvsFiltered.push(triangleUvs[i]);
                    }
                }
            }
        }
    }

    return {trisFiltered, trisColorsFiltered, trianglesUvsFiltered};
}


module.exports.cullTrisInFrontOfCamera = cullTrisInFrontOfCamera;
module.exports.triangleNormalDir = triangleNormalDir;
module.exports.cullTriangles = cullTriangles;