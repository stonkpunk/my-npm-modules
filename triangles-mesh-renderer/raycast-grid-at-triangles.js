var rcu = require('raycasting-utils');
const matrixCorners = require("./matrix-frustrum-corners");
var mat4       = require('gl-matrix').mat4
var getOutwardCameraRay = matrixCorners.getOutwardRayXY;

var lu = require('./lines-utils.js');
var triangleNormalDir = require('./triangle-normal.js');


//TODO do recursive quad-trace ?
function raycastGridAtTriangles(_pvMatrix, _triangles, _traceFunc, width=10, height=10, postIters, POST_SCALEDOWN=2){
    var traceFunc = _traceFunc || rcu.trianglesTraceFast_returnIndex_useLine(_triangles);

    var time = Date.now();

    var pvInv = new Float32Array(16)
    mat4.invert(pvInv, _pvMatrix);

    var rx = 0.5+Math.random()-0.5;
    var ry = 0.5+Math.random()-0.5;
    for(var y=0; y<height; y++){
        for(var x=0; x<width; x++){
            var tx = (x+rx)/width;
            var ty = (y+ry)/height;
            var centerRay = getOutwardCameraRay(_pvMatrix, tx,ty, pvInv)
            var traceRes = traceFunc(centerRay);
            if(traceRes.index>=0){
                _triangles[traceRes.index].hitTime = time;
                //resList.push(traceRes);

                //repeat-hit successful hits
                for(var j=0;j<postIters;j++){
                    var s = POST_SCALEDOWN; //scale down
                    var tx2 = tx+(Math.random()/s-0.5/s)/width;
                    var ty2 = ty+(Math.random()/s-0.5/s)/height;
                    centerRay = getOutwardCameraRay(_pvMatrix, tx2,ty2, pvInv)
                    traceRes = traceFunc(centerRay);
                    if(traceRes.index>=0){
                        _triangles[traceRes.index].hitTime = time;
                        //resList.push(traceRes);
                    }
                }

            }
        }
    }

    return {
        triangles: _triangles,
        //trianglesHit: resList.map(r=>triangles[r.index]),
        //resList: resList,
        traceFunc: _traceFunc
    }
}

function hitNeighbors(time, index, centerRay, _triangles, trisNeighbors, doFrontFaceCull, cameraEye){
    var neighbors = trisNeighbors[index];
    var pz = [0,0,0];
    for(var j=0;j<neighbors.length; j++){
        var theTri = _triangles[neighbors[j]];
        var triCenter = theTri[0]; //just using vert instead
        var rayToTriangle = lu.normalizeAndCenterLine([cameraEye, triCenter]);

        var triNorm = triangleNormalDir(theTri);
        var angleRes = lu.dotProductLines([pz,triNorm], rayToTriangle);// > 0.0; // > 0 means acute angle formed, otherwise obtuse
        //console.log({triNorm,centerRay});

        //see https://amesweb.info/Physics/Dot-Product-Calculator.aspx
        //<0 --- 90 degree or more
        //<-0.5 --- 120 degree or more [compensate for camera fov]
        //<-0.70711 --- 135

        if(!doFrontFaceCull || angleRes < 0.0){ //is obtuse angle formed -- faces camera
            theTri.hitTime = time;
        }
    }
}

var frame = 0 ;
//same as above but also updates hit times for neighbors of triangles that get hit...
function raycastGridAtTriangles_andNeighbors(_pvMatrix, _triangles, _traceFunc, width=10, height=10, postIters,POST_SCALEDOWN=2, trisNeighbors, cameraEye, cutoff_time){
    var time = Date.now();
    if(!cutoff_time){
        cutoff_time=time;
    }

    frame++;
    var cutoff_time_half = (time+cutoff_time)/2;
    //var cutoff_time_half = cutoff_time+1000; //alt way of doing it

    if(!_triangles[0].hitTime){
        for(var i=0;i<_triangles.length;i++){
            _triangles[i].hitTime=1;//time-(time-cutoff_time)*Math.random(); //randomize hit times...
        }
    }

    var traceFunc = _traceFunc || rcu.trianglesTraceFast_returnIndex_useLine(_triangles);



    var doBackFaceCull =true;

    var pvInv = new Float32Array(16)
    mat4.invert(pvInv, _pvMatrix);

    var rx = 0.5;// 0.5+Math.random()-0.5;
    var ry = 0.5;//0.5+Math.random()-0.5;

    var f = frame%6;

    if(f==0){}
    if(f==1){rx+=0.25;ry+=0.25;}
    if(f==2){rx+=0.25;ry-=0.25;}
    if(f==3){rx-=0.25;ry+=0.25;}
    if(f==4){rx-=0.25;ry-=0.25;}
    if(f==5){rx+=(Math.random()-0.5);ry+=(Math.random()-0.5);}

    for(var y=0; y<height; y++){
        for(var x=0; x<width; x++){
            var tx = (x+rx)/width;
            var ty = (y+ry)/height;
            var centerRay = lu.normalizeLine(getOutwardCameraRay(_pvMatrix, tx,ty, pvInv))
            var traceRes = traceFunc(centerRay);
            if(traceRes.index>=0 //make sure we hit tri
                && _triangles[traceRes.index].hitTime < cutoff_time_half){ //make sure tri not already hit / displayed on screen

                var TIME = time ;//+ (time-cutoff_time*2)*Math.random();
                _triangles[traceRes.index].hitTime = TIME;
                hitNeighbors(TIME, traceRes.index, centerRay, _triangles, trisNeighbors, doBackFaceCull, cameraEye);

                //repeat-hit successful hits
                var fails = 0;
                var failsMax = 2; //give up after this many fails in a row;
                for(var j=0;j<postIters;j++){
                    var s = POST_SCALEDOWN; //scale down
                    var tx2 = tx+(Math.random()/s-0.5/s)/width;
                    var ty2 = ty+(Math.random()/s-0.5/s)/height;
                    centerRay = getOutwardCameraRay(_pvMatrix, tx2,ty2, pvInv)
                    traceRes = traceFunc(centerRay);
                    if(traceRes.index>=0 //again make sure we hit tri
                        && _triangles[traceRes.index].hitTime < cutoff_time_half){ //again make sure tri not already hit / on screen
                        _triangles[traceRes.index].hitTime = TIME;//time + (time-cutoff_time)*Math.random();
                        hitNeighbors(time, traceRes.index, centerRay, _triangles, trisNeighbors, doBackFaceCull, cameraEye);
                        fails=0;
                    }else{
                        fails++;
                        if(fails>=failsMax){ //quit after multiple fails
                            break;
                        }
                    }
                }

            }
        }
    }

    return {
        triangles: _triangles,
        //trianglesHit: resList.map(r=>triangles[r.index]),
        //resList: resList,
        traceFunc: _traceFunc
    }
}


module.exports = {raycastGridAtTriangles, raycastGridAtTriangles_andNeighbors};
