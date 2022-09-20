//https://stackoverflow.com/questions/32527026/shortest-path-in-javascript

function Graph() {
    var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

    this.addEdge = function (u, v) {
        if (neighbors[u] === undefined) {  // Add the edge u -> v.
            neighbors[u] = [];
        }
        if(neighbors[u].indexOf(v)==-1)neighbors[u].push(v);
        if (neighbors[v] === undefined) {  // Also add the edge v -> u in order
            neighbors[v] = [];               // to implement an undirected graph.
        }                                  // For a directed graph, delete
        if(neighbors[v].indexOf(u)==-1)neighbors[v].push(u);              // these four lines.
    };

    return this;
}

function Graph_directed() {
    var neighbors = this.neighbors = {}; // Key = vertex, value = array of neighbors.

    this.addEdge = function (u, v) {
        if (neighbors[u] === undefined) {  // Add the edge u -> v.
            neighbors[u] = [];
        }
        if(neighbors[u].indexOf(v)==-1)neighbors[u].push(v);
        // if (neighbors[v] === undefined) {  // Also add the edge v -> u in order
        //     neighbors[v] = [];               // to implement an undirected graph.
        // }                                  // For a directed graph, delete
        // if(neighbors[v].indexOf(u)==-1)neighbors[v].push(u);              // these four lines.
    };

    return this;
}

function bfs(graph, source) {
    var queue = [ { vertex: source, count: 0 } ],
        visited = { source: true },
        tail = 0;
    while (tail < queue.length) {
        var u = queue[tail].vertex,
            count = queue[tail++].count;  // Pop a vertex off the queue.
        print('distance from ' + source + ' to ' + u + ': ' + count);
        graph.neighbors[u].forEach(function (v) {
            if (!visited[v]) {
                visited[v] = true;
                queue.push({ vertex: v, count: count + 1 });
            }
        });
    }
}

function shortestPath(graph, source, target) {

    //console.log("SHORT PATH", graph);

    if (source == target) {   // Delete these four lines if
        print(source);          // you want to look for a cycle
        return;                 // when the source is equal to
    }                         // the target.
    var queue = [ source ],
        visited = { source: true },
        predecessor = {},
        tail = 0;
    while (tail < queue.length) {
        var u = queue[tail++],  // Pop a vertex off the queue.
            neighbors = graph.neighbors[u];

        for (var i = 0; i < neighbors.length; ++i) {
            var v = neighbors[i];
            if (visited[v]) {
                continue;
            }
            visited[v] = true;
            if (v === target) {   // Check if the path is complete.
                var path = [ v ];   // If so, backtrack through the path.
                while (u !== source) {
                    path.push(u);
                    u = predecessor[u];
                }
                path.push(u);
                path.reverse();

                return path;
            }
            predecessor[v] = u;
            queue.push(v);
        }
    }

    return null;
}

function print(s) {  // A quick and dirty way to display output.
    console.log(s);
}

function setOfPoints2Graph(sop, graphIsDirected=false){

    if(!sop[1].i)sop.map(function(p,i){p.i=i+'';});

    console.log("building graph...");
    if(!sop[1].neighbors){
        /*    console.log("getting pt neighbors...");
            sop = getPointNeighbors(sop, neighborDist);*/
        throw 'no neighbors?';
    }

    var graph = graphIsDirected ? new Graph_directed() : new Graph();

    for(var i=0; i<sop.length; i++){
        var p = sop[i];

        if(i%1000==0)console.log(i, sop.length);

        for(var ni=0; ni<p.neighbors.length; ni++){
            var n = p.neighbors[ni];
            graph.addEdge(p.i, n.i);
        }
    }

    console.log("graph done.");

    return graph;
}

function setOfPointsShortestPath(sop, source, target){
    var graph = sop.graph || setOfPoints2Graph(sop);
    sop.graph = graph;
    return shortestPath(graph, source+'', target+'');
}


let createGraph = require('ngraph.graph');
//let graph = createGraph();
function setOfPts2Graph2(sop){
    let graph = createGraph();
    sop.forEach(function(p,i){
        p.i=p.i || i+'';
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


var lu = require('./lines-utils.js');
var ngraphPath = require('ngraph.path');
function setOfPointsShortestPath2(sop, source, target, dfLine=lu.lineLength, isOneWay = true){ //src, trg reversed or something?

    // var ptId2PtMap = {};
    // sop.forEach(function(pt){
    //     ptId2PtMap[pt.i+""]=pt;
    // });

    let graph = sop.graph2 || setOfPts2Graph2(sop);
    delete sop.graph2;
    sop.graph2=graph;

    //let path = require('ngraph.path');
    //let pathFinder = path.aStar(graph); // graph is https://github.com/anvaka/ngraph.graph

    let pathFinder = ngraphPath.aStar(graph,{
        oriented: isOneWay,
        // We tell our pathfinder what should it use as a distance function:
        distance(fromNode, toNode, link) {
            // We don't really care about from/to nodes in this case,
            // as link.data has all needed information:
            //return dfLine([ptId2PtMap[fromNode.id], ptId2PtMap[toNode.id]]);
            return dfLine([sop[parseInt(fromNode.id)], sop[parseInt(toNode.id)]]);
            //return link.data.weight;
        }
    }); // graph is https://github.com/anvaka/ngraph.graph

    // now we can find a path between two nodes:
    let fromNodeId = source+'';
    let toNodeId = target+'';
    let foundPath = pathFinder.find(fromNodeId, toNodeId);
    var idList = foundPath.map(n=>n.id);
    // idList.forEach(function(ptId){
    //     var id = parseInt(ptId);
    //     if(!sop[id].generation){
    //         sop[id].generation=PATH_GENERATION_NUM*1+0;
    //         PATH_GENERATION_NUM++;
    //     }
    // });

    return idList;
}

// var PATH_GENERATION_NUM = 0;
// function setOfPointsShortestPath3(sop, source, target, dfLine){ //same as above ?
//     let graph = sop.graph2 || setOfPts2Graph2(sop, dfLine);
//     delete sop.graph2;
//     sop.graph2=graph;
//
//     let pathFinder = ngraphPath.aStar(graph,{
//         //oriented: true,
//         distance(fromNode, toNode, link) {
//             return dfLine([sop[parseInt(fromNode.id)], sop[parseInt(toNode.id)]]);
//         }
//     }); // graph is https://github.com/anvaka/ngraph.graph
//
//     // now we can find a path between two nodes:
//     let fromNodeId = source+'';
//     let toNodeId = target+'';
//     let foundPath = pathFinder.find(fromNodeId, toNodeId);
//     var idList = foundPath.map(n=>n.id);
//     idList.forEach(function(ptId){
//         var id = parseInt(ptId);
//         if(!sop[id].generation){
//             sop[id].generation=PATH_GENERATION_NUM*1+0;
//             PATH_GENERATION_NUM++;
//         }
//     });
//
//     return idList;
// }

function path2Lines(path, sop){
    var lines = [];
    if(!path)return lines;
    if(path.length==1)return lines;
    for(var i=0; i<path.length-1; i++){
        lines.push(
            [ sop[path[i]], sop[path[i+1]]  ]
        );
    }
    return lines;
}

function paths2Lines(paths, sop){

    var sol=[];
    var nMap = {};

    paths.forEach(function(path){
        for(var i=0; i<path.length-1; i++){
            var smallerIndex = Math.min(path[i], path[i+1]);
            var largerIndex = Math.max(path[i], path[i+1]);
            if(!nMap[smallerIndex+"_"+largerIndex]){
                sol.push(
                    [ sop[path[i]], sop[path[i+1]]  ]
                );
                nMap[smallerIndex+"_"+largerIndex]=true;
            }
        }
    });

    return sol;
}

function paths2Lines_colored(paths, sop){

    var colorExtraPtsMap={};
    var colorPathsMap={};

    var sol=[];
    var nMap = {};

    paths.sort(function(a,b){
        return b.length - a.length; //descending length
    });

    paths.forEach(function(path,j){
        var pathColor = Math.floor((Math.cos(j*9999)*0xffffff)%0xffffff);
        //var prevColor = pathColor;
        path.reverse();

        var pathIsSplit = false;
        var pathSplits = 0;

        //var gotOneOrMore=false;
        //var extraOne=false;
        for(var i=0; i<path.length-1; i++){
            var smallerIndex = Math.min(path[i], path[i+1]);
            var largerIndex = Math.max(path[i], path[i+1]);


            if(!nMap[smallerIndex+"_"+largerIndex]){

                if(pathIsSplit){
                    console.log("SPLIT PATH", pathSplits);
                    pathColor++;
                    pathIsSplit=false;
                }

                colorPathsMap[pathColor] = colorPathsMap[pathColor] || [path[i]];
                colorPathsMap[pathColor].push(path[i+1]);
                var theLine = [ sop[path[i]], sop[path[i+1]]  ];
                theLine.color = pathColor;
                sol.push(theLine);
                nMap[smallerIndex+"_"+largerIndex]=true;

                //gotOneOrMore=true;
            }else{
                if(!pathIsSplit){
                    pathSplits++;
                    pathIsSplit=true;
                    //console.log("2SPLIT PATH", pathSplits);
                }

                /* if(gotOneOrMore && extraOne){
                     colorPathsMap[pathColor] = colorPathsMap[pathColor] || [path[i]];
                     colorPathsMap[pathColor].push(path[i+1]);
                     extraOne=false;
                 }*/
            }
        }
    });


    sol.colorMap = colorPathsMap;

    return sol;
}

function path2Pts(path, sop){
    var pts = [];
    if(!path)return pts;
    if(path.length==1)return pts;
    for(var i=0; i<path.length; i++){
        pts.push(
            sop[path[i]]
        );
    }
    return pts;
}

var shortestPath2Lines = path2Lines;

/*
window.onload = function () {
    var graph = new Graph();
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('B', 'E');
    graph.addEdge('C', 'D');
    graph.addEdge('C', 'E');
    graph.addEdge('C', 'G');
    graph.addEdge('D', 'E');
    graph.addEdge('E', 'F');

    bfs(graph, 'A');
    print();
    shortestPath(graph, 'B', 'G');
    print();
    shortestPath(graph, 'G', 'A');
};*/

module.exports = {setOfPointsShortestPath2, setOfPointsShortestPath};