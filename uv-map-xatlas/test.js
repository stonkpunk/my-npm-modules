
var bunny1 = require('bunny');
const ti = require("triangles-index");
var bunny1tris = ti.deindexTriangles_meshView(bunny1);

var xatlas = require('./index.js');

xatlas.atlasForIndexedTriangles(bunny1, function(res){
    console.log(res);
});

xatlas.atlasForTriangles(bunny1tris, function(res){
    console.log(res);
})

