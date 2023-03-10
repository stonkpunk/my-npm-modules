var matrixCorners = require('./fps-control/matrix-frustrum-corners.js');
var getPvMatrixFrustrumCorners = matrixCorners.getCorners;
var getOutwardCameraRay = matrixCorners.getOutwardRayXY;

var MOUSE_IS_CAPTURED = false;

var sdl = require('@kmamal/sdl');//.sdl
var createContext = require('@kmamal/gl')
var createRegl = require('regl')
var buildPVMatrix = require('./fps-control/build-pv-matrix.js').buildPVMatrix;
var processKeys = require('./fps-control/fps-keyboard.js').processKeys
var processMouseMove = require('./fps-control/fps-mousemove.js').processMouseMove;

var window = null;//sdl.video.createWindow({resizable: false, opengl: true,})
var escMouseCapture = null;//require('./fps-control/fps-esc-mousecapture.js')(window, function(){MOUSE_IS_CAPTURED=false;}, function(){MOUSE_IS_CAPTURED=true;});

var width, height, native;//window
var gl = null;//createContext(width, height, { window: native, preserveDrawingBuffer:true })
var ext = null;//gl.getExtension('STACKGL_resize_drawingbuffer')
var ext2 = null;//gl.getExtension('oes_texture_float')

var regl = null;//createRegl({ gl })

function createWindow(){
     window = sdl.video.createWindow({resizable: false, opengl: true,})
     escMouseCapture = require('./fps-control/fps-esc-mousecapture.js')(window, function(){MOUSE_IS_CAPTURED=false;}, function(){MOUSE_IS_CAPTURED=true;});

    width=window.width;
    height = window.height;
    native = window.native;

    gl = createContext(width, height, { window: native, preserveDrawingBuffer:true })
    // ext = gl.getExtension('STACKGL_resize_drawingbuffer')

    //demo needs oes_texture_float enabled, do it this way...
    regl = createRegl({ gl,  extensions: ['oes_texture_float', 'STACKGL_resize_drawingbuffer'] })

    // ext = gl.getExtension('oes_texture_float') //doing it this way doesnt seem to work... [before or after regl line]

}

//generate random box [[x,y,z],[x,y,z]]
var randomBox3d = function(){
    var range = 100.0;
    var boxSizeMax = 0.5;
    var p0 = [Math.random()*range-range/2,Math.random()*range-range/2,Math.random()*range-range/2];
    var p1 = [p0[0]+Math.random()*boxSizeMax,p0[1]+Math.random()*boxSizeMax,p0[2]+Math.random()*boxSizeMax];
    return [p0,p1];
}

var randomBoxes = [];
var t0=Date.now();
for(var i=0; i<100; i++){ //100k no problem; 1M still works, little laggy
    randomBoxes.push(randomBox3d());
}
//console.log(`generate ${randomBoxes.length} boxes took ${Date.now()-t0}`);

//todo make 'bunny' cubes
// var m2v = require('mesh-to-voxels');
// var bunny = require('bunny'); //mesh has format {cells, positions}
// var voxels = m2v.meshToVoxels(bunny)

//meshToVoxels(
// mesh,
// iters? = 3, //iterations to recursively break down the mesh bounding box
// cubifyBounds? = true, //turn the mesh bounding box into a cube before start [ensure cube voxels]
// edgesOnly? = true,    //only include voxels straddling the edge of the mesh
// volumeOnly? = false,  //only include voxels totally enclosed within the mesh
// dontSubdivideEnclosedBlocks? = false, //do not subdivide voxels totally enclosed within the mesh
// mergeAfter? = false,  //merge voxels with npm merge-boxes
// meshBvh? = null       //existing BVH
//)




var ba = require('bvh-aabbs');
var fastBVHMode = true; //fast mode vs SAH mode (surface area heuristic)
t0=Date.now();
var bvhArray = ba.aabbsToBvhArray(randomBoxes, fastBVHMode) //bvh data structure, flat array
//console.log(`generate BVH took ${Date.now()-t0}`); //@1M boxes takes 10637 or 2738 for fast mode=true, @100k boxes, takes 1608 or 424 for fast mode=true

//console.log(bvhArray)

module.exports.modelViewer = function() {

    createWindow();

    const raytrace = require('./regls/regl-example-raytrace-dist-bvh-boxes.js').raytraceExample(regl);

    var traceFunc = function(){return 1000.0;};//require('raycasting-utils').trianglesTraceFast_returnIndex_useLine(triangles);

    var cameraData = {
        cameraEye : [-3,12,16],
        cameraTheta : 4.7,
        cameraPhi : 2,
        camera_lookDir : null,
        camera_lookDir2 : null,
        cameraLookTarget : [0,0,0],
        pvMatrix: null,
        up: [0,1,0]
    }

    cameraData.pvMatrix = buildPVMatrix(cameraData.cameraEye, cameraData.cameraLookTarget, cameraData.up)// || autoRes.pvMatrix; //find projected view matrix for camera



    var setupCamera = regl({
        context: {pvMatrix: function (context, props) {return props.pvMatrix},},
        uniforms: {
            pvMatrix: regl.context('pvMatrix'),
        }
    })

    var fps = 0;
    var start = Date.now();
    var fpsUpdate= Date.now();

    // From a flat array
    var texwidth = 2048;
    var texheight = 2048;
    var typedArrayTexture = regl.texture({
        width: texwidth,
        height: texheight,
        data: bvhArray //new Array(texwidth*texheight*4).fill(255)
    })

    function renderOne(){
        fps++;
        regl.clear({color: [0, 0, 0, 1], depth: true})

        var {pvMatrix, cameraEye, cameraLookTarget} = cameraData;

        var _pvMatrix = pvMatrix || buildPVMatrix(cameraEye, cameraLookTarget, [0,1,0]);// || autoRes.pvMatrix; //find projected view matrix for camera
        var centerRay = getOutwardCameraRay(_pvMatrix, 0.5,0.5)
        //var traceRes = traceFunc(centerRay);
        //var cameraDist = traceRes.dist; //traceRes.raw cont

        processKeys(sdl, cameraData, traceFunc);
        processMouseMove(sdl, window, cameraData, MOUSE_IS_CAPTURED);

        var CENTER = centerRay[0];
        var EYE = centerRay[1];

        setupCamera({
            pvMatrix: _pvMatrix,
        }, function () {
            raytrace({
                center1: CENTER,
                eye1: EYE,
                tAABBTexture: typedArrayTexture
            })
        })

        if(Date.now()-fpsUpdate>1000){
            window.setTitle(`${MOUSE_IS_CAPTURED ? 'Press ESC to release mouse' : 'click to capture mouse'}, ctrl-c to quit -- FPS: ${fps}`)
            fps=0;
            fpsUpdate=Date.now();
        }

        gl.swap();

        setTimeout(renderOne,0);
    }

    //this.startRenderLoop = renderOne;

    //this.createWindow = createWindow;

    renderOne();

    return this;
}

//place renderOne stuff into regl.frame(function(){}); to emulate animationFrame stuff -- limited to 60fps tho

//note -- modified regl.js line 339 to be
//check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name + " " + strings)
// [strings contains shader err message]
///Users/user/Documents/tokyo/node_modules/regl/dist/regl.js

