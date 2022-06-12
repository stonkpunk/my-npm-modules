
var lu = require('./line-utils-basic.js');
//var ti = require('triangles-index');
var art = require('ascii-raytracer');

var m2t = require('./index.js');
var bunny = require('bunny'); //require('icosphere')(3);
var tets = m2t.meshIndexed2Tetrahedra(bunny, -0.025,null,0.75); //if you have a mesh {cells, positions}
//m2t.mesh2Tetrahedra(triangles); //if you have a list of triangles [[x,y,z],[x,y,z],[x,y,z]]

var tris1 = [].concat(...tets.map(m2t.tetra2Triangles));

var tn = m2t.triangleNormal;
var triangleNormalsColors = tris1.map(tn).map(function(norm){return lu.scalePt(lu.normalizePt(lu.addPts(norm,[1,1,1])), 1);})
//var triangleNormalsColors = tris1.map(tn).map(function(norm){return lu.scalePt(lu.addPts(norm,[1,1,1]), 1);})

console.log(tets.length);

var config = {
    tris:tris1,
    triangleColors: triangleNormalsColors,
    resolution: 64,
    aspectRatio: 1.0,
    mouseControl:false,
    cameraPos: [-12.15,10.66,-0.29],
    cameraRot: [2.05,0.05]
}
art.runScene(config);
