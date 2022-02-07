
var lineLengthSquared = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return a*a+b*b+c*c;
};

function flipLine(line){
    return [line[1],line[0]];
}

var getPointAlongLine = function(line, _t){
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    //console.log("before array abuse?", arr);
    arr["line"]=line;
    //console.log("after array abuse", arr);
    return arr;
};

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

var lineToPts = function(line, ptDist){
    var pts = [];
    var numPts = Math.floor(lineLength(line)/ptDist)+2;
    //if(numPts>0){
    for(var i=0;i<numPts;i++){
        pts.push(getPointAlongLine(line,i*1.0/numPts));
    }
    return pts;
};

var linesetToPointSet = function(lineset, ptDist){
    var pts = [];

    lineset.map(function(line){
        pts = pts.concat(lineToPts(line, ptDist));
    });

    return pts;
};

function averageLineLength(lines){
    var total = 0;
    lines.forEach(function(line){
        total+=lineLength(line);
    })
    return total/lines.length;
}

module.exports = {averageLineLength, lineToPts, lineLength, lineLengthSquared, linesetToPointSet, lineToPts, getPointAlongLine, flipLine};