var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

var createGraph = require('ngraph.graph');
var ngraphKruskal = require('ngraph.kruskal');

function setOfPts2Graph2(sop){
    let graph = createGraph();
    sop.forEach(function(p,i){
        p.i=i+'';
    });
    sop.forEach(function(p,i){
        p.neighbors.forEach(function(n){
            //var weight = (distFuncLine || lineLength)([p,n]); //we now do weight in pathfinder func
            //  graph.addLink(p.i+'', n.i+'', {weight: weight});
            graph.addLink(p.i+'', n.i+'' );
            //graph.addLink(n.i+'', p.i+'', {weight: weight});
        });
    });

    return graph;
   // graph.addLink('a', 'c', {weight: 10});
   // graph.addLink('c', 'd', {weight: 5});
   // graph.addLink('b', 'd', {weight: 10});
}

function generateMstLines(numPts, minDist=10){
    const points = [];

    var S = 32;

    for (let i = 0; i < numPts; ++i) {
        points.push([Math.random()*S*2-S/2, Math.random()*S/2-S/2, Math.random()*S*2-S/2]);
        points[i].index = i;
    }

    //require('./get-points-neighbors.js').getPointNeighborsFast(points, minDist); //TODO get neighbors via delaunay?

    require('./get-points-neighbors.js').getPointNeighborsDelaunay(points);

    function link2Line(link, sop){
        return [sop[parseInt(link.fromId)],sop[parseInt(link.toId)]];
    }

    var MST_lines =  ngraphKruskal(setOfPts2Graph2(points), function(link){
        return lineLength(link2Line(link, points));
    }).map(function(o){
        //return o;
        var p0 = points[parseInt(o.fromId)];
        var p1 = points[parseInt(o.toId)];
        return [p0,p1];
    });

    return MST_lines;


    // var k = require('kruskal-mst');
    //
    // var edges = [];
    // var edgesMap = {};
    //
    // points.forEach(function(p){
    //     p.neighbors.forEach(function(n){
    //         var minI = Math.min(p.index, n.index);
    //         var maxI = Math.max(p.index, n.index);
    //         if(!edgesMap[`${minI}_${maxI}`]){
    //             edges.push({
    //                 from: minI,to:maxI,weight:1.0/lineLength([p,n])
    //             });
    //             edgesMap[`${minI}_${maxI}`] = true;
    //         }
    //     })
    // });
    //
    // var mst = k.kruskal(edges); //TODO this is broken??
    //
    // return mstToLines(mst,points,false);
}
//
// function mstToLines(_mst, points, cleanUpPts){
//
//     if(cleanUpPts){
//         points.forEach(function(p){
//             p.index = null;
//             p.neighbors = null;
//             delete p.index;
//             delete p.neighbors;
//         });
//     }
//
//     var lines = _mst.map(function(edge){
//         return [points[edge.from],points[edge.to]];
//     });
//
//     return lines;
// }

module.exports = {generateMstLines};

//console.log(generateMstLines(32,5));