//https://www.npmjs.com/package/box-frustum

function getSubBlocksForBlock(block){ //decomposes block into 8 sub-blocks
    var minX = block[0][0];
    var minY = block[0][1];
    var minZ = block[0][2];
    var maxX = block[1][0];
    var maxY = block[1][1];
    var maxZ = block[1][2];
    var blockW = maxX-minX;
    var blockH = maxY-minY;
    var blockD = maxZ-minZ;
    var halfX = minX+blockW/2;
    var halfY = minY+blockH/2;
    var halfZ = minZ+blockD/2;
    var block000 = [[minX,minY,minZ], [halfX,halfY,halfZ]];
    var block001 = [[minX,minY,halfZ], [halfX,halfY,maxZ]];
    var block010 = [[minX,halfY,minZ], [halfX,maxY,halfZ]];
    var block011 = [[minX,halfY,halfZ], [halfX,maxY,maxZ]];
    var block100 = [[halfX,minY,minZ], [maxX,halfY,halfZ]];
    var block101 = [[halfX,minY,halfZ], [maxX,halfY,maxZ]];
    var block110 = [[halfX,halfY,minZ], [maxX,maxY,halfZ]];
    var block111 = [[halfX,halfY,halfZ], [maxX,maxY,maxZ]];
    return [block000, block001, block010, block011, block100, block101, block110, block111];
}

var bf = require("box-frustum");

function frustumBoxes(pvMatrix, fullBox, iters=2){ //get fullBox vs getPvMatrixFrustrumCorners
    if(iters==0){
        return [fullBox];
    }else{
        var subBlocks = getSubBlocksForBlock(fullBox).filter(sb=>bf(pvMatrix,sb));
        return [].concat(...subBlocks.map(sb=>frustumBoxes(pvMatrix,sb,iters-1)));
    }
}

module.exports = {frustumBoxes};