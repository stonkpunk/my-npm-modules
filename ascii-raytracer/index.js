
var scale2x = require('pixel-scale-epx');
var path = require('path');

var DO_ANTI_ALIAS = false;
var DO_SCALE_UP=false; //upscale 2x
var TAKING_SCREENSHOT = false;
var RES = 64;
var ASPECT = 1.0;
var SCREENSHOT_SCALEUP = 4.0;

var raycasting_width = 1;//Math.floor(64*4/3);
var raycasting_height = 1;

var t0=Date.now();
var adi = require('ascii-data-image');
var dfu = require('./distance-function-utils.js');
var ru  = require('./raytrace-utils.js');
var lu = require('./lines-utils.js')
var stl = require('stl');

var dataRgb_normal = adi.generateRandomImgData_rgb({x:raycasting_width,y:raycasting_height});
var dataRgb_color = adi.generateRandomImgData_rgb({x:raycasting_width,y:raycasting_height});
var dataBw_depth = adi.generateRandomImgData({x:raycasting_width,y:raycasting_height});
var dataBw_ao = adi.generateRandomImgData({x:raycasting_width,y:raycasting_height});
var dataBw_shadow = adi.generateRandomImgData({x:raycasting_width,y:raycasting_height});

function pts2Boxes(pts,S=0.5){
    return pts.map(function(pt){
        return [[pt[0]-S,pt[1]-S,pt[2]-S],[pt[0]+S,pt[1]+S,pt[2]+S]];
    });
}

function updateRES(){

    raycasting_width = DO_SCALE_UP ? RES/2 : RES;
    raycasting_height = DO_SCALE_UP ? RES/2 : RES;

    if(DO_ANTI_ALIAS){
        raycasting_width = RES*2;
        raycasting_height = RES*2;
    }

    if(DO_ANTI_ALIAS && DO_SCALE_UP){
        raycasting_width = RES;
        raycasting_height = RES;
    }

    raycasting_width = TAKING_SCREENSHOT ? raycasting_width * SCREENSHOT_SCALEUP : raycasting_width;
    raycasting_height = TAKING_SCREENSHOT ? raycasting_height * SCREENSHOT_SCALEUP : raycasting_height;

    raycasting_width=Math.floor(raycasting_width*ASPECT);
    raycasting_width+=raycasting_width%2; //width must be even number

    dataRgb_normal = adi.generateRandomImgData_rgb({x:raycasting_width,y:raycasting_height});
    dataRgb_color = adi.generateRandomImgData_rgb({x:raycasting_width,y:raycasting_height});
    dataBw_depth = adi.generateRandomImgData({x:raycasting_width,y:raycasting_height});
    dataBw_ao = adi.generateRandomImgData({x:raycasting_width,y:raycasting_height});
    dataBw_shadow = adi.generateRandomImgData({x:raycasting_width,y:raycasting_height});
}

//originally from https://github.com/tmcw/literate-raytracer
//CC0 public domain

//ascii data imaging added by bonsai3d

var Vector = require('./Vector.js');

var cameraPhi=1.87;//Math.PI/2;
var cameraTheta=-2.55;//-Math.PI;
var cameraPhiOrig = cameraPhi;
var cameraThetaOrig = cameraTheta;
var mouseOrig = {x: 0,y:0}

function anglesToCartesian(r,theta,phi){
    //console.log(cameraTheta/Math.PI*180);
    var r = 1.0;
    return[
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta),
    ]
}




function updateCameraAngle(){
    if(scene && scene.camera){
        var angles = anglesToCartesian(100.0,cameraTheta, cameraPhi);
        scene.camera.vector.x = angles[0] + scene.camera.point.x ;
        scene.camera.vector.y = angles[1] + scene.camera.point.y ;
        scene.camera.vector.z = angles[2] + scene.camera.point.z ;
    }
}

