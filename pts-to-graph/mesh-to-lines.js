function edgeHash(i0,i1){
    var minI = Math.min(i0,i1);
    var maxI = Math.max(i0,i1);
    return `${minI}_${maxI}`;
}

function mesh2Lines(mesh){
    var edgeMap = {};
    var lines = [];

    function addEdge(cell0,cell1){
        var h0 = edgeHash(cell0,cell1);
        if(!edgeMap[h0]){
            edgeMap[h0] = true;
            var pa = mesh.positions[cell0];
            var pb = mesh.positions[cell1];
            lines.push([pa,pb]);
        }
    }

    mesh.cells.forEach(function(cell){
        addEdge(cell[0],cell[1]);
        addEdge(cell[1],cell[2]);
        addEdge(cell[2],cell[0]);
    });

    return lines;
}

module.exports = {mesh2Lines};