function hashBy100(v,eps){return Math.floor(v/eps);}
function hashPos(pt,eps){return `${hashBy100(pt[0],eps)}_${hashBy100(pt[1],eps)}_${hashBy100(pt[2],eps)}`}

function deduplicateLinesPt(lines,eps){
    var posMap = {};

    return lines.map(function(line){
        return line.map(function(pt){
            var hash = hashPos(pt,eps);
            if(!posMap[hash]){
                posMap[hash] = pt;
            }
            return posMap[hash];
        });
    });
}

function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function sector2RTreeObj(sector,_rad=0.0){
    var rad = _rad ;
    const item = {
        minX: sector[0][0]-rad,
        minY: sector[0][1]-rad,
        minZ: sector[0][2]-rad,
        maxX: sector[1][0]+rad,
        maxY: sector[1][1]+rad,
        maxZ: sector[1][2]+rad,
        sector: sector
    };
    return item;
}

var RTREE = require('rbush-3d');
function sectors2RTree(sos) {
    var theTree = new RTREE.RBush3D(2);
    theTree.clear();
    var sectorBoxes = sos.map(function (sector) {
        return sector2RTreeObj(sector, 0.0001);
    });
    theTree.load(sectorBoxes);
    return theTree;
}

var addPts = function(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function linesNearbyPtFunc(lines, radius){//}, tree){
    var sectorsRTree = sectors2RTree(lines); //tree ||
    var s = radius/2;
    return function(pt){
        return sectorsRTree.search(sector2RTreeObj([addPts(pt,[-s,-s,-s]),addPts(pt,[s,s,s])],s)).map(s=>s.sector);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);
    }
}

function lines2PtsWithNeighbors(_sol, eps=0.01,doCleanup=true){

    var sol = deduplicateLinesPt(_sol, eps);

    var linesNearby = linesNearbyPtFunc(sol,eps);

    var ptsInOrder = [];

    function getCloserPtFromLine(pt,line){
        return lineLength([pt,line[0]])<lineLength([pt,line[1]]) ? line[0] : line[1];
    }

    var currentPtIndex = 1;
    sol.forEach(function(line){
        line.forEach(function(linePt){
            if(!linePt.ptIndex){
                linePt.ptIndex = currentPtIndex+"";
                linePt.origPt = linePt;
                //linePt.isOrigPt = true;
                var linesNearLinePt = linesNearby(linePt);
                var ptsNearLinePt = linesNearLinePt.map(_line => getCloserPtFromLine(linePt,_line));
                ptsNearLinePt.forEach(function(ptOnNearbyLine){
                    ptOnNearbyLine.ptIndex=linePt.ptIndex;
                    ptOnNearbyLine.origPt = linePt;
                });
                ptsInOrder.push(linePt);
                currentPtIndex++;
            }
        });
    });

    var neighborsPerIndex = {};
    var ptPerIndex = {};

    sol.forEach(function(line){
        neighborsPerIndex[line[0].ptIndex+""] = neighborsPerIndex[line[0].ptIndex+""] || [];
        neighborsPerIndex[line[0].ptIndex+""].push(line[1].origPt);

        neighborsPerIndex[line[1].ptIndex+""] = neighborsPerIndex[line[1].ptIndex+""] || [];
        //remove following line to disable 2-way connections... 
        neighborsPerIndex[line[1].ptIndex+""].push(line[0].origPt);

        ptPerIndex[line[0].ptIndex+""]=line[0].origPt;
        ptPerIndex[line[1].ptIndex+""]=line[1].origPt;
    });

    var res = [];
    for(var index in ptPerIndex){
        ptPerIndex[index+""].neighbors = neighborsPerIndex[index];
        ptPerIndex[index+""].i = index + "";
        //ptPerIndex[index+""].finalIndex = res.length;
        res.push(ptPerIndex[index+""]);
    }

    //re-naming index so that index = array index
    res = res.map(function(pt,i){
        pt.ptIndex = i+"";
        pt.i = i+"";//pt.finalIndex+"";
        if(doCleanup){
            delete pt.ptIndex;
            delete pt.origPt;
        }
        return pt;
    });

    return res;
}

function setOfPtsNeighbors2Lines(sop){
    var sol = [];
    var nMap = {};
    for(var i=0; i<sop.length; i++){
        var pt = sop[i];
        for(var n=0; n<pt.neighbors.length; n++){
            var np = pt.neighbors[n];
            var ni = np.i ? parseInt(np.i+"") : sop.indexOf(np);

            if(i!==ni){
                var smallerIndex = Math.min(ni, i);
                var largerIndex = Math.max(ni,i);
                if(!nMap[smallerIndex+"_"+largerIndex]){ //prevent repeats
                    nMap[smallerIndex+"_"+largerIndex]=true;
                    sol.push([sop[smallerIndex], sop[largerIndex]]);
                }
            }
        }
    }
    return sol.filter(line=>line[0]&&line[1]);
}

module.exports = {lines2PtsWithNeighbors, setOfPtsNeighbors2Lines}