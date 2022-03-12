function pts2Lines(pts){
    if(pts.length<2)return [];
    var res=[];
    for(var i=0;i<pts.length-1;i++){
        res.push([pts[i],pts[i+1]]);
    }
    return res;
}

function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function lineLengthSquared(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return (a*a+b*b+c*c);
};

function lineMidPt(line){
    return [
        (line[0][0]+line[1][0])/2.0,
        (line[0][1]+line[1][1])/2.0,
        (line[0][2]+line[1][2])/2.0
    ];
}

if(!Math.clamp01){
    (function(){Math.clamp01=function(a/*,b,c*/){return Math.max(0.0,Math.min(1.0,a));}})();
}

function getPointAlongLine(line, _t){
    _t=Math.clamp01(_t);
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

function getTraversedLength(_lines){
    if(_lines["tlength"])return _lines["tlength"];
    var total=0;
    _lines.map(function(line, index, arr){
        var thisLine = line;
        var nextLine = arr[index+1];
        total+=lineLength(line);
        if(nextLine){
            total+=lineLength([thisLine[1], nextLine[0]]);
        }
    });
    _lines["tlength"] = total;
    return total;
}

function lineset2FlatDists(lines){ //"straighten out" set of lines, stack them up as blocks to feed into rtree
    var stack = [];
    var lenSoFar = 0;
    for(var i=0;i<lines.length;i++){
        var thisLineLen = lineLength(lines[i]);
        stack.push(lenSoFar+0);
        lenSoFar+=thisLineLen;
    }
    return stack;
}

//based on solution from https://stackoverflow.com/questions/22697936/binary-search-in-javascript
function binarySearch(ar, el) {
    var m = 0;
    var n = ar.length - 1;
    while (m <= n) {
        var k = (n + m) >> 1;
        var cmp = el - ar[k];
        if (cmp > 0) {
            m = k + 1;
        } else if(cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return -m - 1;
}

function getNearestLineIndex(lines, dist){
    lines.flatStack = lines.flatStack || lineset2FlatDists(lines);
    var index = binarySearch(lines.flatStack, dist);
    if(index>=0){
        return index;
    }else{
        return -index - 1;
    }
}

function walkXUnitsAlongLineset(_lineset, distToWalk){

    var isALoop = lineLengthSquared([_lineset[0][0], _lineset[_lineset.length-1][1]]) < eps;
    var skipStartIndex = (getNearestLineIndex(_lineset, distToWalk-0.1)+_lineset.length-1) % _lineset.length;

    var skipStartLength = _lineset.flatStack[skipStartIndex];

    // if(skipStartIndex==_lineset.length-1){
    //     skipStartIndex=0;
    //     skipStartLength=0;
    // }

    var remainingDist = distToWalk*1.0-skipStartLength;
    var thePt = null;
    var arr = _lineset;

    for(var i=skipStartIndex; i<_lineset.length; i++){
        var index = i;

        var line = _lineset[index];

        var thisLine = line;
        var nextLine = isALoop ? arr[(index+1)%_lineset.length] : ( index<_lineset.length-1 ? arr[index+1] : null);
        var len = lineLength(thisLine);

        if(remainingDist>len){
            remainingDist-=len;

            if(nextLine){
                len = lineLength([thisLine[1], nextLine[0]]);
                if(remainingDist>len){
                    remainingDist-=len;
                }else{
                    thePt = getPointAlongLine([thisLine[1], nextLine[0]], remainingDist/len);
                    break;
                }
            }else{
                thePt = thisLine[1];
                break;
            }
        }else{
            thePt = getPointAlongLine(thisLine, remainingDist/len);
            break;
        }
    }


    return thePt;
};

var eps = 0.1;

function interpAlongLines_bezier_dist(_lineset, dist, interpDist=4.0, _traversedLen){
    var isALoop = lineLengthSquared([_lineset[0][0], _lineset[_lineset.length-1][1]]) < eps;
    var totalLen = _traversedLen || getTraversedLength(_lineset);

    var t0,t1;
    if(!isALoop){
        t0 = Math.min(0,(totalLen+dist-interpDist/2.0));
        t1 = Math.max((totalLen+dist+interpDist/2.0),totalLen);
    }else{
        t0 = (totalLen+dist-interpDist/2.0)%totalLen;
        t1 = (totalLen+dist+interpDist/2.0)%totalLen;
    }

    var ptA = interpAlongLines_dist(_lineset, t0)
    var ptB = interpAlongLines_dist(_lineset, t1)
    var pt = lineMidPt([ptA,ptB]);
    return pt;
}

function interpAlongLines_bezier(_lineset, fraction, interpDist=4.0, _traversedLen){
    var isALoop = lineLengthSquared([_lineset[0][0], _lineset[_lineset.length-1][1]]) < eps;
    var totalLen = _traversedLen || getTraversedLength(_lineset);
    var dist = fraction * totalLen;

    var t0,t1;
    if(!isALoop){
        t0 = Math.min(0,(totalLen+dist-interpDist/2.0));
        t1 = Math.max((totalLen+dist+interpDist/2.0),totalLen);
    }else{
        t0 = (totalLen+dist-interpDist/2.0)%totalLen;
        t1 = (totalLen+dist+interpDist/2.0)%totalLen;
    }

    var ptA = interpAlongLines_dist(_lineset, t0)
    var ptB = interpAlongLines_dist(_lineset, t1)
    var pt = lineMidPt([ptA,ptB]);
    return pt;
}

function interpAlongLines(_lineset, fraction, _traversedLen){
    var totalLen = _traversedLen || getTraversedLength(_lineset);
    if(fraction==1){
        if( _lineset[_lineset.length-1]){
            return _lineset[_lineset.length-1][1];
        }
        return null;
    }
    return walkXUnitsAlongLineset(_lineset, fraction*totalLen);
};

var interpAlongLines_dist = walkXUnitsAlongLineset;

module.exports = {pts2Lines, getTraversedLength, interpAlongLines, interpAlongLines_dist, interpAlongLines_bezier, interpAlongLines_bezier_dist};
