var hashSize = 1000;
function _ptHash3(x,y,z){
    return Math.floor(x*hashSize) + Math.floor(y*hashSize)*hashSize + Math.floor(z*hashSize)*hashSize*hashSize;//hashBy100(x) +"_" +hashBy100(y) + "_" + hashBy100(z); //hashByTenthR actually hashes by 1000
}

function lcHash(lc){
    var h0 = _ptHash3(lc[0][0],lc[0][1],lc[0][2]);
    var h1 = _ptHash3(lc[1][0],lc[1][1],lc[1][2]);
    var _h0 = Math.min(h0,h1);
    var _h1 = Math.max(h0,h1);
    return `${_h0}_${_h1}`;
}

function removeDuplicateLines(sol){
    var lcMap = {};
    var lcUniq = [];
    sol.forEach(function(lc){
        var h = lcHash(lc);
        if(!lcMap[h]){
            lcMap[h]=true;
            lcUniq.push(lc);
        }
    });
    return lcUniq;
}

var getPointAlongLine = function(line, _t){
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function lineChopIn2(line,t){
    var ip = getPointAlongLine(line,t);
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

var lca = require('line-of-closest-approach');
var RTREE = require('rbush-3d');

function sectors2RTree(sos,rad) {
    var theTree = new RTREE.RBush3D(2); //Higher value means faster insertion and slower search, and vice versa.
    theTree.clear();
    var sectorBoxes = sos.map(function (sector) {
        return sector2RTreeObj(sector, rad||0.0001);
    });
    theTree.load(sectorBoxes);
    return theTree;
}

function sector2RTreeObj(sector,_rad){

    var minX = Math.min(sector[0][0],sector[1][0]);
    var maxX = Math.max(sector[0][0],sector[1][0]);
    var minY = Math.min(sector[0][1],sector[1][1]);
    var maxY = Math.max(sector[0][1],sector[1][1]);
    var minZ = Math.min(sector[0][2],sector[1][2]);
    var maxZ = Math.max(sector[0][2],sector[1][2]);

    var rad = _rad || 0.0001;
    const item = {
        minX: minX-rad,
        minY: minY-rad,
        minZ: minZ-rad,
        maxX: maxX+rad,
        maxY: maxY+rad,
        maxZ: maxZ+rad,
        sector: sector
    };
    return item;
}

function linesNearbyFunc(lines, radius){
    var sectorsRTree = sectors2RTree(lines);
    var s = radius;
    return function(line){
        return sectorsRTree.search(sector2RTreeObj(line,s)).map(s=>s.sector);
    }
}

function tryChopLinesSingle(lines, MIN_DIST){

    var linesNearFunc = linesNearbyFunc(lines, MIN_DIST*2);

    var res = [];
    var chopsCount = 0;
    lines.forEach(function(line){
        var linesNearby = linesNearFunc(line);
        var lineChopped = false;

        //check if any of the lines intersects -- eg check if closest approach t is not (0 or 1) and comes within eps dist
        //if the lines intersect, this line by the other line, add the chopped bits to res, increment chops count
        linesNearby.forEach(function(nline){
            if(nline!=line && !lineChopped){
                var cline = lca(line,nline);
                var distToLine = lineLength(cline);
                var line0T = cline[2];
                var isAtLine0Edge = (line0T<0.01 || line0T>1.0-0.01); //cline[2] == cline[0].t

                // if(isAtLine0Edge){
                //     console.log("edge");
                // }

                if(distToLine<MIN_DIST && !isAtLine0Edge){
                    res.push(...lineChopIn2(line, line0T))
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
        lines = lines.filter(lineLength)

    }while((res.chopsCount>0) && (attempts<50))
    return removeDuplicateLines(res.lines);
}

module.exports = chopLinesBySelf;