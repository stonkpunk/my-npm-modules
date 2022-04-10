const {
    parentPort,
} = require('worker_threads')

var ti = require('triangles-index');
var raycastGridAtTriangles1 = require('./raycast-grid-at-triangles.js').raycastGridAtTriangles;//_andNeighbors;
var raycastGridAtTriangles2 = require('./raycast-grid-at-triangles.js').raycastGridAtTriangles_andNeighbors;
var rcu = require('raycasting-utils');
var tnbe = require('./triangles-neighbors-by-edge.js');

var SINGLE_TRIANGLES_MODE = false; //override neighbors logic
var NEIGHBORS_DEGREE = 3; //for raycasting, hit neighbors to the nth degree [neighbors of neighbors of neighbors etc]
var trisNeighbors = [];
var trisNeighbors2 = [];
var triangles = [];
var traceFunc = null;
var readyForUpdate=false;

var SHARED_ARR = null;

parentPort.on('message', (data) => {

    if(data.trianglesIndexed){

        //console.log("TRIS",data.trianglesIndexed.cells);

        readyForUpdate=false;
        //trisNeighbors = tnbe.trisNeighborsByEdge_indexed(data.trianglesIndexed);

        trisNeighbors2 = SINGLE_TRIANGLES_MODE ? [] : tnbe.trisNeighborsByEdge_indexed_degreeN(data.trianglesIndexed, NEIGHBORS_DEGREE);
        triangles = ti.deindexTriangles_meshView(data.trianglesIndexed);
        triangles=triangles.map(function(tri,i){
            tri.orig_index = i;
            return tri;
        });
        traceFunc = rcu.trianglesTraceFast_returnIndex_useLine(triangles);
        readyForUpdate=true;
        parentPort.postMessage({"trianglesUpdated":true})
    }

    if(data.visibleTrianglesIndicesList && readyForUpdate){

        SHARED_ARR = data.visibleTrianglesIndicesList;
    }

    if(data._pvMatrix){

        //data.visibleTrianglesIndicesList=SHARED_ARR;
        var timeNow = Date.now();
        var cutoffTime = timeNow - 2000;
        var T0=Date.now();
        var CASTING_RESOLUTION = 32;
        var POST_ITERS = 8;
        var POST_SCALEDOWN = 1.0;
        //TODO maybe generate random partial masks of 64x64 etc instead of true random

        if(SINGLE_TRIANGLES_MODE){
            raycastGridAtTriangles1(data._pvMatrix,triangles, traceFunc, CASTING_RESOLUTION, CASTING_RESOLUTION, POST_ITERS, POST_SCALEDOWN);//, trisNeighbors2, data.cameraEye, cutoffTime);
        }else{
            raycastGridAtTriangles2(data._pvMatrix,triangles, traceFunc, CASTING_RESOLUTION, CASTING_RESOLUTION, POST_ITERS, POST_SCALEDOWN, trisNeighbors2, data.cameraEye, cutoffTime);
        }


        var TRIS = triangles.filter(function(tri){
            return tri.hitTime && tri.hitTime>cutoffTime;//(timeNow - tri.hitTime) < 5000;
        });
        var L = Math.min(SHARED_ARR.length-1, TRIS.length);
        for(var i=0;i<L;i++){
            SHARED_ARR[i] = TRIS[i].orig_index;
        }
        SHARED_ARR[i+1] = -1; //indicate end of list with -1

        //console.log("cast took",Date.now()-T0);

        parentPort.postMessage({"visibilityListUpdated":true, numberTriangles: L})
    }

    // const arr = data.mySharedArr;
    // arr[0] = 1
    // arr[1] = 12
    // arr[2] = 2
    // parentPort.postMessage({})
})

//TODO accept list of tris then generate trace func, generate neighbors
//TODO share list of visible tris


// share (flattened?) list of tris?
