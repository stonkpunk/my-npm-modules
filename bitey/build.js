var stl = require('stl');
var fs = require('fs');
var fileres = fs.readFileSync('./Bitey_Reconstructed_5k.stl');
var tris = stl.toObject(fileres).facets.map(function(f){return f.verts});
var ti = require('triangles-index');

var indexed = ti.indexTriangles_meshView(tris);

indexed.positions = indexed.positions.map(function(pos){
    return [
        parseFloat(pos[0].toFixed(3)),
        parseFloat(pos[1].toFixed(3)),
        parseFloat(pos[2].toFixed(3))
    ]
});

fs.writeFileSync('./index.js', `module.exports = ${JSON.stringify(indexed)};`);

console.log(indexed);