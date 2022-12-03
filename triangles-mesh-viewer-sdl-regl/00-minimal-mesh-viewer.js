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
// const window = sdl.video.createWindow({resizable: false, opengl: true,})
// var escMouseCapture = require('./fps-control/fps-esc-mousecapture.js')(window, function(){MOUSE_IS_CAPTURED=false;}, function(){MOUSE_IS_CAPTURED=true;});

var generateTriangleSoup = require('./utils/generate-triangle-soup.js').triangleSoup;

var window = null;//sdl.video.createWindow({resizable: false, opengl: true,})
var escMouseCapture = null;//require('./fps-control/fps-esc-mousecapture.js')(window, function(){MOUSE_IS_CAPTURED=false;}, function(){MOUSE_IS_CAPTURED=true;});

var width, height, native;//window
var gl = null;//createContext(width, height, { window: native, preserveDrawingBuffer:true })
var ext = null;//gl.getExtension('STACKGL_resize_drawingbuffer')
var ext2 = null;//gl.getExtension('oes_texture_float')

var regl = null;//createRegl({ gl })
var model = null;//require('regl-model')(regl)
function createWindow(){
    window = sdl.video.createWindow({resizable: false, opengl: true,})
    escMouseCapture = require('./fps-control/fps-esc-mousecapture.js')(window, function(){MOUSE_IS_CAPTURED=false;}, function(){MOUSE_IS_CAPTURED=true;});

    width=window.width;
    height = window.height;
    native = window.native;

    gl = createContext(width, height, { window: native, preserveDrawingBuffer:true })
    ext = gl.getExtension('STACKGL_resize_drawingbuffer')
    ext2 = gl.getExtension('oes_texture_float')

    regl = createRegl({ gl })
    model = require('regl-model')(regl);
}
//
// extensions: ['webgl_draw_buffers', 'oes_texture_float'],
// const regl = createRegl({ gl })
// const model = require('regl-model')(regl)
var rgp = require('./my-regl-primitive/src/index.js');
//const bunny = require("../triangles-mesh-viewer-sdl-gl-dev/sdl-opengl/fps/utils-rando/marching-cubes-tests");

var ti = require('triangles-index');

var deMergeMeshTriangles = ti.demergeMeshTriangles_meshView;

module.exports.modelViewer = function(){
    createWindow();
    var bunny = deMergeMeshTriangles(require('bunny'));
    //var colorList = bunny.positions.map(p=>[Math.random(),Math.random(),Math.random()]);

    //bunny.vertexColors = bunny.positions.map((p,i)=>[Math.random(),Math.random(),Math.random()]);
    bunny.faceColors = bunny.cells.map((p,i)=>[Math.random(),Math.random(),Math.random()]);

    var triangles = require('triangles-index').deindexTriangles_meshView(bunny); //list of raw triangles, each one [[x,y,z],[x,y,z],[x,y,z]]
    var traceFunc = require('raycasting-utils').trianglesTraceFast_returnIndex_useLine(triangles);

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
            //texture: regl.texture({ data: image, flipY: true }), //try regl.texture(require('baboon-image'))
        }
    })

    var DO_USE_FBO = false;

    // From a flat array
    var texwidth = 64;
    var texheight = 64;
    var typedArrayTexture = regl.texture({
        minFilter: 'nearest',
        magFilter: 'nearest',
        width: texwidth,
        height: texheight,
        data: new Array(texwidth*texheight*4).fill(255)
    })

    var fbo = null
    var bunnyRegl = null;

    if(DO_USE_FBO){
        fbo = regl.framebuffer({
            color: typedArrayTexture,
            depth: true,
            stencil: true,
        })

        bunnyRegl = rgp(regl, bunny, {framebuffer: () => fbo});
    }else{
        bunnyRegl = rgp(regl, bunny); //generateTriangleSoup
    }

    var drawFullScreenTextureCommand = require('./regls/regl-draw-full-screen-texture.js').drawFullScreenTextureCommand(regl);
    var material = require('./regls/regl-normal-material.js').materalCmd(regl);

    var modelWasChanged = false;
    function updateModel(_newModel){
        bunny = _newModel || generateTriangleSoup();
        modelWasChanged=true;
    }

    var fps = 0;
    var start = Date.now();
    var fpsUpdate= Date.now();

    function runReglStuff(regl){
        if(DO_USE_FBO){
            regl.clear({
                color: [0.1, 0.1, 0.1, 1],
                depth: true,
            })

            regl.clear({
                color: [0.1, 0.1, 0.1, 1],
                depth: true,
                framebuffer: fbo,
            })
        }

        var rotation = [0, 0, 0, 1];
        model({rotation}, () => {
            material(() => {
                var theModel = bunny;
                if(modelWasChanged){
                    bunnyRegl = rgp(regl, theModel, DO_USE_FBO ? {framebuffer: () => fbo} : null);
                    modelWasChanged=false;
                }
                bunnyRegl();
                // example of updating portion of screen w pixels...
                // typedArrayTexture.subimage({
                //     width: 32,
                //     height: 32,
                //     data: new Array(32*32*4).fill(255)
                // }, 1, 1)

                if(DO_USE_FBO){drawFullScreenTextureCommand();} //baboon image! on one big triangle... [todo try rnd image w transparency?]
            })
        })
    }

    function renderOne(){
        fps++;
        regl.clear({color: [0, 0, 0, 1], depth: true})

        var {pvMatrix, cameraEye, cameraLookTarget} = cameraData;

        var _pvMatrix = pvMatrix || buildPVMatrix(cameraEye, cameraLookTarget, [0,1,0]);// || autoRes.pvMatrix; //find projected view matrix for camera
        //var centerRay = getOutwardCameraRay(_pvMatrix, 0.5,0.5)
        //var traceRes = traceFunc(centerRay);
        //var cameraDist = traceRes.dist; //traceRes.raw cont

        processKeys(sdl, cameraData, traceFunc, triangles);
        processMouseMove(sdl, window, cameraData, MOUSE_IS_CAPTURED);

        setupCamera({
            pvMatrix: _pvMatrix,
        }, function () {
            runReglStuff(regl);
        })

        if(Date.now()-fpsUpdate>1000){
            window.setTitle(`${MOUSE_IS_CAPTURED ? 'Press ESC to release mouse' : 'click to capture mouse'}, ctrl-c to quit -- FPS: ${fps}`)
            fps=0;
            fpsUpdate=Date.now();
        }

        gl.swap();

        setTimeout(renderOne,0);
    }
    //renderOne();

    //this.startRenderLoop = renderOne;

    this.updateModel = updateModel;

    renderOne();

    return this;
}

//place renderOne stuff into regl.frame(function(){}); to emulate animationFrame stuff -- limited to 60fps tho

//note -- modified regl.js line 339 to be
//check.raise('Error compiling ' + typeName + ' shader, ' + files[0].name + " " + strings)
// [strings contains shader err message]
///Users/user/Documents/tokyo/node_modules/regl/dist/regl.js

