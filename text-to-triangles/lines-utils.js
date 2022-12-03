

function lineMidPt(line){
    return [
        (line[0][0]+line[1][0])/2.0,
        (line[0][1]+line[1][1])/2.0,
        (line[0][2]+line[1][2])/2.0
    ];
}

var centerOfLine = lineMidPt;

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};


var getPointAlongLine_dist = function(line, dist){

    var _t = dist/lineLength(line);

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

var getPointAlongLine = function(line, _t){
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];

    //console.log("before array abuse?", arr);
    //arr["line"]=line;
    //console.log("after array abuse", arr);
    return arr;
};

function sector2LinesEdges(sector){
    //check edges (12) ...
    var s0 = sector[0];
    var s1 = sector[1];
    var topEdge0 = [[s0[0],s0[1],s0[2]],[s0[0],s0[1],s1[2]]];
    var topEdge1 = [[s0[0],s0[1],s1[2]],[s1[0],s0[1],s1[2]]];
    var topEdge2 = [[s1[0],s0[1],s1[2]],[s1[0],s0[1],s0[2]]];
    var topEdge3 = [[s1[0],s0[1],s0[2]],[s0[0],s0[1],s0[2]]];

    var botEdge0 = [[s0[0],s1[1],s0[2]],[s0[0],s1[1],s1[2]]];
    var botEdge1 = [[s0[0],s1[1],s1[2]],[s1[0],s1[1],s1[2]]];
    var botEdge2 = [[s1[0],s1[1],s1[2]],[s1[0],s1[1],s0[2]]];
    var botEdge3 = [[s1[0],s1[1],s0[2]],[s0[0],s1[1],s0[2]]];

    var sideEdge0 = [[s0[0],s0[1],s0[2]],[s0[0],s1[1],s0[2]]];
    var sideEdge1 = [[s0[0],s0[1],s1[2]],[s0[0],s1[1],s1[2]]];
    var sideEdge2 = [[s1[0],s0[1],s1[2]],[s1[0],s1[1],s1[2]]];
    var sideEdge3 = [[s1[0],s0[1],s0[2]],[s1[0],s1[1],s0[2]]];

    var listOfEdges = [
        topEdge0, topEdge1, topEdge2, topEdge3,
        botEdge0, botEdge1, botEdge2, botEdge3,
        sideEdge0, sideEdge1, sideEdge2, sideEdge3,
    ];

    return listOfEdges;
}

var normalizeLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var len = (Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    return [line[0],[line[0][0]+dx/len, line[0][1]+dy/len, line[0][2]+dz/len]];
};

var normalizeAndCenterLine = function(line){
    var dx = line[1][0]-line[0][0];
    var dy = line[1][1]-line[0][1];
    var dz = line[1][2]-line[0][2];
    var len = (Math.sqrt(dx*dx+dy*dy+dz*dz)+0.000001);
    return [[0,0,0],[dx/len, dy/len, dz/len]];
};

var _nplen = new Float32Array(1);
function normalizePt(pt){ //pt = [x,y,z];
    //var len = ptLength(pt);
    _nplen[0] = Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2]);
    return [pt[0]/_nplen[0],pt[1]/_nplen[0],pt[2]/_nplen[0]];
}

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function lineDirection(line){
    return normalizePt(ptDiff(line[1],line[0]));
}

var _crossProduct = function (a, b) { //from gl-vec3 cross
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    var out = [0,0,0];
    out[0] = ay * bz - az * by
    out[1] = az * bx - ax * bz
    out[2] = ax * by - ay * bx
    return out;
};

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};


var cone2Triangles = require('./cones-to-triangles.js').cone2Triangles;

function lines2ConesTriangles(lines, thickness=0.5){
    var res = [];
    lines.forEach(function(line){
        var r = thickness;
        res.push(...cone2Triangles({line: line, r0: r, r1: r},3, line.color));
    });
    return res;
}


function jitterPt(pt, s){ //2d jitter along x-z
    return [pt[0]+Math.random()*s-s/2,0,pt[2]+Math.random()*s-s/2];
}