//https://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
var readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.on('keypress', (str, key) => {
  if (key.ctrl && key.name === 'c') {
    process.exit();
  } else {

      if(scene && scene.camera){

          var s=0.50;
          var _t=0.05;



          var moveSpeed = s;
          var t = _t;

          if (key.shift){
              moveSpeed = s*5;
              t=_t*5;
          }

          var angles = anglesToCartesian(1,cameraTheta, cameraPhi);
          var angles2 = anglesToCartesian(1,cameraTheta-Math.PI/2.0, Math.PI/2);
          if (key.name === 'w') {
              scene.camera.point.x+=angles[0]*moveSpeed;
              scene.camera.point.y+=angles[1]*moveSpeed;
              scene.camera.point.z+=angles[2]*moveSpeed;
          }
          if (key.name === 's') {
              scene.camera.point.x-=angles[0]*moveSpeed;
              scene.camera.point.y-=angles[1]*moveSpeed;
              scene.camera.point.z-=angles[2]*moveSpeed;
          }
          if (key.name === 'd') {
              //strafing
              scene.camera.point.x+=angles2[0]*moveSpeed;
              scene.camera.point.y+=angles2[1]*moveSpeed;
              scene.camera.point.z+=angles2[2]*moveSpeed;
              //cameraTheta-=t;
          }
          if (key.name === 'a') {
              //strafing
              scene.camera.point.x-=angles2[0]*moveSpeed;
              scene.camera.point.y-=angles2[1]*moveSpeed;
              scene.camera.point.z-=angles2[2]*moveSpeed;
              //cameraTheta+=t;
          }
          if (key.name === 'q') {
              scene.camera.point.y+=moveSpeed;
          }
          if (key.name === 'e') {
              scene.camera.point.y-=moveSpeed;
          }
          if (key.name === 'v') {
              DO_ANTI_ALIAS=!DO_ANTI_ALIAS;
              // if(DO_ANTI_ALIAS && DO_SCALE_UP){
              //     DO_SCALE_UP=false;
              //     //DO_ANTI_ALIAS=false;
              // }
              updateRES();
          }
          if (key.name === 'h') {
              var onOff = (DO_ANTI_ALIAS && DO_SCALE_UP);
              DO_ANTI_ALIAS=!onOff;
              DO_SCALE_UP=!onOff;
              updateRES();
          }
          if (key.name === 'p') {
              TAKING_SCREENSHOT=true;
              updateRES();
          }
          if (key.name === 'u') {
              DO_SCALE_UP= !DO_SCALE_UP;
              // if(DO_SCALE_UP){
              //     DO_ANTI_ALIAS=false;
              // }
              updateRES();
          }
          //
          if (key.name === 'left') {
              cameraTheta+=t;

          }
          if (key.name === 'right') {
              cameraTheta-=t;

          }

          if (key.name === 'up') {
              //cameraPhi+=t;
              cameraPhi-=t;
          }
          if (key.name === 'down') {
              //cameraPhi+=t;
              cameraPhi+=t;
          }

          if (key.name === 'r') {
              //cameraPhi+=t;
              scene.camera.fieldOfView++;

          }
          if (key.name === 'f') {
              //cameraPhi-=t;
              scene.camera.fieldOfView--;
          }

           if (key.name === 'x') {
              //cameraPhi-=t;
              CAMERA_MODE--;
          }
          if (key.name === 'c') {
              //cameraPhi-=t;
              CAMERA_MODE++;
          }
          // if (key.name === 'm') {
          //     MOUSE_CONTROL_ENABLED=!MOUSE_CONTROL_ENABLED
          //     updateMouseControl();
          // }
          updateCameraAngle();
      }
  }
});
//console.log('Press any key...');

var lastIntPt = null;

var lastIntDist = 9999;


var _noise = require('noisejs');
const fs = require("fs");

var noise = new _noise.Noise();

function clamp1(x){return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;} //see https://jsperf.com/clamp-functions/7

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function calcColor(pos){
    var t=0.50;
    var b=1.0;
    var s=3.0;
    var v = (noise.perlin3(pos[0]/s,pos[1]/s,pos[2]/s)+t)*b;
    s=4.0;
    var v2 = (noise.perlin3(pos[1]/s,pos[1]/s,pos[0]/s)+t)*b;
    s=3.0;
    var v3 = (noise.perlin3(pos[2]/s,pos[0]/s,pos[1]/s)+t)*b;
    var res0= [v,v2,v3].map(clamp1);

    var distFromCenter = lineLength([pos,[0,0,0]])+0.0;

    return [1%((distFromCenter%1.0)*2),1%((distFromCenter%1.0)/2.0),(2%(distFromCenter%1.0))/2.0]
}

