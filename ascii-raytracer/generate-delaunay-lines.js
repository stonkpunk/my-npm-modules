var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function generateDelaunayLines(numPts, minDist=10){
    const points = [];

    var S = 32;

    for (let i = 0; i < numPts; ++i) {
        points.push([Math.random()*S-S/2, Math.random()*S-S/2, Math.random()*S-S/2]);
        points[i].index = i;
    }

    //require('./get-points-neighbors.js').getPointNeighborsFast(points, minDist); //TODO get neighbors via delaunay?

    require('./get-points-neighbors.js').getPointNeighborsDelaunay(points);

    var k = require('kruskal-mst');

    var edges = [];
    var edgesMap = {};

    points.forEach(function(p){
        p.neighbors.forEach(function(n){
            var minI = Math.min(p.index, n.index);
            var maxI = Math.max(p.index, n.index);
            if(!edgesMap[`${minI}_${maxI}`]){
                edges.push([p,n]);
                edgesMap[`${minI}_${maxI}`] = true;
            }
        })
    });

    return edges;
}

function mstToLines(_mst, points, cleanUpPts){

    if(cleanUpPts){
        points.forEach(function(p){
            p.index = null;
            p.neighbors = null;
            delete p.index;
            delete p.neighbors;
        });
    }

    var lines = _mst.map(function(edge){
        return [points[edge.from],points[edge.to]];
    });

    return lines;
}

module.exports = {generateDelaunayLines};

//console.log(generateMstLines(32,5));