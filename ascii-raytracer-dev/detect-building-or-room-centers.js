const rtu = require("./raycasting-utils");
const lu = require("./lines-utils");
const pn = require("./get-points-neighbors");
const dfu = require("./distance-function-utils");

function traceBuildingPts(sol, solOrig){
    //var solDf = dfu.linesDistFast(sol);

    // get 2 midpt ortho-lines for each leaf,
    // trace them both then return the midpts of the results, add them all to a list

    //the result is little clusters inside each poly

    var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(sol), false);
    var leaves = sol.filter(l=>l.isLeaf).map(function(leaf){
        leaf.orthoLines = lu.orthoLines2d(leaf);
        leaf.orthoDirs = lu.orthoDirs2d(leaf);
        return leaf;
    });

    var res = [];

    leaves.forEach(function(leaf){
        //var mp = lu.lineMidPt(leaf); //or leaf.orthoLines[0][0]
        var sp0 = lu.getPointAlongLine(leaf.orthoLines[0], 0.01);
        var sp1 = lu.getPointAlongLine(leaf.orthoLines[1], 0.01);
        var ray0 = {point:{x:sp0[0],y:sp0[1],z:sp0[2]}, vector:{x:leaf.orthoDirs[0][0],y:leaf.orthoDirs[0][1],z:leaf.orthoDirs[0][2]},};
        var ray1 = {point:{x:sp1[0],y:sp1[1],z:sp1[2]}, vector:{x:leaf.orthoDirs[1][0],y:leaf.orthoDirs[1][1],z:leaf.orthoDirs[1][2]},};
        var distTraced0 = tracer(ray0);
        var distTraced1 = tracer(ray1);
        var resPt0 = lu.getPointAlongLine_dist(leaf.orthoLines[0], distTraced0/2);
        var resPt1 = lu.getPointAlongLine_dist(leaf.orthoLines[1], distTraced1/2);
        if(leaf.color){
            resPt0.color = leaf.color;
            resPt1.color = leaf.color;
        }
        if(lu.ptInsideShape(resPt0,solOrig)){res.push(resPt0);}
        if(lu.ptInsideShape(resPt1,solOrig)){res.push(resPt1);}
    });

    //console.log("LEAVES?",leaves.length, "buildings?", res.length);

    return res;
}

//take the little clusters and convert them to building pts objs
function detectBuildingPtGroups(sop,shapeLines, neighborDistance){
    sop = sop.map(function(p,i){
        p.i=i;
        return p;
    });
    sop = pn.getPointNeighborsFast(sop,neighborDistance); //TODO use 2d voronoi for neighbors...
    var lines = [];
    var neighborsMap={};
    var tracer = rtu.trianglesTraceFast(lu.lines2Triangles(shapeLines), false);
    sop.forEach(function(pt){
        if(pt.neighbors){
            pt.neighbors.forEach(function(n){
                var nindex = `${Math.min(n.i,pt.i)}_${Math.max(n.i,pt.i)}`;
                if(!neighborsMap[nindex]){
                    var line = [pt,n];
                    if(pt!=n && (!lu.lineIntersectsShape(line,shapeLines,tracer)) && lu.lineLength(line)>0.0001){
                        lines.push(line);
                        neighborsMap[nindex]=true;
                    }else{
                        //console.log(lu.lineLength(line));
                    }
                }
            })
        }else{
            var line = [pt,lu.jitterPt(pt,0.01)];
            lines.push(line);
        }
    });

    var ptId2GroupNumber = {};
    var groupNumber2Pts = {};

    function floodNeighbors1(pt, indexToSpread){
        groupNumber2Pts[indexToSpread+""] = groupNumber2Pts[indexToSpread+""] || [];
        groupNumber2Pts[indexToSpread+""].push(pt);

        if(pt.neighbors1){
            pt.neighbors1.forEach(function(n){
                if(!ptId2GroupNumber[n.i+""]){
                    ptId2GroupNumber[n.i+""] = indexToSpread+"";
                    floodNeighbors1(n, indexToSpread);
                }
            });
        }
    }

    lines.forEach(function(line){
        var p0 = line[0];
        var p1 = line[1];
        p0.neighbors1 = p0.neighbors1 || [];
        p1.neighbors1 = p1.neighbors1 || [];
        p0.neighbors1.push(p1);
        p1.neighbors1.push(p0);
    })

    //floodfill group numbers
    sop.forEach(function(pt){
        if(!ptId2GroupNumber[pt.i]){
            ptId2GroupNumber[pt.i] = pt.i+"";
            floodNeighbors1(pt, pt.i);
        }
    });
    var res = {lines: lines, groupsArr: Object.values(groupNumber2Pts)};
    var centers = res.groupsArr.map(function(arrPts){
        return lu.averageOfPts(arrPts);
    });

    res.centers = centers;

    return res;
}

module.exports = function(boxLines,boxLinesOrig){

    var solDf = dfu.linesDistFast(boxLines);
    var MIN_DIST_TO_ROAD = 0.5;

    var s = lu.lineLength(lu.boundingBlockOfBlocks(boxLines))/2;

    var ndist= 2*s/Math.log2(boxLines.length*2);

    var res = detectBuildingPtGroups(traceBuildingPts(boxLines, boxLinesOrig).filter(function(bp){
        return solDf(...bp) > MIN_DIST_TO_ROAD;
    }), boxLines, ndist); //TODO rename this
    return res;
};