var createCirclePts = function(_steps, radius){
    var pts = [];
    var steps = _steps || 360;
    var s= radius || 0.250;
    for(var step = 0;step< steps; step++){
        var thisPt = [Math.cos(step/steps*Math.PI*2)*s, Math.sin(step/steps*Math.PI*2)*s, 0];
        //ar nextPt = [Math.cos((step+1)/steps*Math.PI*2)*s, Math.sin((step+1)/steps*Math.PI*2)*s, 0];
        pts.push(thisPt);
    }
    return pts;
};

function unflattenImgDataArrBW(arrFlat, w, h){
     var res = [];//adi.generateRandomImgData_rgb({x:w,y:h});

     for(var y=0;y<h;y++){
         res.push([]);
        for(var x=0;x<w;x++){
            res[y].push(arrFlat[(x+y*w)*4]);
        }
     }
     return res;
}

function unflattenImgDataArr(arrFlat, w, h){
     var res = [];//adi.generateRandomImgData_rgb({x:w,y:h});

     for(var y=0;y<h;y++){
         res.push([]);
        for(var x=0;x<w;x++){
            res[y].push([
                arrFlat[(x+y*w)*4]/255,
                arrFlat[(x+y*w)*4+1]/255,
                arrFlat[(x+y*w)*4+2]/255
            ]);
        }
     }
     return res;
}

function flattenImgDataArr(arrNested,w,h){
     var res=[];
     var data = arrNested;

     for(var y=0;y<h;y++){
        for(var x=0;x<w;x++){

            // var average4r = (data[y][x][0] + data[y+1][x][0]+ data[y][x+1][0] + data[y+1][x+1][0])/4.0;
            // var average4g = (data[y][x][1] + data[y+1][x][1]+ data[y][x+1][1] + data[y+1][x+1][1])/4.0;
            // var average4b = (data[y][x][2] + data[y+1][x][2]+ data[y][x+1][2] + data[y+1][x+1][2])/4.0;
            // reducedOutput[y/2][x/2]=[average4r,average4g,average4b];
            res.push(
                Math.floor(data[y][x][0]*255),
                Math.floor(data[y][x][1]*255),
                Math.floor(data[y][x][2]*255),255);
        }
    }
     return res;
}


function flattenImgDataArrBW(arrNested,w,h){
     var res=[];
     var data = arrNested;

     var dataMin = 9999;
     var dataMax = -9999;
     for(var y=0;y<h;y++){
        for(var x=0;x<w;x++){
            dataMax=Math.max(dataMax,data[y][x]);
            dataMin=Math.min(dataMin,data[y][x]);
        }
    }

     var dataRange = (dataMax-dataMin) || 1.0;

     for(var y=0;y<h;y++){
        for(var x=0;x<w;x++){
            var c = Math.floor((data[y][x]-dataMin)/dataRange*255);
            res.push(c, c, c, 255);
        }
    }
     return res;
}

function reduceByHalf(data){ //reduce pixel data by half
    var height = data.length;
    var width = data[0].length;

    if(width%2!==0){throw 'width must be multiple of 2'}
    if(height%2!==0){throw 'height must be multiple of 2'}

    var reducedOutput = adi.generateRandomImgData({x:width/2,y:height/2});

    for(var x=0;x<width;x+=2){
        for(var y=0;y<height;y+=2){
            var average4 = (data[y][x] + data[y+1][x] + data[y][x+1] + data[y+1][x+1])/4.0;
            reducedOutput[y/2][x/2]=average4;
        }
    }

    return reducedOutput;
}

