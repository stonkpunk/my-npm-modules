var bf =  require('simple-bitmap-font');
var BF = new bf();

function boundingBlockOfPts(sop){
    var bb = [sop[0],sop[0]];
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

function addPts(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

function shiftPtsToOrigin(pts){
    var bb = boundingBlockOfPts(pts);
    return pts.map(function(pt){
        return ptDiff(pt,bb[0]);
    });
}

function shiftPts(pts,offset){
    return pts.map(function(pt){
        return addPts(pt,offset);
    });
}

function ptsFlipY(pts){
    return pts.map(function(pt){
        pt[1]*=-1;
        return pt;
    });
}

function clipPtToScreenXY(pt,w,h){
    return [
        Math.min(w-1,Math.max(0,pt[0])),
        Math.min(h-1,Math.max(0,pt[1])),
        pt[2]
    ]
}

function filterPtsByScreenClip(pts,w,h){
    return pts.filter(function(pt){
        if(pt[0]<0){return false}
        if(pt[1]<0){return false}
        if(pt[0]>w-1){return false}
        if(pt[1]>h-1){return false}
        return true;
    });
}

function drawPtsToBuffer(pts, color, buffer, w, h){ //color = [255,255,255] for white etc
    pts = filterPtsByScreenClip(pts,w,h);//pts.map(pt=>clipPtToScreenXY(pt,w,h))
    pts.forEach(function(pt,i){
        var o = 4*(pt[0]+w*pt[1]);
        buffer[o] = color[0];
        buffer[++o] = color[1];
        buffer[++o] = color[2];
    });
}

function scalePt(pt,s){
    return pt.map(c=>c*s);
}

function ptsExpand2x(pts){
    var res = [];
    var ptsScaled = pts.map(p=>scalePt(p,2))
    ptsScaled.forEach(function(pt){
        res.push(pt);
        res.push(addPts(pt,[0,1,0]))
        res.push(addPts(pt,[1,0,0]))
        res.push(addPts(pt,[1,1,0]))
    });
    return res;
}

//TODO version with colors per letter?
function drawTextToBuffer(text,textOffset,color,buffer,w,h, expand2x=false, maxLineLen=32, pixelsBetweenLines=2){

    var offsetX = textOffset[0];
    var offsetY = textOffset[1];

    var lines = text.split('\n');

    var resPts = [];

    var lineHeight = 7 + pixelsBetweenLines;

    var doExpand = expand2x;
    if(doExpand){lineHeight*=2}

    lines.forEach(function(line,i){
        var thePts = BF.ptsForString(line,maxLineLen);
        if(doExpand){thePts = ptsExpand2x(thePts);}
        var strPts = shiftPts(ptsFlipY(thePts), [offsetX,offsetY+i*lineHeight,0]) //list of 3d pts representing pixels in the string [[x,y,z],[x,y,z],...]
        resPts = resPts.concat(strPts);
    });

    //TODO pre-bake epx'd versions of bitmap font?
    drawPtsToBuffer(resPts,color,buffer,w,h);
}

module.exports = {drawTextToBuffer};

