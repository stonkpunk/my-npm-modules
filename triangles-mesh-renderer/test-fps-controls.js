var rt = require('./index.js');

var id = require('image-dilate');

var renderLoadingScreen = require('./loading-screen.js').renderLoadingScreen;

var T0=Date.now();
var windowWidth = 640;
var windowHeight = 480;

//basic SDL window
var sdl = require('@kmamal/sdl');
var window = sdl.video.createWindow({ resizable: true, width: windowWidth, height: windowHeight })

var MOUSE_IS_CAPTURED = true;
var escToQuit = require('./fps-esc-to-quit.js')(window, function(){MOUSE_IS_CAPTURED=false;}, function(){MOUSE_IS_CAPTURED=true;});


var lu = require('./lines-utils.js');

var { width, height } = window
var stride = width * 4
var pixelBuffer = Buffer.alloc(width*height*4);

window.on('resize', () => {
    width = window.width;
    height = window.height;
    stride = width * 4;
    pixelBuffer = Buffer.alloc(width*height*4);
})

var drawTextToBuffer = require('draw-pixel-text').drawTextToBuffer;

renderLoadingScreen("LOADING MODEL DATA...", pixelBuffer, width, height, stride, window);

var processKeys = require('./fps-keyboard.js').processKeys
//var updateCamera = require('./fps-update-camera.js');

var processMouseMove = require('./fps-mousemove.js').processMouseMove;

var ti = require('triangles-index');

var bunny = require('bunny'); //{cells, positions}
var triangles = ti.deindexTriangles_meshView(bunny); //list of raw triangles, each one [[x,y,z],[x,y,z],[x,y,z]]

var grt = require('./grid-repeat-triangles.js');
// triangles = grt.repeat(triangles,10,10, 5.0); //tessellate
// bunny = ti.indexTriangles_meshView(triangles);


var fs = require('fs');
var stl = require('stl');


//// heightmap test
var gen = require('generate-heightmap-mesh');
var resolution = 256*1; //x-z resolution of mesh
var size = 64*1;
var boundingBox_XZ = [[-size,0,-size],[size,0,size]];
var df = gen.dfHillsWorld2D; //default distance function
var yCoordinate=0.0; //y-coord to use in 3d distance function sampler
var df_scaleXZ=100.0; //scale df along x-z, default 100 -- you can leave this constant to have the bounding box reveal more land as it expands, OR make this value proportional to the bounding box, to have the result expand to the same size as the bounding box
var df_scaleY=4; //scale result height, default 4
var postSimplifyFactor=0.5; //default 1 [no simplify] -- if less than 1, decimate triangles to the fraction indicated
var doAddSkirt = true; //add "skirt" to heightmap to make it an enclosed mesh. default false.
var skirtY = -10; //y coord for the skirt floor. default 0.
var triangles2 = gen.generateHeightmapMeshXZ(resolution, boundingBox_XZ, df, yCoordinate, df_scaleXZ, df_scaleY, postSimplifyFactor, doAddSkirt, skirtY);
triangles = triangles.concat(triangles2);


var icoDetail = 5;
var ico = require('icosphere');
function shiftMesh(mesh,shift){mesh.positions = mesh.positions.map(pos=>lu.addPts(pos,shift));return mesh;}
function scaleMesh(mesh,scale){mesh.positions = mesh.positions.map(pos=>lu.scalePt(pos,scale));return mesh;}
function getSphereTriangles(rad,pt,detail){var mesh = shiftMesh(scaleMesh(ico(detail),rad),pt);var tris = ti.deindexTriangles_meshView(mesh);return tris;}
function flipTri(tri){return [tri[0],tri[2],tri[1]];}
function flipTris(tris){return tris.map(flipTri)}

var icoRad = 2048;
var isoTrisInner = flipTris(getSphereTriangles(icoRad,[0,0,0], icoDetail));
var isoTrisOuter = (getSphereTriangles(icoRad+100,[0,0,0], icoDetail));

triangles=triangles.concat(isoTrisInner, isoTrisOuter);
bunny = ti.indexTriangles_meshView(triangles);



//triangles = stl.toObject(fs.readFileSync('/Users/user/Documents/tokyo/bonsaifuture/stl/bigstl/park-cgtrader.stl')).facets.map(function(f){return f.verts});
//bunny = ti.indexTriangles_meshView(triangles);
// //triangles = stl.toObject(fs.readFileSync('/Users/user/Documents/tokyo/bonsaifuture/stl/bonsai/bonsai-on-rock.stl')).facets.map(function(f){return f.verts});

//castle test:
//  triangles = stl.toObject(fs.readFileSync('/Users/user/Documents/tokyo/bonsaifuture/stl/bigstl/sandcastle.stl')).facets.map(function(f){return f.verts});
//  bunny = ti.indexTriangles_meshView(triangles);

