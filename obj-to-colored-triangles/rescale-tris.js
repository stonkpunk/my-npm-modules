function ptsRelativeToBb(pts,bb){
    var bbDimsPt = bbDims(bb);
    return pts.map(function(pt){
        return lu.scalePtByPtInv(lu.ptDiff(pt,bb[0]),bbDimsPt)
    });
}

function trisRelativeToBb(tris,bb){
    return tris.map(function(tri){
        return ptsRelativeToBb(tri,bb);
    });
}

function bbDims(bb){
    return lu.ptDiff(bb[1],bb[0])
}

function getPtInBb(ptRelative,bb){
    var bbDimsPt = bbDims(bb);
    return lu.addPts(bb[0],lu.scalePtByPt(ptRelative,bbDimsPt));
}

function bbLongestDim(bb){
    return Math.max(...bbDims(bb));
}

var bbt = require('./bb-tris.js');
const lu = require("./line-utils-basic");
function rescaleTrianglesToBb(tris,bbDesired){
    var trisBb = bbt(tris);
    var trisR = trisRelativeToBb(tris, trisBb);
    return trisR.map(function(tri){
        return tri.map(function(pt){
            return getPtInBb(pt,bbDesired);
        });
    });
}

function rescaleTrisForLargestDimSize(tris,size=10){
    var desiredMaxDim = size;
    var bl = bbLongestDim(bbt(tris));
    return rescaleTrianglesToBb(tris, [[0,0,0],lu.scalePtByPt([desiredMaxDim/bl,desiredMaxDim/bl,desiredMaxDim/bl], bbDims(bbt(tris)))]);
}

module.exports = {ptsRelativeToBb, bbDims, getPtInBb, bbLongestDim, rescaleTrianglesToBb, rescaleTrisForLargestDimSize};