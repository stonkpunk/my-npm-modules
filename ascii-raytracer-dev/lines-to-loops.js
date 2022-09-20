var lu = require('./lines-utils.js');

function lines2LoopsLines(lines, loopRadius = 3.0){
    return [].concat(...lines.map(line=>line2LoopLines(line,loopRadius, line.color)));
}

function lines2LoopsLines_2Lanes(lines, loopRadius = 3.0){
    var res0 = [].concat(...lines.map(line=>line2LoopLines(line,loopRadius, line.color)));
    var res1 = [].concat(...lines.map(line=>line2LoopLines(line,loopRadius/2, line.color)));
    return [].concat(res0,res1);
}

function line2TriangleLines(line, loopRadius=1.0, color){
    var dirFwd = lu.normalizeLine(line);
    var dirUp = lu.normalizeLine([[0,0,0],[0,-1,0]]);
    var dirRight = lu.scalePt(lu.crossProductLines(dirFwd, dirUp),loopRadius);
    var dirLeft = lu.scalePt(dirRight, -1);

    var ptA = lu.addPts(line[0], dirRight);
    var ptB = lu.addPts(line[1], dirRight);
    var ptC = lu.addPts(line[1], dirLeft);

    ptB = lu.lineMidPt([ptB,ptC]);

    var ptD = lu.addPts(line[0], dirLeft);

    //result is counter clockwise loop ...

    var res = [
        [ptA, ptB],
        [ptB, ptD],
        [ptD, ptA]
    ];

    if(color){
        res = res.map(function(l){
            l.color=color;
            return l;
        });
    }

    return res;
}


//TODO rounded version [eg using lines interp?]

function line2LoopLines(line, loopRadius=3.0, color){
    var dirFwd = lu.normalizeLine(line);

    var dirFwdD = lu.normalizeAndCenterLine(line);
    var dirUp = lu.normalizeLine([[0,0,0],[0,-1,0]]);

    var dirFwdS = lu.scalePt(dirFwdD[1],loopRadius);
    var dirFwdSN = lu.scalePt(dirFwdS,-1);

    var dirRight = lu.scalePt(lu.crossProductLines(dirFwd, dirUp),loopRadius);
    var dirLeft = lu.scalePt(dirRight, -1);

    var ptA = lu.addPts(lu.addPts(line[0], dirRight), dirFwdSN);
    var ptB = lu.addPts(lu.addPts(line[1], dirRight), dirFwdS);
    var ptC = lu.addPts(lu.addPts(line[1], dirLeft),  dirFwdS);
    var ptD = lu.addPts(lu.addPts(line[0], dirLeft),  dirFwdSN);

    //result is counter clockwise loop ...

    //driving on the left side of the street
    // var res = [
    //     [ptA, ptB],
    //     [ptB, ptC],
    //     [ptC, ptD],
    //     [ptD, ptA]
    // ];

    //driving on the right side of the street
    var res = [
        [ptA,ptD],
        [ptD,ptC],
        [ptC,ptB],
        [ptB,ptA]
    ];

    if(color){
        res = res.map(function(l){
            l.color=color;
            return l;
        });
    }

    return res;

    //          1
    //     c┌───▲───┐b
    //      │   │   │
    //      │   │   │
    //      │   │   │
    //      │   │   │
    //      │   │   │
    //      │   │   │
    //      │   │   │
    //      │   │   │
    //     d◄───┴───►a
    //   ld     0     rd

    //https://asciiflow.com/#/ nice
}

module.exports = {line2LoopLines, lines2LoopsLines, lines2LoopsLines_2Lanes, line2TriangleLines};