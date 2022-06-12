var createGraph = require('ngraph.graph');

function setOfPts2NGraph(sop){
    let graph = createGraph();
    sop.forEach(function(p,i){
        p.i=i+'';
    });
    sop.forEach(function(p,i){
        p.neighbors.forEach(function(n){
            //var weight = (distFuncLine || lineLength)([p,n]);
            //  graph.addLink(p.i+'', n.i+'', {weight: weight});
            graph.addLink(p.i+'', n.i+'' );
        });
    });

    return graph;
}

module.exports = {setOfPts2NGraph};