var createStarLinesXZ = function(_steps,s=0.25,offset=[0,0,0]){
    var lines = [];
    var steps = _steps || 360;
    //var s= 0.250;
    for(var step = 0;step< steps; step++){
        var rdown = (step%2==0)?1.0:0.5;
        var rdown1 = ((step+1)%2==0)?1.0:0.5;
        var thisPt = [Math.cos(step/steps*Math.PI*2)*s*rdown+offset[0], 0, Math.sin(step/steps*Math.PI*2)*s*rdown+offset[2]];
        var nextPt = [Math.cos((step+1)/steps*Math.PI*2)*s*rdown1+offset[0], 0, Math.sin((step+1)/steps*Math.PI*2)*s*rdown1+offset[2]];
        lines.push([thisPt,nextPt]);
    }
    return lines;
};

var createCircleLinesXZ = function(_steps,s=0.25,offset=[0,0,0]){
    var lines = [];
    var steps = _steps || 360;
    //var s= 0.250;

    for(var step = 0;step< steps; step++){
        var thisPt = [Math.cos(step/steps*Math.PI*2)*s+offset[0], 0, Math.sin(step/steps*Math.PI*2)*s+offset[2]];
        var nextPt = [Math.cos((step+1)/steps*Math.PI*2)*s+offset[0], 0, Math.sin((step+1)/steps*Math.PI*2)*s+offset[2]];
        lines.push([thisPt,nextPt]);
    }
    return lines;
};





var crossProductLines = function (a, b) {
    return _crossProduct(
        [a[1][0]-a[0][0], a[1][1]-a[0][1], a[1][2]-a[0][2]],
        [b[1][0]-b[0][0], b[1][1]-b[0][1], b[1][2]-b[0][2]]
    );
};


function scalePt(pt,s){
    return [pt[0]*s,pt[1]*s,pt[2]*s];
}



var crossProduct = _crossProduct;//for pts

if(!Math.clamp01){
    (function(){Math.clamp01=function(a/*,b,c*/){return Math.max(0.0,Math.min(1.0,a));}})();
}

var _dotProduct = function(a, b){
    return  a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
};

function lineLineClosestPtsLine(line0,line1, doClamp=true){ //get shortest line joining line0, line1 , closest approach
    //rays a,b [init pt A, direction a]
    //http://morroworks.palitri.com/Content/Docs/Rays%20closest%20point.pdf
    // D = A + a* (-(a.b)(b.c)+(a.c)(b.b) / ((a.a)(b.b) - (a.b)(a.b))
    // E = B + b* ((a.b)(a.c) - (b.c)(a.a)) / ((a.a)(b.b) - (a.b)(a.b))

    //t0 =  (-(a.b)(b.c) + (a.c)(b.b) / ((a.a)(b.b) - (a.b)(a.b))
    //t1 =  ((a.b)(a.c) - (b.c)(a.a)) / ((a.a)(b.b) - (a.b)(a.b))

    // where D is point along line a
    //   and E is point along line b

    var c = ptDiff(line1[0], line0[0]);//centerLi([line0[0],line1[0]])[1]; //c= AB
    var a = ptDiff(line0[1], line0[0]);//normalizeAndCenterLine(line0)[1];
    var b = ptDiff(line1[1], line1[0]); //normalizeAndCenterLine(line1)[1];

    //var A = line0[0];
    //var B = line1[0];


    var t0 =  (-_dotProduct(a,b)*_dotProduct(b,c)+_dotProduct(a,c)*_dotProduct(b,b)) / (_dotProduct(a,a)*_dotProduct(b,b) - _dotProduct(a,b)*_dotProduct(a,b));
    var t1 =  (_dotProduct(a,b)*_dotProduct(a,c) -_dotProduct(b,c)*_dotProduct(a,a)) / (_dotProduct(a,a)*_dotProduct(b,b) - _dotProduct(a,b)*_dotProduct(a,b));

    if(doClamp){
        t0 = Math.clamp01(t0);
        t1 = Math.clamp01(t1);
    }

    var line = [getPointAlongLine(line0, t0),getPointAlongLine(line1, t1)];
    line[0].t=t0;
    line[1].t=t1;

    return line;
}

