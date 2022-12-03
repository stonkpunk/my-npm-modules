var stl = require('stl')
var fs = require('fs');
var jf = require('jsonfile');

// var tris1 = stl.toObject(fs.readFileSync('./Bitey_Reconstructed_rotated_5k.stl')).facets.map(function(f){return f.verts.map(function(v){
//     return v.map(c=>parseFloat(c.toFixed(1)))
// });});

var tris2 = stl.toObject(fs.readFileSync('./Bitey_Reconstructed_rotated_5k.stl')).facets.map(function(f){return f.verts.map(function(v){
    return v.map(c=>parseFloat(c.toFixed(2)))
});});

// var tris3 = stl.toObject(fs.readFileSync('./Bitey_Reconstructed_rotated_5k.stl')).facets.map(function(f){return f.verts.map(function(v){
//     return v.map(c=>parseFloat(c.toFixed(3)))
// });});

//console.log(tris3);


//jf.writeFileSync('Bitey_Reconstructed_rotated_5k_1digit.json',tris1);

jf.writeFileSync('Bitey_Reconstructed_rotated_5k_2digit.json',tris2);

//jf.writeFileSync('Bitey_Reconstructed_rotated_5k_3digit.json',tris3);