var _ = require('underscore');
var setOfPts2NGraph = require('./set-of-pts-to-graph.js').setOfPts2NGraph;

function edgeHash(e0,e1){
    return e0*e1+e0+e1; //fast sloppy hash
    //e0*e1+e0+e1
    // if(e0<e1){
    //     return e0+"_"+e1;
    // }
    // return e1+"_"+e0;
}

function mesh2Graph(trisIndex){
    var edges2Pts = {};
    var pts2Edges = {};
    //var neighborsByIndex = [];
    var tc=trisIndex.cells;
    var l = tc.length;
    var sop = trisIndex.positions;
    for(var i=0;i<l;i++) {
        var cell = tc[i];
        var c0=cell[0],c1=cell[1],c2=cell[2];
        var edgeA = edgeHash(c0, c1);
        var edgeB = edgeHash(c1, c2);
        var edgeC = edgeHash(c2, c0);

        pts2Edges[c0] = pts2Edges[c0] || [];
        pts2Edges[c1] = pts2Edges[c1] || [];
        pts2Edges[c2] = pts2Edges[c2] || [];

        pts2Edges[c0].push(edgeA,edgeC);
        pts2Edges[c1].push(edgeA,edgeB);
        pts2Edges[c2].push(edgeB,edgeC);

        edges2Pts[edgeA] = edges2Pts[edgeA] || [];
        edges2Pts[edgeB] = edges2Pts[edgeB] || [];
        edges2Pts[edgeC] = edges2Pts[edgeC] || [];

        edges2Pts[edgeA].push(c0, c1);
        edges2Pts[edgeB].push(c1, c2);
        edges2Pts[edgeC].push(c2, c0);
    }
    sop = sop.map(function(p,i){
        var edgeHashes = pts2Edges[i] || [];
        var allNeighbors = [];
        edgeHashes.forEach(function(hash){
            allNeighbors.push(...(edges2Pts[hash] || []).map(id=>sop[id]));
        })
        p.neighbors = _.uniq(allNeighbors);
        return p;
    });

    return {pts: sop, ngraph: setOfPts2NGraph(sop)};
}

module.exports = {mesh2Graph: mesh2Graph}