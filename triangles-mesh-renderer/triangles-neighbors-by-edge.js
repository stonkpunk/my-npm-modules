//TODO try version based on verts with pre-alloced buffer for each one?

var _ = require('underscore');
var ti = require('triangles-index');

function trisNeighborsByEdge_indexed_degree2(trisIndex){
    //var t0=Date.now();
    var deg1 = trisNeighborsByEdge_indexed(trisIndex);
    //console.log("bottom took", Date.now()-t0);

    var neighborsByIndexD2 = deg1.map(function(nByIArray,i){
        var neighborList = nByIArray.concat(
            ...nByIArray.map(ni=>deg1[ni]) //neighbors of neighbors
        )
        return _.uniq(neighborList)
    });
    return neighborsByIndexD2;
}

function trisNeighborsByEdge_indexed_degreeN(trisIndex, n){
    if(n>2){
        var deg2 = trisNeighborsByEdge_indexed_degreeN(trisIndex, n-1);
        var neighborsByIndexD3 = deg2.map(function(nByIArray,i){
            var neighborList = nByIArray.concat(
                ...nByIArray.map(ni=>deg2[ni]) //neighbors of neighbors
            )
            return _.uniq(
                neighborList
            )
        });
        return neighborsByIndexD3;
    }

    if(n==2){
        return trisNeighborsByEdge_indexed_degree2(trisIndex);
    }

    if(n==1){
        return trisNeighborsByEdge_indexed(trisIndex);
    }

    if(n==0){
        throw 'err with neighbors'
    }
}

function edgeHash(e0,e1){
    return e0*e1+e0+e1; //fast sloppy hash
    //e0*e1+e0+e1
    // if(e0<e1){
    //     return e0+"_"+e1;
    // }
    // return e1+"_"+e0;
}

function trisNeighborsByEdge_indexed(trisIndex){
    var edges = {};
    var neighborsByIndex = [];
    var tc=trisIndex.cells;
    var l = tc.length;
    for(var i=0;i<l;i++) {
        var cell = tc[i];
        var c0=cell[0],c1=cell[1],c2=cell[2];
        var edgeA = edgeHash(c0, c1);
        var edgeB = edgeHash(c1, c2);
        var edgeC = edgeHash(c2, c0);
        edges[edgeA] = edges[edgeA] || [];
        edges[edgeB] = edges[edgeB] || [];
        edges[edgeC] = edges[edgeC] || [];
        edges[edgeA].push(i);
        edges[edgeB].push(i);
        edges[edgeC].push(i);
    }
    for(var i=0; i<l; i++) {
        var cell = tc[i];
        var c0=cell[0],c1=cell[1],c2=cell[2];
        var edgeA = edgeHash(c0, c1);
        var edgeB = edgeHash(c1, c2);
        var edgeC = edgeHash(c2, c0);
        var res = edges[edgeA].concat(edges[edgeB], edges[edgeC]);
        neighborsByIndex.push(_.uniq(res).filter(j => j != i));
    }
    return neighborsByIndex;
}

function trisNeighborsByEdge(tris){
    return trisNeighborsByEdge_indexed(ti.indexTriangles_meshView(tris));
}

module.exports = {trisNeighborsByEdge, trisNeighborsByEdge_indexed, trisNeighborsByEdge_indexed_degree2, trisNeighborsByEdge_indexed_degreeN};