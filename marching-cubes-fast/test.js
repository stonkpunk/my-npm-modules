var mcf = require('./index.js');

//create a signed distance function - here we have 3d simplex noise

var {SimplexNoise} = require('simplex-noise');
var simplex = new SimplexNoise(1004);
var dfSimplex3d = function(x,y,z){
    var s = 20.0
    return simplex.noise3D(x/s,y/s,z/s)+0.5;
}

//polygonize the field - convert it to triangles with marching cubes

var resolution = 32; //scanning resolution, must be a power of 2
var scanBounds = [[0,0,0],[resolution,resolution,resolution]]; //bounding box to scan over

var result = mcf.marchingCubes(resolution, dfSimplex3d, scanBounds);

//console.log(result);

// {
//     positions: [  //vertices
//         [ 0.2039299646182391, 1, 0 ],
//         [ 0, 0.7943976862618888, 0 ],
//         [ 0, 1, 0.8012346044071122 ],
//          ...
//     cells: [      //faces
//         [ 1, 0, 2 ],       [ 3, 4, 5 ],
//         [ 14, 12, 13 ],    [ 14, 13, 10 ],
//         [ 16, 18, 15 ],    [ 19, 21, 20 ],
//         ...

var ti = require('triangles-index');
var art = require('ascii-raytracer');
var tris1 = ti.deindexTriangles_meshView(result);
var config = {
    tris:tris1,
    triangleColors: tris1.map(t=>[Math.random(),Math.random(),Math.random()]),
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:false,
    cameraPos: [22,29,-12],
    cameraRot: [2.2,-4.4]
}
art.runScene(config);
