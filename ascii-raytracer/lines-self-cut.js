var dfu = require('./distance-function-utils.js');
var lu = require('./lines-utils.js');

function lineChopIn2(line,t){
    var ip = lu.getPointAlongLine(line,t);
    var lineRes = [
        [line[0],ip],
        [ip,line[1]]
    ];

    for(var f in line){ //add extra fields if they exist
        if(isNaN(parseInt(f))){
            lineRes[f]=line[f];
        }
    }

    return lineRes;
}

function tryChopLinesSingle(lines, MIN_DIST){

    var linesNearFunc = dfu.linesNearbyFunc(lines, MIN_DIST*2);

    var res = [];
    var chopsCount = 0;
    lines.forEach(function(line){
        var linesNearby = linesNearFunc(line);
        var lineChopped = false;

        //check if any of the lines intersects -- eg check if closest approach t is not (0 or 1) and comes within eps dist
        //if the lines intersect, this line by the other line, add the chopped bits to res, increment chops count
        linesNearby.forEach(function(nline){
            if(nline!=line && !lineChopped){
                var cline = lu.lineLineClosestPtsLine(line,nline);
                var distToLine = lu.lineLength(cline);
                var isAtLine0Edge = (cline[0].t<0.01 || cline[0].t>1.0-0.01);

                // if(isAtLine0Edge){
                //     console.log("edge");
                // }

                if(distToLine<MIN_DIST && !isAtLine0Edge){
                    res.push(...lineChopIn2(line, cline[0].t))
                    //console.log("CHOPPED", distToLine);//line, cline[0].t, );
                    lineChopped=true;
                    //line.chopped=true;
                    chopsCount++;
                }
            }
        });

        if(!lineChopped){
            res.push(line);
        }
    });
    return {
        lines: res,
        chopsCount: chopsCount
    }
}

function chopLinesBySelf(lines, MIN_DIST=0.1){
    var res= {lines: lines, chopsCount: 1};
    var attempts = 0;
    do{
        res = tryChopLinesSingle(res.lines, MIN_DIST);
        attempts++;
        console.log("CHOPS", res.chopsCount, res.lines.length, attempts);

        lines = lines.filter(lu.lineLength)

    }while((res.chopsCount>0) && (attempts<50))
    return lu.removeDuplicateLines(res.lines);
}

module.exports = chopLinesBySelf;