//city
//  triangles = stl.toObject(fs.readFileSync('/Users/user/Documents/tokyo/bonsaifuture/stl/bigstl/city-cgtrader-half-partial.stl')).facets.map(function(f){return f.verts});
//  bunny = ti.indexTriangles_meshView(triangles);

//nike test:
// triangles = stl.toObject(fs.readFileSync('/Users/user/Documents/tokyo/bonsaifuture/stl/bigstl/nikes-hq.stl')).facets.map(function(f){return f.verts});
// bunny = ti.indexTriangles_meshView(triangles);



function numberWithCommas(x,c=",") { //https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, c);
}

function shortenThousands(n){
    if(n>=1000000){
        (n*0.001*0.001).toFixed(2) + "M"
    }
    return n < 1000 ? n : (n*0.001).toFixed(1) + "K"
}


renderLoadingScreen(`${numberWithCommas(triangles.length)} tris`, pixelBuffer, width, height, stride, window);
renderLoadingScreen(`GENERATING COLORS...`, pixelBuffer, width, height, stride, window);

//renderLoadingScreen("LOADING COLOR DATA...", pixelBuffer);

//
// /Users/user/Documents/tokyo/bonsaifuture/stl/bigstl
// apartments-cgtrader.stl         city-cgtrader.stl               moog-synth.stl                  park-cgtrader.stl
// cheeseburger-cgtrader.stl       fish-tank-nosides.stl           muscle-man.stl                  robot-head.stl
// city-cgtrader-half-partial.stl  hand-hello-bin.stl              nikes-hq.stl                    sandcastle.stl
// city-cgtrader-half.stl          mechanism.stl                   nyc1.stl                        skull-hires.stl

//brew install admesh

var tn = require('./triangle-normal.js');
//var triangleNormalsColors = triangles.map(tn).map(function(norm){return lu.scalePt(lu.normalizePt(lu.addPts(norm,[1,1,1])), 255);})
var triangleNormalsColors = triangles.map(tn).map(function(norm){return lu.scalePt(lu.addPts(norm,[1,1,1]), 128);})
var triangleColorsFlat = triangleNormalsColors;//triangles.map(rt.randomColor); //1 color per triangle [r,g,b] -- [255, 255, 255] for white etc
var triangleColorsVerts = triangles.map(t=>[rt.randomColor(),rt.randomColor(),rt.randomColor()]); //1 color per vert, each triangle gets [[r,g,b],[r,g,b],[r,g,b]]

var fps =0;

var textureData = require('image-sync').read('./uv-test-tile.png'); //{width, height, data, saveAs}

var cameraEye = [-3,12,16];
var pvMatrix = null;

var cameraTheta = 4.7;
var cameraPhi = 2;
var camera_lookDir = null;
var camera_lookDir2 = null;
var cameraLookTarget = [0,5,0];

pvMatrix = rt.buildPVMatrix(cameraEye, cameraLookTarget, [0,1,0]);// || autoRes.pvMatrix; //find projected view matrix for camera


renderLoadingScreen("LOADING RAYTRACER...", pixelBuffer, width, height, stride, window);

var matrixCorners = require('./matrix-frustrum-corners.js');
var getPvMatrixFrustrumCorners = matrixCorners.getCorners;
var getOutwardCameraRay = matrixCorners.getOutwardRayXY;

var threadedCasterReady=false;
var rtat = require('./raycaster-triangle-accumulator-threaded.js');
var TRIANGLE_VISIBLE_LIST = [];

var TRIANGLE_CASTING_TIME=0;
var TRIANGLE_CASTING_TIME_delayed=0;
var NUMBER_OF_TRIANGLES_VISIBLE = 0;

setInterval(function(){
    TRIANGLE_CASTING_TIME_delayed=TRIANGLE_CASTING_TIME;
},200);


var doRaycastingFilter = true;
var lastRaycastUpdate = 0;
var rayCastMinimumInterval = 10; //ms

function updateLoop(){

    setTimeout(function(){
        //console.log("update post");
        var t0=Date.now();

        // var _cameraLookTarget = lu.jitterPt(cameraLookTarget,0.0);
        // var _cameraEye = lu.jitterPt(cameraEye,5.0);
        // var _pvMatrix = rt.buildPVMatrix(_cameraEye, _cameraLookTarget, [0,1,0]);// || autoRes.pvMatrix; //find projected view matrix for camera

        rtat.postUpdate(pvMatrix,cameraEye, function(numberTriangles){
            TRIANGLE_CASTING_TIME=Date.now()-t0
            NUMBER_OF_TRIANGLES_VISIBLE = numberTriangles;
            updateLoop();
        });
    },rayCastMinimumInterval/2);
}



