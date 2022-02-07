const lca = require("line-of-closest-approach");
var lf = require('./line-funcs.js');
var dfu = require('./distance-function-utils.js');


function sortLines(lines){

    var linesNearLineFunc = dfu.linesNearbyFunc(lines);

    //take line segments and return list of lines where each lines goes to the nearest line in the set

    function nearestedUnpaintedLine(line){

        var linesNearBy = linesNearLineFunc(line).filter(line=>!line.painted);

        return (linesNearBy.length > 0 ? linesNearBy : lines.filter(line=>!line.painted)).sort(function(a,b){ //return by dist asc
            var distA = lf.lineLengthSquared(lca(line,a));
            var distB = lf.lineLengthSquared(lca(line,b));
            return distA-distB;
        })[0];
    }

    var linesPainted = 1;
    var lineListOrdered = [lines[0]];
    lines[0].painted = true;

    var recentlyPaintedLine = lines[0];

    while(linesPainted<lines.length){
        var unpaintedLine = nearestedUnpaintedLine(recentlyPaintedLine);
        if(!unpaintedLine){
            break;
        }else{
            unpaintedLine.painted=true;
            recentlyPaintedLine = unpaintedLine;

            var lastLineOnList = lineListOrdered[lineListOrdered.length-1];
            var distFromListEndToLineStart = lf.lineLengthSquared([lastLineOnList[1],unpaintedLine[0]]);
            var distFromListEndToLineEnd = lf.lineLengthSquared([lastLineOnList[1],unpaintedLine[1]]);
            if(distFromListEndToLineStart>distFromListEndToLineEnd){
                unpaintedLine = lf.flipLine(unpaintedLine);
            }

            unpaintedLine.distFromPrevious = Math.min(distFromListEndToLineStart,distFromListEndToLineEnd);

            lineListOrdered.push(unpaintedLine);
            linesPainted++;
        }
    }

    lines.forEach(function(line){
        delete line.painted;
    })

    return lineListOrdered;
}

function sortedLines2Pts(sortedLines){
    var pts = [];
    var eps = 0.01;
    for(var i=0;i<sortedLines.length;i++){
        if(i==0 || sortedLines.distFromPrevious>eps){
            pts.push(sortedLines[i][0]);
        }
        pts.push(sortedLines[i][1]);
    }
    return pts;
}

function lines2PtsList(lines){
    var res = sortedLines2Pts(sortLines(lines));

    //cleanup
    lines.forEach(function(line){
        delete line.distFromPrevious;
    })
    return res;
}

function lines2PtsListHull(lines,distBetweenPts=1.0){
    //var distBetweenPts = 1.0;//averageLineLength(lines)/4.0;
    //var pts = [].concat(...lines).map(pt=>[pt[0],pt[2]]);
    var pts = lf.linesetToPointSet(lines, distBetweenPts).map(pt=>[pt[0],pt[2]])
    var res = require('hull.js')(pts, distBetweenPts).map(pt=>[pt[0],0,pt[1]]);
    return res;
}

module.exports = {sortLines, sortedLines2Pts, lines2PtsList, lines2PtsListHull};