var sortByIFast = require('./sort-by-i-fast.js');

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

function block2RTreeObj(block, radius){//}, index){
    var rad = radius || 0;
    var _block = block;//getPointsetBoundsSector(block);
    return {
        minX: _block[0][0]-rad,
        minY: _block[0][1]-rad,
        minZ: _block[0][2]-rad,
        maxX: _block[1][0]+rad,
        maxY: _block[1][1]+rad,
        maxZ: _block[1][2]+rad,
        orig: block,
        //foo: 'bar'
    };
}

var distanceForRTreeObjs = require('./distance-for-rtree-objs.js');

var dflr = require('./df-list-rtree.js');

function getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE(_block, i, tree){

    var SEARCH_RADIUS_EXTRA = 0.10;
    var closeRTreeObjs = _block.closeRTreeObjs ? _block.closeRTreeObjs : tree.search(dflr.rTreeObjForSector(_block, SEARCH_RADIUS_EXTRA));//.map(function(treeObj){return treeObj.orig;});
    closeRTreeObjs = sortByIFast(closeRTreeObjs);

    var blockList = getSubBlocksForBlock(_block);
    blockList = blockList.filter(function(block){
        var centerPt = centerOfBlock(block);
        var dfc = distanceForRTreeObjs(centerPt[0],centerPt[1],centerPt[2], closeRTreeObjs);
        block.dist = dfc;

        if(  Math.abs(dfc) <lineLength([centerPt,block[0]])){
            block.closeRTreeObjs = sortByIFast(tree.search(block2RTreeObj(block, SEARCH_RADIUS_EXTRA)));//.map(function(treeObj){return treeObj.orig;}));
            return true;
        }

        return false;// Math.abs(dfc) <lineLength([centerPt,block[0]]);
    });
    if(i==0){
        return blockList;
    }else{
        return blockList.map(function(block){return getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE(block,i-1, tree)}).reduce(function(a, b) {
            return a.concat(b);
        }, []);
    }
}

module.exports = {getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE};