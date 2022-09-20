
var setOfPts2Graph = require('pts-to-graph').setOfPtsToNGraph;
var ngraphPath = require('ngraph.path');

function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function lineLength_withFootsteps(line){
    return lineLength(line)/((line[0].footsteps||1.0) + (line[1].footsteps||1.0))/2.0;
}

function incrementPtFootsteps(pt, nextPt){ //can optionally use nextPt to do logic based on edges etc
    pt.footsteps=pt.footsteps?pt.footsteps+1:1;
}

var PATH_GENERATION_NUM = 0;
function incrementPtGeneration(pt){
    if(!pt.generation){
        pt.generation=PATH_GENERATION_NUM*1+0;
        PATH_GENERATION_NUM++;
    }
}

function setOfPointsShortestPath(sop, sourceId, targetId, opts =
    {noContrib:false, dfLine:lineLength_withFootsteps, incFunc: incrementPtFootsteps}){

    var graph = sop.ngraph || setOfPts2Graph(sop, opts.dfLine);
    //delete sop.graph;
    sop.ngraph=graph;

    var pathFinder = ngraphPath.nba(graph,{ //astar or nba? //see https://github.com/anvaka/ngraph.path
        //oriented: true,
        distance(fromNode, toNode, link) {
            return opts.dfLine([sop[parseInt(fromNode.id)], sop[parseInt(toNode.id)]]);
        }
    }); // graph is https://github.com/anvaka/ngraph.graph

    var fromNodeId = sourceId+'';
    var toNodeId = targetId+'';
    var foundPath = pathFinder.find(fromNodeId, toNodeId);
    var idList = foundPath.map(n=>n.id);
    idList.forEach(function(ptId,i){
        var id = parseInt(ptId);
        var nextPt = i<idList.length-1 ? sop[parseInt(idList[i+1])] : null;
        if(opts.noContrib){ //skip footstep / generation increment stage

        }else{
            opts.incFunc(sop[id], nextPt);
            incrementPtGeneration(sop[id]);
        }
    });

    return idList.map(id=>parseInt(id));
}

module.exports = {setOfPointsShortestPath}
