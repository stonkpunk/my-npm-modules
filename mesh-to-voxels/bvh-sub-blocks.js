// function lineLength(line){
//     var a = line[1][0]-line[0][0];
//     var b = line[1][1]-line[0][1];
//     var c = line[1][2]-line[0][2];
//     return Math.sqrt(a*a+b*b+c*c);
// };
//
function centerOfBlock(block){
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
    return [halfX,halfY,halfZ];
}

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

function aabbToPts(aabb){
    var p000 = aabb[0];
    var p001 = [aabb[0][0],aabb[0][1],aabb[1][2]];
    var p010 = [aabb[0][0],aabb[1][1],aabb[0][2]];
    var p011 = [aabb[0][0],aabb[1][1],aabb[1][2]];
    var p100 = [aabb[1][0],aabb[0][1],aabb[0][2]];
    var p101 = [aabb[1][0],aabb[0][1],aabb[1][2]];
    var p110 = [aabb[1][0],aabb[1][1],aabb[0][2]];
    var p111 = aabb[1];
    return [p000, p001, p010, p011, p100, p101, p110, p111]
}

function aabbInsideOutness(aabb,bvh){ //returns number of corners inside the mesh
    return aabbToPts(aabb).filter(pt=>bvh.isInside(pt)).length;
}

var mergeBoxes = require('merge-boxes').mergeBoxes;

function getSubBlocksForBlockIterated(_block, i, bvh,
                                      edgesOnly=false,
                                      volumeOnly=false,
                                      dontSubdivideEnclosedBlocks=false,
                                      mergeAfter=false){
    var blockList = getSubBlocksForBlock(_block);
    blockList = blockList.filter(function(block){
        var insideness = aabbInsideOutness(block,bvh);
        block.insideness = insideness;
        block.isEdge = (insideness>0 && insideness<8);
        block.isEnclosed = block.insideness == 8;
        return edgesOnly ? block.isEdge : (block.isEdge || block.isEnclosed);
    });
    if(i==0){
        var res = blockList;
        if(volumeOnly){
            res = blockList.filter(block=>block.insideness==8);
        }
        if(mergeAfter){
            mergeBoxes(res);
        }
        return res;
    }else{
        return blockList.map(function(block){
            //if dontSubdivideEnclosedBlocks, and block is totally contained in the mesh, return the block
            if(!edgesOnly && dontSubdivideEnclosedBlocks && block.isEnclosed){
                return [block];
            }
            return getSubBlocksForBlockIterated(block,i-1, bvh, edgesOnly, volumeOnly, dontSubdivideEnclosedBlocks, mergeAfter)}
        ).reduce(function(a, b) {
            return a.concat(b);
        }, []);
    }
}

function maxDim(block){
    var s = block;
    var sx = Math.abs(s[1][0]-s[0][0]);
    var sy = Math.abs(s[1][1]-s[0][1]);
    var sz = Math.abs(s[1][2]-s[0][2]);
    return Math.max(sx,sy,sz);
}

function blockToCube(block){
    var md = maxDim(block);
    var h = md/2;
    var c = centerOfBlock(block);
    return [[c[0]-h,c[1]-h,c[2]-h],[c[0]+h,c[1]+h,c[2]+h]];
}

module.exports = {getSubBlocksForBlock, getSubBlocksForBlockIterated, blockToCube};