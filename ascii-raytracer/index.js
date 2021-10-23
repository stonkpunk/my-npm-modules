
var DO_ANTI_ALIAS = false;
var RES = 64;
var ASPECT = 1.0;
var width = DO_ANTI_ALIAS ? RES*2 : RES;//Math.floor(64*4/3);
var height = DO_ANTI_ALIAS ? RES*2 : RES;

width=Math.floor(width*ASPECT);
width+=width%2; //width must be even number

var t0=Date.now();
var adi = require('ascii-data-image');
var dfu = require('./distance-function-utils.js');


var dataRgb_normal = adi.generateRandomImgData_rgb({x:width,y:height});
var dataRgb_color = adi.generateRandomImgData_rgb({x:width,y:height});
var dataBw_depth = adi.generateRandomImgData({x:width,y:height});
var dataBw_ao = adi.generateRandomImgData({x:width,y:height});
var dataBw_shadow = adi.generateRandomImgData({x:width,y:height});

function updateRES(){

    width = DO_ANTI_ALIAS ? RES*2 : RES;//Math.floor(64*4/3);
    height = DO_ANTI_ALIAS ? RES*2 : RES;

    width=Math.floor(width*ASPECT);
    width+=width%2; //width must be even number

    dataRgb_normal = adi.generateRandomImgData_rgb({x:width,y:height});
    dataRgb_color = adi.generateRandomImgData_rgb({x:width,y:height});
    dataBw_depth = adi.generateRandomImgData({x:width,y:height});
    dataBw_ao = adi.generateRandomImgData({x:width,y:height});
    dataBw_shadow = adi.generateRandomImgData({x:width,y:height});
}

//originally from https://github.com/tmcw/literate-raytracer
//CC0 public domain

//ascii data imaging added by bonsai3d

var Vector = require('./Vector.js');

var cameraPhi=Math.PI/2;
var cameraTheta=-Math.PI;

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
          updateCameraAngle();
      }
  }
});
//console.log('Press any key...');

var lastIntPt = null;

var lastIntDist = 9999;


var _noise = require('noisejs');
var noise = new _noise.Noise();

//console.log(noise);



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

module.exports.distanceFunctions = require('./distance-function-examples.js');

module.exports.runScene = function(config){

    var SCENE_DF = config.distanceFunction;//, _RES=64, _ASPECT=1.0, _RAYTRACE_FUNC
    var _RES = config.resolution || 64;
    var _ASPECT = config.aspectRatio || 1.0;
    var _RAYTRACE_FUNC = config.raytraceFunction;
    RES=_RES;
    ASPECT=_ASPECT;
    updateRES();

var SCENE_DF_NORMAL = dfu.fNormalUnitLinePtTurbo_alt(SCENE_DF);





var pts = createCirclePts(1024,16);

var cameraList = pts.map(function(pt){
    return {
        point: {
            x: pt[0],
            y: 0,
            z: pt[1]
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
updateCameraAngle();

function render(scene) {
    var t0 = Date.now();

    var camera = scene.camera;

    var eyeVector = Vector.unitVector(Vector.subtract(camera.vector, camera.point)),
        vpRight = Vector.unitVector(Vector.crossProduct(eyeVector, Vector.UP)),
        vpUp = Vector.unitVector(Vector.crossProduct(vpRight, eyeVector)),

        fovRadians = Math.PI * (camera.fieldOfView / 2) / 180,
        heightWidthRatio = height / width,
        halfWidth = Math.tan(fovRadians),
        halfHeight = heightWidthRatio * halfWidth,
        camerawidth = halfWidth * 2,
        cameraheight = halfHeight * 2,
        pixelWidth = camerawidth / (width - 1),
        pixelHeight = cameraheight / (height - 1);

    var index, color;
    var ray = {
        point: camera.point
    };
    var lightPt = {
        x: 256, y: 256, z: 256
    }

    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {

            // turn the raw pixel `x` and `y` values into values from -1 to 1
            // and use these values to scale the facing-right and facing-up
            // vectors so that we generate versions of the `eyeVector` that are
            // skewed in each necessary direction.
            var xcomp = Vector.scale(vpRight, (x * pixelWidth) - halfWidth),
                ycomp = Vector.scale(vpUp, (y * pixelHeight) - halfHeight);

            ray.vector = Vector.unitVector(Vector.add3(eyeVector, xcomp, ycomp));

            color = dfu.traceNormal(ray,SCENE_DF,SCENE_DF_NORMAL,_RAYTRACE_FUNC);



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
                if(cmode==2 || cmode==4){
                    ao = dfu.calcAO([lastIntPt.x,lastIntPt.y,lastIntPt.z], SCENE_DF, SCENE_DF_NORMAL);
                }
                if(cmode==4){
                    color2 = calcColor([lastIntPt.x,lastIntPt.y,lastIntPt.z])
                }
                if(cmode==3 || cmode==4){
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

            dataRgb_color[y][x][0] = dataRgb_normal[y][x][0] * dataBw_ao[y][x] * dataBw_shadow[y][x];
            dataRgb_color[y][x][1] = dataRgb_normal[y][x][1] * dataBw_ao[y][x] * dataBw_shadow[y][x];
            dataRgb_color[y][x][2] = dataRgb_normal[y][x][2] * dataBw_ao[y][x] * dataBw_shadow[y][x];

            //dataRgb_color[y][x][0] = color2[0];
            //dataRgb_color[y][x][1] = color2[1];
            //dataRgb_color[y][x][2] = color2[2];
        }
    }

    //ctx.putImageData(data, 0, 0);

    var imgStr = adi.data2Img_rgb(DO_ANTI_ALIAS ? reduceByHalf_rgb(dataRgb_normal) : dataRgb_normal);
    var imgStr2 = adi.data2Img_rgb(DO_ANTI_ALIAS ? reduceByHalf_rgb(dataRgb_color) : dataRgb_color);

    var imgStrBw = adi.data2Img(DO_ANTI_ALIAS ? reduceByHalf(dataBw_depth) : dataBw_depth);
    var imgStrBw2 = adi.data2Img(DO_ANTI_ALIAS ? reduceByHalf(dataBw_ao) : dataBw_ao);
    var imgStrBw3 = adi.data2Img(DO_ANTI_ALIAS ? reduceByHalf(dataBw_shadow) : dataBw_shadow);
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
        shadowDataStr: imgStrBw3
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
    var caption = '';

    switch(fiveSecondsPeriods){
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
        case 1:
            caption = 'depth';
            thingToDraw = res.depthDataStr;
            break;
        case 0:
            caption = 'normals';
            thingToDraw = res.normalDataStr;

            //TODO add "world space" color map for bounding box ...
    }



    var msThisFrame = Date.now()-_t0;
    var fps = (1000.0/msThisFrame).toFixed(1);
    //console.log(fps,"fps");

    //var msStr ="\n\n"+ (Date.now()-_t0)+"ms";

    var p = scene.camera.point;
    var status =
    `${p.x.toFixed(2)},${p.y.toFixed(2)},${p.y.toFixed(2)}|p${cameraPhi.toFixed(2)},t${cameraTheta.toFixed(2)}|fov${scene.camera.fieldOfView}`;

    //rocess.stdout.clearLine();
    //process.stdout.moveCursor(0,-2);
    process.stdout.clearLine();
    console.log(`${fps}fps|${caption}|${status}`)
    adi.writeSelfOverwrite(thingToDraw);
    process.stdout.moveCursor(0,-1);
    //process.stdout.write(str);

    i++;

    setTimeout(function(){

        animate();
    },0);
}

animate();


}