function reduceByHalf_rgb(data){ //reduce pixel data by half
    var height = data.length;
    var width = data[0].length;

    if(width%2!==0){throw 'width must be multiple of 2'}
    if(height%2!==0){throw 'height must be multiple of 2'}

    var reducedOutput = adi.generateRandomImgData_rgb({x:width/2,y:height/2});

    for(var x=0;x<width;x+=2){
        for(var y=0;y<height;y+=2){
            var average4r = (data[y][x][0] + data[y+1][x][0]+ data[y][x+1][0] + data[y+1][x+1][0])/4.0;
            var average4g = (data[y][x][1] + data[y+1][x][1]+ data[y][x+1][1] + data[y+1][x+1][1])/4.0;
            var average4b = (data[y][x][2] + data[y+1][x][2]+ data[y][x+1][2] + data[y+1][x+1][2])/4.0;
            reducedOutput[y/2][x/2]=[average4r,average4g,average4b];
        }
    }

    return reducedOutput;
}

// # The Scene
var scene = {};
var CAMERA_MODE = 1000000;

var cone2Triangles = require('./cones-to-triangles.js').cone2Triangles;

module.exports.distanceFunctions = require('./distance-function-examples.js');

var MOUSE_CONTROL_ENABLED = false;
var freeCursor = require('./cursor-freedom.js');
const robot = require("robotjs");


var lastCameraUpdate = 0;
function updateMouseControl(){

    if(MOUSE_CONTROL_ENABLED){

        cameraPhiOrig = cameraPhi;
        cameraThetaOrig = cameraTheta;
        mouseOrig = robot.getMousePos();

        function onMouseUpdated(screenSize,mousePos){
            var yo = mouseOrig.y/screenSize.height*(Math.PI);
            var screenCoords01 = [
                ((mousePos.x-mouseOrig.x+screenSize.width)%screenSize.width)/screenSize.width,
                ((mousePos.y+screenSize.height)%screenSize.height)/screenSize.height
            ];
            cameraPhi = cameraPhiOrig + screenCoords01[1]*(Math.PI);
            cameraPhi = Math.min(2*Math.PI-0.1,Math.max(cameraPhi,0)) - yo;

            cameraTheta = cameraThetaOrig - screenCoords01[0]*Math.PI*2.0 ;
            //console.log(screenCoords01);//cameraPhi,cameraTheta);//screenSize,mousePos, screenCoords01);
            if(Date.now()-lastCameraUpdate>100){
                updateCameraAngle();
                lastCameraUpdate=Date.now();
            }
        }

        freeCursor.startFreeMouse(onMouseUpdated);
    }else{
        freeCursor.stopFreeMouse();
    }
}