rtat.updateTriangles(bunny, function(){
    rtat.postUpdate(pvMatrix,cameraEye, function(){
        TRIANGLE_VISIBLE_LIST = rtat.pullVisibleTriangleList_raw();

        updateLoop();

        setTimeout(function(){
            renderOne()
        },Date.now()-T0<1000 ? 0 : 2000); //small models load instant, big models have small delay
    });
})

//var raycastGridAtTriangles = require('./raycast-grid-at-triangles.js').raycastGridAtTriangles;
var raycastGridAtTriangles2 = require('./raycast-grid-at-triangles.js').raycastGridAtTriangles_andNeighbors;
var rcu = require('raycasting-utils');


var traceFunc = rcu.trianglesTraceFast_returnIndex_useLine(triangles);

//TODO instead of neighbors, try rtree ? or try "patches"?
//var NEIGHBORS_DEGREE = 3; //for raycasting, hit neighbors to the nth degree [neighbors of neighbors of neighbors etc]
//var tnbe = require('./triangles-neighbors-by-edge.js');
//var trisNeighbors = tnbe.trisNeighborsByEdge_indexed(bunny);

renderLoadingScreen("LOADING TRIANGLE GRAPH...", pixelBuffer, width, height, stride, window);

//var trisNeighbors2 = tnbe.trisNeighborsByEdge_indexed_degreeN(bunny, NEIGHBORS_DEGREE);

renderLoadingScreen("DONE!", pixelBuffer, width, height, stride, window);

var dch = require('./draw-crosshairs.js');

