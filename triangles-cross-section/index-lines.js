
function hashByDigits(v,digits= 1){return Math.floor(v*Math.pow(10,digits));} //digit=1=10th

function hashPt(pt){
    return pt.map(function(d){return hashByDigits(d,1)}).join('_');
}

var indexLines = function(_lines){ //TODO improve w rtree or octree or something
    var ptsMap = {};
    //var ptIndexNow = 0;

    var pts = [];
    var lines = [];
    _lines.forEach(function(line){
        var h0 = hashPt(line[0]);
        var h1 = hashPt(line[1]);
        if(!ptsMap[h0]){
            ptsMap[h0] = {hash:h0,index:pts.length,pt:line[0],lines:[line]};
            pts.push(line[0]);
            //ptIndexNow++;
        }else{
            ptsMap[h0].lines.push(line);
        }
        if(!ptsMap[h1]){
            ptsMap[h1] = {hash:h1,index:pts.length,pt:line[1],lines:[line]};
            pts.push(line[1]);
            //ptIndexNow++;
        }else{
            ptsMap[h1].lines.push(line);
        }
        lines.push([ptsMap[h0].index,ptsMap[h1].index]);
    });

    return {pts: pts, linesIndices: lines, ptsMap: ptsMap};
};

module.exports= {indexLines,hashPt};