var shiftLines = function(lineset, shift){
    var scaled = [];

    lineset.map(function(line){
        scaled.push([[
            line[0][0]+shift[0],
            line[0][1]+shift[1],
            line[0][2]+shift[2]
        ],[
            line[1][0]+shift[0],
            line[1][1]+shift[1],
            line[1][2]+shift[2]
        ]]);
    });

    return scaled;
};

var shiftLine = function(line){return shiftLines([line])[0]};


function lines2PrismTris(lines, color, height){ //prism of shape on xz plane extruded in y direction
    return lines2PrismWallTris(lines,color,height).concat(lines2PrismCapTris(lines,color,height));
}


function line2PrismTris(line,color,height){ //wall of prism only
    var tri0 = [line[1],line[0],addPts(line[0],[0,height,0])]
    var upperLine = [addPts(line[0],[0,height,0]),addPts(line[1],[0,height,0])] //TODO shift line func
    var tri1 = [upperLine[0],upperLine[1],line[1]]
    var tris = [tri0,tri1];
    if(color){
        tri0.color=color;
        tri1.color=color;
    }
    return tris;
}

function line2PrismCapTris(line,center,color,doFlip){
    var tri = doFlip ?  [line[1],line[0],center] : [line[0],line[1],center];
    if(color){
        tri.color=color;
    }
    return [tri];
}

function averageOfPts(pts){
    var avPt = [0,0,0];
    pts.forEach(function(pt){
        avPt[0]+=pt[0];
        avPt[1]+=pt[1];
        avPt[2]+=pt[2];
    });
    avPt[0]/=pts.length;
    avPt[1]/=pts.length;
    avPt[2]/=pts.length;
    return avPt;
}


function lines2PrismWallTris(lines,color,height){ //walls of prism only
    var res = [];
    lines.forEach(function(line){
        res.push(...line2PrismTris(line,color,height));
    });
    return res;
}

function lines2PrismCapTris(lines,color,height){

    var linesUpper = shiftLines(lines,[0,height,0])

    var centerBottom = averageOfPts(lines.map(l=>l[0]));
    var centerTop = averageOfPts(linesUpper.map(l=>l[0]));
    var resBottom = [];
    var resTop = [];
    lines.forEach(function(line){
        resBottom.push(...line2PrismCapTris(line,centerBottom,color,false));
    });
    linesUpper.forEach(function(line){
        resTop.push(...line2PrismCapTris(line,centerTop,color,true));
    });
    var res = [];
    res.push(...resBottom);
    res.push(...resTop);
    return res;
}

function boundingBlockOfBlocks(blocks){
    // var eps = 0.001;
    // var bb = [blocks[0][0], blocks[0][1]];
    //
    // for(var i=0; i<blocks.length;i++){
    //     var b = blocks[i];
    //     var xLo = Math.min(Math.min(b[0][0],bb[0][0]), Math.min(b[1][0],bb[0][0]));
    //     var xHi = Math.max(Math.max(b[0][0],bb[1][0]), Math.max(b[1][0],bb[1][0]));
    //     var yLo = Math.min(Math.min(b[0][1],bb[0][1]), Math.min(b[1][1],bb[0][1]));
    //     var yHi = Math.max(Math.max(b[0][1],bb[1][1]), Math.max(b[1][1],bb[1][1]));
    //     var zLo = Math.min(Math.min(b[0][2],bb[0][2]), Math.min(b[1][2],bb[0][2]));
    //     var zHi = Math.max(Math.max(b[0][2],bb[1][2]), Math.max(b[1][2],bb[1][2]));
    //     bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    // }
    //
    // return bb;

    return boundingBlockOfPts([].concat(...blocks))
};