var frameNo = 0;
var TRIS = [];
function renderOne(){
    frameNo++;
    fps++;
    var _pvMatrix = pvMatrix || rt.buildPVMatrix(cameraEye, cameraLookTarget, [0,1,0]);// || autoRes.pvMatrix; //find projected view matrix for camera

    var centerRay = getOutwardCameraRay(_pvMatrix, 0.5,0.5)
    var traceRes = traceFunc(centerRay);
    var cameraDist = traceRes.dist; //traceRes.raw cont

    if(TRIS.length==0){
        TRIS=triangles;
    }

    if(typeof triangles[0].index_orig == 'undefined'){
        triangles=triangles.map(function(tri,i){
            tri.index_orig = i;
            return tri;
        });
    }

    //TODO try mode w just rtree no raycast?
    if(doRaycastingFilter && (Date.now()-lastRaycastUpdate>rayCastMinimumInterval) /*&& NUMBER_OF_TRIANGLES_VISIBLE>0*/){

        var _t0=Date.now()
        // for(var i=0;i<NUMBER_OF_TRIANGLES_VISIBLE;i++){ //takes 2,16,2,16,2,16 for some reason (garbage collection?)
        //     TRIS.push(triangles[TRIANGLE_VISIBLE_LIST[i]]);
        // }

        TRIS = rtat.pullVisibleTriangleList(NUMBER_OF_TRIANGLES_VISIBLE).map(i=>triangles[i]).filter(i=>i); //takes 6-7 each time

        //TODO add function to index.js to draw only index / subset of triangle by id [re-use shared buffer?]
        //+ function to update "global" list of triangles ?

        lastRaycastUpdate=Date.now();
        //console.log("pull list2 took", Date.now()-_t0);
    }

    var flatShading = true; //if false, use per-vertex coloring system, otherwise each triangle is a solid color
    //var doFastSort = false; //if true, uses pigeonhole sort to sort triangles by depth - faster but less accurate
    //TODO unknown err here ? TypeError: Cannot read property 'index_orig' of undefined [attempted fix -- .filter(i=>i) above - can also do -1 triangle but i dont like that]
    var colors = flatShading ? TRIS.map(tri=>triangleColorsFlat[tri.index_orig]) : TRIS.map(tri=>triangleColorsVerts[tri.index_orig]);

    // if(frameNo%2==0){
    //     rt.clearBuffer(pixelBuffer); //reset the buffer to black
    // }

    //console.log(triCastResult.trianglesHit);
    //var TRIS = triCastResult.trianglesHit;//triangles;


    var config = {
        pixelBuffer:pixelBuffer, //flat pixel buffer [r,g,b,a,  r,g,b,a,  r,g,b,a, ... ]
        width:width, //buffer width
        height:height, //buffer height
        triangles:TRIS, //list of triangles, each one has format [[x,y,z],[x,y,z],[x,y,z]]
        triangleColors: colors, //array of colors -- if flatShading=true, [r,g,b] per triangle -- if false, [[r,g,b],[r,g,b],[r,g,b]] for each triangle
        //if you include all these fields, triangles will be rendered with textures:
        // triangleUvs: TRIS.map(tri=>[[0,0.75],[1,0],[1,1]]), //each triangle gets 3 uv's , [ [[u,v],[u,v],[u,v]],  [[u,v],[u,v],[u,v]], ...]
        // textureBuffer: textureData.data, //same format as pixelBuffer
        // textureWidth: textureData.width, //texture width in pixels
        // textureHeight: textureData.height, //texture height in pixels
        cameraEye:cameraEye, //[x,y,z]
        pvMatrix:_pvMatrix, //4x4 matrix
        edgesOnly:false, //default false, wireframe more
        blockyMode: true, //blocky upscale mode
        doUpscale8x: false,
        doUpscale4x: true, //default fault, 4x EPX upscale [4x smaller render]
        doUpscale2x: false,
        depthShading: false,
        doAntiAlias: false, //default false, 2x EPX anti-aliasing [render size unchanged. can be used at same time as upsacle4x.]
        flatShading: flatShading, //default false, flat shading / vertex shading - default false
        doFastSort: true, //default false, enable pigeonhole sort -- faster, less accurate
        backfaceCulling: !doRaycastingFilter, //default true - skip triangles facing away from camera
        frontfaceCulling: false //default false - skip triangles facing camera ["invert" the space] - note - this is ignored if backfaceCulling=true
    }


    var imgData = rt.renderTriangles(config);

    //looks nice but kinda slow
    //imgData = id.dilateColors(imgData,height,width,[0,0,0],1.0);

    var doExpandText = window.fullscreen; //expand text render by 2x
    var textColor = [255,255,255]; //color [r,g,b]
    var textColor2 = [0,0,0]; //color [r,g,b]
    var textOffset = [5,5];
    var textOffset2 = [6,6];
    var maxLineLen = 50;
    var rotStr = ` θφ ${(cameraTheta||0).toFixed(2)} ${(cameraPhi||0).toFixed(2)}`
    var posStr = `xyz ${(cameraEye[0]||0).toFixed(1)} ${(cameraEye[1]||0).toFixed(1)} ${(cameraEye[2]||0).toFixed(1)}`
    var trisStr = `tri ${ shortenThousands(NUMBER_OF_TRIANGLES_VISIBLE /* rt.getRecentlyDrawnTriangles().length*/) }`;
    var distStr = `dst ${cameraDist > 9999 ? "---" : cameraDist.toFixed(1)}`
    var castTimeStr = `ray ${TRIANGLE_CASTING_TIME_delayed}ms`;
    var status = `fps ${lastFps}\n${castTimeStr}\n${posStr}\n${rotStr}\n${trisStr}\n${distStr}\n`;
    drawTextToBuffer(status, textOffset2,textColor2,imgData,width,height, doExpandText, maxLineLen);
    drawTextToBuffer(status, textOffset,textColor,imgData,width,height, doExpandText, maxLineLen);

    dch.drawCrossHairs(width, height, imgData);

    // var blur = require('image-blur-gaussian');
    // var radius = 16;
    // imgData = blur.blurImage(imgData,512,512,radius);



    //render result with SDL
    window.render(width, height, stride, 'rgba32', Buffer.from(imgData)) //note - if using an array for the pixel data instead of a buffer, you need to convert to a buffer with Buffer.from(imgData)

    var res = processKeys(sdl, cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix, traceFunc, triangles);

    camera_lookDir = res.camera_lookDir;
    camera_lookDir2 = res.camera_lookDir2;
    cameraLookTarget = res.cameraLookTarget;
    pvMatrix = res.pvMatrix;

    var res2 = processMouseMove(sdl, window, cameraEye, cameraTheta, cameraPhi, camera_lookDir, camera_lookDir2, cameraLookTarget, pvMatrix, MOUSE_IS_CAPTURED);

    camera_lookDir = res2.camera_lookDir;
    camera_lookDir2 = res2.camera_lookDir2;
    cameraLookTarget = res2.cameraLookTarget;
    pvMatrix = res2.pvMatrix;
    cameraTheta = res2.cameraTheta;
    cameraPhi = res2.cameraPhi;


    //var rndRaycastRay = getOutwardCameraRay(_pvMatrix, Math.random(), Math.random());
    //var cameraDirCenterRay = getOutwardCameraRay(_pvMatrix);

    // console.log("A",normalizeAndCenterLine(cameraDirCenterRay));
    // console.log("B",normalizeAndCenterLine([[0,0,0],res2.camera_lookDir]));

    setTimeout(function(){
        renderOne();
    },1)
}


var lastFps = "0";
setInterval(function(){
    window.setTitle(fps+" fps -- ctrl-c to quit, Esc to uncapture mouse");
    lastFps=fps+"";
    fps=0;
},1000)




