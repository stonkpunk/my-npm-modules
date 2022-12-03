var lu = require('./lines-utils.js')
function shiftMesh(mesh,shift){mesh.positions = mesh.positions.map(pos=>lu.addPts(pos,shift));return mesh;}
function scaleMesh(mesh,scale){mesh.positions = mesh.positions.map(pos=>lu.scalePt(pos,scale));return mesh;}
function getSphereTriangles(rad,pt,detail){var mesh = shiftMesh(scaleMesh(ico(detail),rad),pt);var tris = ti.deindexTriangles_meshView(mesh);return tris;}
function flipTri(tri){return [tri[0],tri[2],tri[1]];}
function flipTris(tris){return tris.map(flipTri)}

module.exports = {shiftMesh, scaleMesh}

// var icoDetail = 5;
// var ico = require('icosphere');
//
// var icoRad = 2048;
//var isoTrisInner = flipTris(getSphereTriangles(icoRad,[0,0,0], icoDetail));
//var isoTrisOuter = (getSphereTriangles(icoRad+100,[0,0,0], icoDetail));




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

//bunny=resMesh;
//triangles = ti.deindexTriangles_meshView(bunny);