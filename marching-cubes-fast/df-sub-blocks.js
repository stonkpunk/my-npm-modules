function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

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

function getSubBlocksForBlockIteratedDFunc_edgesOnly(_block, i, df, biasDist=0){
    var blockList = getSubBlocksForBlock(_block);
    blockList = blockList.filter(function(block){
        var centerPt = centerOfBlock(block);
        var dfc = df(centerPt[0],centerPt[1],centerPt[2]);
        block.dist = dfc;
        return  Math.abs(dfc) <lineLength([centerPt,block[0]])+biasDist;
    });
    if(i==0){
        return blockList;
    }else{
        return blockList.map(function(block){return getSubBlocksForBlockIteratedDFunc_edgesOnly(block,i-1, df)}).reduce(function(a, b) {
            return a.concat(b);
        }, []);
    }
}

//
// function getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE(_block, isFirst, i, tree){ //isFirst = parentBlock (so named because ignored at first)
//
//     //decomposes block into 8 sub-blocks
//     var SEARCH_RADIUS = 0.10;
//     var closeLines = _block.closeLines ? _block.closeLines : tree.search(line2RTreeObj(_block, SEARCH_RADIUS)).map(function(treeObj){return treeObj.origLine;});
//     //var closeLines =tree.search(line2RTreeObj(_block, SEARCH_RADIUS)).map(function(treeObj){return treeObj.origLine;});
//
//     //decomposes block into 8 sub-blocks
//
//     //var distToEdgeDf = sector2dFunc(_block);
//
//     var df = function(x,y,z){
//         return linesetConeDistance_C(x,y,z, closeLines); //needs to be C not E (dont set "used" flag)
//     };
//
//     var blockList = getSubBlocksForBlock(_block);//[block000, block001, block010, block011, block100, block101, block110, block111];
//
//     blockList = blockList.filter(function(block){
//         var centerPt = centerOfBlock(block);
//
//         //if(-distToEdgeDf(centerPt[0],centerPt[1],centerPt[2])>lineLength([centerPt,block[0]]))return false;
//
//         var dfc = df(centerPt[0],centerPt[1],centerPt[2]);
//         block.dist = dfc;
//
//         if(  Math.abs(dfc) <lineLength([centerPt,block[0]])){
//             block.closeLines = tree.search(line2RTreeObj(block, SEARCH_RADIUS)).map(function(treeObj){return treeObj.origLine;});
//             return true;
//         }
//         return false;
//     });
//
//     if(i==0){
//         return blockList;
//     }else{
//         return blockList.map(function(block){return getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE(block,_block,i-1, tree)}).reduce(function(a, b) {
//             return a.concat(b);
//         }, []);
//     }
// }

module.exports = {getSubBlocksForBlockIteratedDFunc_edgesOnly};