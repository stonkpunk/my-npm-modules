function distanceForRTreeObjs(x, y, z, closeBlocks){
    var dist = 99999999;
    for(var i=0;i<closeBlocks.length;i++){
        var closeBlock = closeBlocks[i];
        switch(closeBlock.op){
            case "add":
                dist = Math.min(dist, closeBlock.df(x,y,z));
                break;
            case "sub":
                dist = Math.max(dist, -closeBlock.df(x,y,z)); //same as subtract
                break;
            case "subtract":
                dist = Math.max(dist, -closeBlock.df(x,y,z)); //same as sub
                break;
            case "sub-inv":
                dist = Math.max(-dist, closeBlock.df(x,y,z));
                break;
        }
    }
    return dist;
}

module.exports = distanceForRTreeObjs;