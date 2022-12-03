var cad = require('jscad'); //adds stuff to global (ugh)
var ti = require('triangles-index');

function flipCell(cell){
    return [cell[0],cell[2],cell[1]];
}

function triangles2Csg(tris, retess=true, canonicalize=true){
    var index = ti.indexTriangles(tris);
    var res = polyhedron({triangles: index.cells.map(flipCell) ,points:index.pts});
    if(retess){
        res = res.reTesselated();
    }
    if(canonicalize){
        res = res.canonicalized();
    }
    return res;
}

function csg2Triangles(csg){

    var res = [];

    csg.polygons.forEach(function(poly){
        var verts = poly.vertices;
        for(var i=1;i<verts.length-1;i++){
            var va = [verts[0].pos._x,verts[0].pos._y,verts[0].pos._z];
            var vb = [verts[i].pos._x,verts[i].pos._y,verts[i].pos._z];
            var vc = [verts[i+1].pos._x,verts[i+1].pos._y,verts[i+1].pos._z];
            res.push(
                [va,vb,vc]
            );
        }

        // return poly.vertices.map(function(vert){
        //     return [vert.pos._x,vert.pos._y,vert.pos._z];
        // })
    });

    return res;
};

module.exports = {triangles2Csg, csg2Triangles};


