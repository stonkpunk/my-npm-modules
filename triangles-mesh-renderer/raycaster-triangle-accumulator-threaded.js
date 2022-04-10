const { Worker } = require('worker_threads')
var MAX_TRIANGLES_VISIBLE = 1100000;
const sharedArrayBuffer = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT * MAX_TRIANGLES_VISIBLE);
var visibleTrianglesIndicesList = new Int32Array(sharedArrayBuffer)

const worker1 = new Worker('./worker-raycaster-triangle-accumulator.js')

var ON_TRIANGLES_UPDATED = null;
var ON_UPDATE_POSTED = null;

function pullVisibleTriangleList_raw(){
    return visibleTrianglesIndicesList;
}

function pullVisibleTriangleList(NUMBER_OF_TRIANGLES_VISIBLE){
    var endOfListFound = false;
    var list = [];
    var i =0;

    if(NUMBER_OF_TRIANGLES_VISIBLE){
        list = Array.from(visibleTrianglesIndicesList.slice(0,NUMBER_OF_TRIANGLES_VISIBLE));
    }else{
        while(!endOfListFound && i<MAX_TRIANGLES_VISIBLE){
            if(visibleTrianglesIndicesList[i]>=0){
                list.push(visibleTrianglesIndicesList[i]);
                i++;
            }else{
                endOfListFound=true
            }
        }
    }

    return list;
}

worker1.on('message', (data) => {
    if(data.trianglesUpdated){
        console.log("triangles updated!");
        if(ON_TRIANGLES_UPDATED){
            ON_TRIANGLES_UPDATED();
        }
    }

    if(data.visibilityListUpdated){
        //console.log("list updated!");
        if(ON_UPDATE_POSTED){
            ON_UPDATE_POSTED(data.numberTriangles);
        }
    }
})

function updateTriangles(trianglesIndexed, onTrianglesUpdated){
    worker1.postMessage({ trianglesIndexed: trianglesIndexed })
    if(onTrianglesUpdated){
        ON_TRIANGLES_UPDATED = onTrianglesUpdated;
    }
}

var FIRST_TIME = true;
function postUpdate(_pvMatrix, cameraEye, onUpdatePosted){
    if(FIRST_TIME){
        worker1.postMessage({ visibleTrianglesIndicesList: visibleTrianglesIndicesList , _pvMatrix: _pvMatrix, cameraEye:cameraEye})
        FIRST_TIME=false;
    }else{
        //this doesnt seem to make a diff
        worker1.postMessage({ /*visibleTrianglesIndicesList: visibleTrianglesIndicesList ,*/ _pvMatrix: _pvMatrix, cameraEye:cameraEye})
    }
    if(onUpdatePosted){
        ON_UPDATE_POSTED = onUpdatePosted;
    }
}

// var rt = require('./index.js');
// var radius = 16;
// var targetPt=[0,0,0];
// var autoRes = rt.autoRotateCamera(radius, targetPt); //generates a camera spinning around the origin
// var pvMatrix = autoRes.pvMatrix; //find projected view matrix for camera
// var cameraEye = autoRes.cameraEye;

module.exports = {updateTriangles, postUpdate, pullVisibleTriangleList, pullVisibleTriangleList_raw};