var boundingBlockOfLines = boundingBlockOfBlocks;

function boundingBlockOfPts(sop){
    //var eps = 0.001;
    //var L = 9999999;
    var bb = [sop[0],sop[0]];//[[L,L,L],[-L,-L,-L]];//[sop[0],sop[0]];

    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        var xLo = Math.min(Math.min(p[0],bb[0][0]), Math.min(p[0],bb[0][0]));
        var xHi = Math.max(Math.max(p[0],bb[1][0]), Math.max(p[0],bb[1][0]));
        var yLo = Math.min(Math.min(p[1],bb[0][1]), Math.min(p[1],bb[0][1]));
        var yHi = Math.max(Math.max(p[1],bb[1][1]), Math.max(p[1],bb[1][1]));
        var zLo = Math.min(Math.min(p[2],bb[0][2]), Math.min(p[2],bb[0][2]));
        var zHi = Math.max(Math.max(p[2],bb[1][2]), Math.max(p[2],bb[1][2]));
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }

    return bb;
};

function boundingBlockOfTriangles(tris){
    return boundingBlockOfPts([].concat(...tris))
}

function sectorRelativeCoordinates(sector, pos){ //get coords relative to sector s, 0...1 if inside
    //var c = [pos[0]-sector[0][0],pos[1]-sector[0][1],pos[2]-sector[0][2]]; //coords moved to origin but not scaled
    //var dims = sectorDimensions(sector);
    var esp = 0.000001;
    return [(pos[0]-sector[0][0])/(sector[1][0] - sector[0][0]+esp), (pos[1]-sector[0][1])/(sector[1][1] - sector[0][1]+esp),(pos[2]-sector[0][2])/(sector[1][2] - sector[0][2]+esp)];
}

function sectorDimensions(s){
    return [
        s[1][0] - s[0][0],
        s[1][1] - s[0][1],
        s[1][2] - s[0][2]
    ];
}

function sectorRelativeCoordinatesInverse(sector,pt){ //inverse of above
    var dims = sectorDimensions(sector);
    return [
        sector[0][0]+dims[0]*pt[0],
        sector[0][1]+dims[1]*pt[1],
        sector[0][2]+dims[2]*pt[2],
    ];
}

function remapTrisToSector(tris,sector){

    var trisBounds = boundingBlockOfTriangles(tris);
    var relativeTris = tris.map(function(tri){
        return tri.map(pt=>sectorRelativeCoordinates(trisBounds,pt))
    });

    return relativeTris.map(function(tri){
        return tri.map(pt=>sectorRelativeCoordinatesInverse(sector,pt))
    });
}

function remapLinesToSector(lines,sector){
    var linesBounds = boundingBlockOfLines(lines);
    var relativeLines = lines.map(function(line){
        return line.map(pt=>sectorRelativeCoordinates(linesBounds,pt));
    });
    return relativeLines.map(function(line){
        return line.map(pt=>sectorRelativeCoordinatesInverse(sector,pt));
    });
}

function linesetFlipAlongZ(sol){
    var bb = boundingBlockOfLines(sol);

    var bbFlippedZ = [bb[0],bb[1]];
    var oldZ =  bbFlippedZ[0][2];
    bbFlippedZ[0][2] = bbFlippedZ[1][2];
    bbFlippedZ[1][2] = oldZ;

    return remapLinesToSector(sol,bbFlippedZ);
}

module.exports = {linesetFlipAlongZ, sector2LinesEdges, remapTrisToSector, boundingBlockOfPts, boundingBlockOfLines, boundingBlockOfBlocks, lines2ConesTriangles,  shiftLine, shiftLines, lineLineClosestPtsLine,crossProductLines,crossProduct, lineDirection, ptDiff, normalizePt, scalePt, lineLength, lineMidPt, centerOfLine, normalizeLine,addPts, createStarLinesXZ, getPointAlongLine_dist, createCircleLinesXZ, getPointAlongLine, jitterPt, normalizeAndCenterLine};