module.exports.runScene = function(config){

    if(config.mouseControl){
        MOUSE_CONTROL_ENABLED=true;
        updateMouseControl();
    }

    if(config.antiAlias){
        DO_ANTI_ALIAS=true;
    }

    if(config.cameraMode){
        CAMERA_MODE=config.cameraMode;
    }

    if(config.lines && !config.lineColors){
        if(config.lines.length>0){
            if(config.lines[0].color){
                config.lineColors = config.lines.map(l=>l.color);
            }
        }
    }

    if((config.triangles || config.tris) && !config.triangleColors){
        var tris = (config.triangles || config.tris);
        if(tris.length>0){
            if(tris[0].color){
                config.triangleColors = tris.map(l=>l.color);
            }
        }
    }

    var CONE_COLOR_JITTER = 0.0;
    if(config.triangles || config.tris || config.lines){
        if(config.lines){
            var tris = [];
            var r = config.thickness || 1;
            var coneTriLen = 0 ;

            if(config.lineColors){
                config.triangleColors=[];
            }

            config.lines.forEach(function(line,i){
                var res = cone2Triangles({line: line, r0: r, r1: r},3);
                coneTriLen=res.length;
                tris.push(...res);
                if(config.triangleColors){
                    for(var j=0;j<coneTriLen;j++){
                        config.triangleColors.push(lu.jitterPt3d(config.lineColors[i],CONE_COLOR_JITTER));
                    }
                }
            })
            config.triangles=tris;

        }
        var tris = config.triangles || config.tris;
        config.distanceFunction = dfu.trianglesDistFast(tris, 0.10)
        config.raytraceFunction = ru.trianglesTraceFast(tris, 10.0);
    }else if(config.boxes || config.bricks || config.blocks || config.pts || config.points){
        var boxes = config.boxes || config.bricks || config.blocks || pts2Boxes(config.pts || config.points, config.ptSize);
        config.distanceFunction = dfu.sectorsDistFast(boxes,10.00);
        config.raytraceFunction = ru.sectorsTraceFast(boxes,10.00);
    }else if(config.stl){
        var triangles = stl.toObject(fs.readFileSync(config.stl)).facets.map(function(f){return f.verts});
        config.distanceFunction = dfu.trianglesDistFast(triangles, 0.10)
        config.raytraceFunction = ru.trianglesTraceFast(triangles);

        if(config.stlRandomColors){
            var startColor = [0,0.6,0];
            config.triangleColors = triangles.map(t=>lu.jitterColorF(startColor,0.5));
            config.triangles = triangles;
        }
    }

    if(config.triangleColors){//console.log("TCOLORS",config.triangleColors);
        var tris = (config.triangles || config.tris);
        var colors = config.triangleColors;//(config.triangles || config.tris).map(t=>[Math.random(),Math.random(),Math.random()]);
        var dfc = dfu.trianglesColorsFast(tris,colors,0.01);
        var textureFunction3d = function(x,y,z){return dfc(x,y,z);}
        config.textureFunction3d=textureFunction3d;
    }

    var SCENE_DF = config.distanceFunction;//, _RES=64, _ASPECT=1.0, _RAYTRACE_FUNC
    var _RES = config.resolution || 64;
    var _ASPECT = config.aspectRatio || 1.0;
    var _RAYTRACE_FUNC = config.raytraceFunction;
    RES=_RES;
    ASPECT=_ASPECT;

    if(config.screenShotScaleUp){
        SCREENSHOT_SCALEUP = config.screenShotScaleUp;
    }

    updateRES();

    if((config.uvFunction && config.textureFunction) || (config.textureFunction3d)){CAMERA_MODE=1000004;}

    // if(config.colors){
    //     config.textureFunction3d = function(x,y,z){
    //         //var d = Math.abs(art.distanceFunctions.dfBlobWorld(x*15,y*15,z*15))/2.0; //using 3d perlin noise to define color
    //         return [Math.random(),Math.random(),Math.random()] //return [r,g,b]
    //     }
    // }

var SCENE_DF_NORMAL = dfu.fNormalUnitLinePtTurbo_alt(SCENE_DF);



////1.4fps|normals|20.84,3.26,18.65|p1.87,t-2.55|fov45

var pts = [[33.36,9.52,22.71]];//createCirclePts(1024,16);

var cameraList = pts.map(function(pt){
    return {
        point: {
            x: pt[0],
            y: pt[1],
            z: pt[2]
        },
        fieldOfView: 45,
        vector: {
            x: -pt[0],
            y: -12,
            z: -pt[1]
        }
    };
});

scene.camera = cameraList[0];


if(config.cameraPos || config.cameraPosition){
    var pos = config.cameraPos || config.cameraPosition;
    scene.camera.point.x = pos[0];
    scene.camera.point.y = pos[1];
    scene.camera.point.z = pos[2];
}

if(config.cameraRot || config.cameraRotation){
    var rot = config.cameraRot || config.cameraRotation;
    cameraPhi = rot[0];
    cameraTheta = rot[1];
}

updateCameraAngle();

function bwArr2Rgba(bwArr,h,w){
    var expandedArr = new Uint8Array(h*w*4);
    for(var x=0; x<w; x++){
        for(var y=0; y<h; y++){
            expandedArr[(x+y*w)*4] = bwArr[x+y*w];
            expandedArr[(x+y*w)*4+1] = bwArr[x+y*w];
            expandedArr[(x+y*w)*4+2] = bwArr[x+y*w];
            expandedArr[(x+y*w)*4+3] = 255;
        }
    }
    return expandedArr;
}

function render(scene) {
    var t0 = Date.now();

    var camera = scene.camera;

    var eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point)),
        vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
        vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),

        fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
        heightWidthRatio = raycasting_height / raycasting_width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (raycasting_width - 1),
        pixelHeight = cameraheight / (raycasting_height - 1);

    var index, color;
    var ray = {
        point: camera.point
    };
    var lightPt = {
        x: 256, y: 256, z: 256
    }

    for (var x = 0; x < raycasting_width; x++) {
        for (var y = 0; y < raycasting_height; y++) {

            // turn the raw pixel `x` and `y` values into values from -1 to 1
            // and use these values to scale the facing-right and facing-up
            // vectors so that we generate versions of the `eyeVector` that are
            // skewed in each necessary direction.
            var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
                ycomp = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);

            ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

            var normal = dfu.traceNormal(ray,SCENE_DF,SCENE_DF_NORMAL,_RAYTRACE_FUNC); //{x,y,z}

            var color = normal;

            //TODO un-rotate normal according to camera rotation

            var depth = dfu.getLastIntDist();//color.depth;//traceDepth(ray).x;
            var ao = 0.0;
            var color2 = [0,0,0]

            var isInShadow = true;
            lastIntPt=dfu.getLastIntPt();

            /*
             case 4:
            caption = 'composite [hard shadow x ao x normals]';
            thingToDraw = res.colorDataStr;
            break;
        case 3:
            caption = 'hard shadow';
            thingToDraw = res.shadowDataStr;
            break;
        case 2:
            caption = 'ambient occlusion';
            thingToDraw = res.aoDataStr;
            break;
             */

            var cmode = (CAMERA_MODE%5);
            if(lastIntPt && cmode>1){
                if(cmode==2){
                    ao = dfu.calcAO([lastIntPt.x,lastIntPt.y,lastIntPt.z], SCENE_DF, SCENE_DF_NORMAL);
                }
                if(cmode==4){
                    //color2 = calcColor([lastIntPt.x,lastIntPt.y,lastIntPt.z])
                }
                if(cmode==3){
                    isInShadow = dfu.hardShadow(lastIntPt, lightPt, SCENE_DF);
                }
            }
            //
            //var ao = calcAO(lastIntPt);

            //index = (x * 4) + (y * width * 4),
            /*data.data[index + 0] = color.x;
            data.data[index + 1] = color.y;
            data.data[index + 2] = color.z;
            data.data[index + 3] = 255;*/

            dataBw_shadow[y][x] = isInShadow ? 0.5 : 1;
            dataBw_depth[y][x] = 1.0/depth;
            dataBw_ao[y][x] = ao;//1.0/depth;

            dataRgb_normal[y][x][0] = color.x;
            dataRgb_normal[y][x][1] = color.y;
            dataRgb_normal[y][x][2] = color.z;

            if(config.textureFunction3d){
                if(depth>9000){
                    dataRgb_color[y][x][0] = 0;
                    dataRgb_color[y][x][1] = 0;
                    dataRgb_color[y][x][2] = 0;
                }else{
                    var colorResult = config.textureFunction3d(lastIntPt.x,lastIntPt.y,lastIntPt.z);
                    dataRgb_color[y][x][0] = colorResult[0];
                    dataRgb_color[y][x][1] = colorResult[1];
                    dataRgb_color[y][x][2] = colorResult[2];
                }
            }else if(config.uvFunction && config.textureFunction){
                if(depth>9000){
                    dataRgb_color[y][x][0] = 0;
                    dataRgb_color[y][x][1] = 0;
                    dataRgb_color[y][x][2] = 0;
                }else{
                    var uvResult = config.uvFunction(lastIntPt.x,lastIntPt.y,lastIntPt.z);
                    var colorResult = config.textureFunction(uvResult[0],uvResult[1]);
                    dataRgb_color[y][x][0] = colorResult[0];
                    dataRgb_color[y][x][1] = colorResult[1];
                    dataRgb_color[y][x][2] = colorResult[2];
                }
            }else{
               dataRgb_color[y][x][0] = dataRgb_normal[y][x][0] * dataBw_ao[y][x] * dataBw_shadow[y][x];
               dataRgb_color[y][x][1] = dataRgb_normal[y][x][1] * dataBw_ao[y][x] * dataBw_shadow[y][x];
               dataRgb_color[y][x][2] = dataRgb_normal[y][x][2] * dataBw_ao[y][x] * dataBw_shadow[y][x];
            }

            //dataRgb_color[y][x][0] = color2[0];
            //dataRgb_color[y][x][1] = color2[1];
            //dataRgb_color[y][x][2] = color2[2];
        }
    }

    //ctx.putImageData(data, 0, 0);

    // if(DO_SCALE_UP){
    //     dataRgb_normal = scale2x.upscaleRgba2x(flattenImgDataArr(dataRgb_normal), width, height)
    // }

    var dataRgbNormal = dataRgb_normal;
    var dataRgbColor = dataRgb_color;
    var dataBwDepth = dataBw_depth;
    var dataBwAo = dataBw_ao;
    var dataBwShadow = dataBw_shadow;

    //TODO only process the array in use...
    if(DO_ANTI_ALIAS && !DO_SCALE_UP){
        dataRgbNormal = reduceByHalf_rgb(dataRgb_normal);// : dataRgb_normal;
        dataRgbColor = reduceByHalf_rgb(dataRgb_color);// : dataRgb_color;
        dataBwDepth = reduceByHalf(dataBw_depth);// : dataBw_depth;
        dataBwAo = reduceByHalf(dataBw_ao);// : dataBw_ao;
        dataBwShadow = reduceByHalf(dataBw_shadow);// : dataBw_shadow;
    }else if(DO_SCALE_UP && !DO_ANTI_ALIAS){
        dataRgbNormal = unflattenImgDataArr(scale2x.upscaleRgba2x(flattenImgDataArr(dataRgb_normal, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2);
        dataRgbColor = unflattenImgDataArr(scale2x.upscaleRgba2x(flattenImgDataArr(dataRgb_color, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2);

        dataBwDepth = unflattenImgDataArrBW(scale2x.upscaleRgba2x(flattenImgDataArrBW(dataBw_depth, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2);
        dataBwAo = unflattenImgDataArrBW(scale2x.upscaleRgba2x(flattenImgDataArrBW(dataBw_ao, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2);
        dataBwShadow = unflattenImgDataArrBW(scale2x.upscaleRgba2x(flattenImgDataArrBW(dataBw_shadow, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2);
    }else if(DO_SCALE_UP && DO_ANTI_ALIAS){
        dataRgbNormal = reduceByHalf_rgb(unflattenImgDataArr(scale2x.upscaleRgba2x(flattenImgDataArr(dataRgb_normal, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2));
        dataRgbColor = reduceByHalf_rgb(unflattenImgDataArr(scale2x.upscaleRgba2x(flattenImgDataArr(dataRgb_color, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2));

        dataBwDepth = reduceByHalf(unflattenImgDataArrBW(scale2x.upscaleRgba2x(flattenImgDataArrBW(dataBw_depth, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2));
        dataBwAo = reduceByHalf(unflattenImgDataArrBW(scale2x.upscaleRgba2x(flattenImgDataArrBW(dataBw_ao, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2));
        dataBwShadow = reduceByHalf(unflattenImgDataArrBW(scale2x.upscaleRgba2x(flattenImgDataArrBW(dataBw_shadow, raycasting_width, raycasting_height),raycasting_width,raycasting_height),raycasting_width*2,raycasting_height*2));

    }

    var imgStr = adi.data2Img_rgb(dataRgbNormal);
    var imgStr2 = adi.data2Img_rgb(dataRgbColor);

    var imgStrBw = adi.data2Img(dataBwDepth);
    var imgStrBw2 = adi.data2Img(dataBwAo);
    var imgStrBw3 = adi.data2Img(dataBwShadow);
    //rgb image data is NOT normalized

    /*console.log(imgStr);
    console.log(imgStr2);
    console.log(imgStrBw);
    console.log(imgStrBw2);*/

    return {
        normalDataStr: imgStr,
        colorDataStr: imgStr2,
        depthDataStr: imgStrBw,
        aoDataStr: imgStrBw2,
        shadowDataStr: imgStrBw3,
        data:{
            dataRgbNormal: dataRgbNormal,
            dataRgbColor: dataRgbColor,
            dataBwDepth: dataBwDepth,
            dataBwAo: dataBwAo,
            dataBwShadow: dataBwShadow,
        }
    }

    /*adi.writeSelfOverwrite(imgStr);

    setTimeout(function(){adi.writeSelfOverwrite(imgStr2);},1000);
    setTimeout(function(){adi.writeSelfOverwrite(imgStrBw);},2000);
    setTimeout(function(){adi.writeSelfOverwrite(imgStrBw2);},3000);*/

    //TODO synthetic aperture ...

    //console.log("drew in", (Date.now()-t0));
}

var i=0;
function animate(){
    var _t0=Date.now();
    scene.camera = cameraList[0];//i%cameraList.length];
    var res = render(scene);


    var fiveSecondsPeriods = CAMERA_MODE%5;//Math.floor((Date.now()-t0)/4000)%5;
    //console.log(fiveSecondsPeriods)
    var thingToDraw = res.colorDataStr;
    var dataIsRGB=true;
    var thingToDrawData = res.data.dataRgbColor;
    var caption = '';

    switch(fiveSecondsPeriods){
        case 4:
            caption = 'texture';
            thingToDraw = res.colorDataStr;
            thingToDrawData = res.data.dataRgbColor;
            dataIsRGB=true;
            break;
        case 3:
            caption = 'hard shadow';
            thingToDraw = res.shadowDataStr;
            thingToDrawData = res.data.dataBwShadow;
            dataIsRGB=false;
            break;
        case 2:
            caption = 'ambient occlusion';
            thingToDraw = res.aoDataStr;
            thingToDrawData = res.data.dataBwAo;
            dataIsRGB=false;
            break;
        case 1:
            caption = 'depth';
            thingToDraw = res.depthDataStr;
            thingToDrawData = res.data.dataBwDepth;
            dataIsRGB=false;
            break;
        case 0:
            caption = 'normals';
            thingToDraw = res.normalDataStr;
            thingToDrawData = res.data.dataRgbNormal;
            dataIsRGB=true;

            //TODO add "world space" color map for bounding box ...
    }

    if(TAKING_SCREENSHOT){
        thingToDraw="";
    }


    var msThisFrame = Date.now()-_t0;
    var fps = (1000.0/msThisFrame).toFixed(1);
    //console.log(fps,"fps");

    //var msStr ="\n\n"+ (Date.now()-_t0)+"ms";

    var p = scene.camera.point;
    var status =
    `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.z.toFixed(2)}|p${cameraPhi.toFixed(2)},t${cameraTheta.toFixed(2)}|fov${scene.camera.fieldOfView}|AA${DO_ANTI_ALIAS?'on':'off'}|EPX${DO_SCALE_UP?'on':'off'}`;

    if(TAKING_SCREENSHOT){
        status = "taking screenshot..."
    }

    //rocess.stdout.clearLine();
    //process.stdout.moveCursor(0,-2);
    process.stdout.clearLine();
    console.log(`${fps}fps|${caption}|${status}`)
    if(!TAKING_SCREENSHOT){
        adi.writeSelfOverwrite(thingToDraw);
    }else{
        //console.log("ok");
        var _w = (DO_ANTI_ALIAS && !DO_SCALE_UP) ? raycasting_width/2: ((DO_SCALE_UP && !DO_ANTI_ALIAS) ? raycasting_width*2:raycasting_width);
        var _h = (DO_ANTI_ALIAS && !DO_SCALE_UP) ? raycasting_height/2: ((DO_SCALE_UP && !DO_ANTI_ALIAS) ? raycasting_height*2:raycasting_height);

        if(DO_ANTI_ALIAS && DO_SCALE_UP){
            _w=raycasting_width;
            _h=raycasting_height;
        }

        var dataSet=dataIsRGB ? flattenImgDataArr(thingToDrawData,_w,_h) : flattenImgDataArrBW(thingToDrawData,_w,_h);
        var png = require('fast-png');
        var fileData = png.encode({
            width: _w,
            height: _h,
            data: dataSet
        });
        require('fs').writeFileSync(path.resolve(config.screenShotDir || "./", `screenshot_${Date.now()}.png`),fileData);

        TAKING_SCREENSHOT=false;
        updateRES();
    }
    process.stdout.moveCursor(0,-1);
    //process.stdout.write(str);

    i++;



    setTimeout(function(){

        animate();
    },0);
}

animate();


}
