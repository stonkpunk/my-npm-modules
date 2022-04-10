var mcvl = require('./fast-marching-cubes-voxel-list-tree.js');
var dfsb = require('./df-sub-blocks.js');
var dfb = require('./df-builder.js');

var buildDfFromRTreeObjs = dfb.buildDfFromRTreeObjs;

// var s = 500;
// function buildForBlock(dfObjList, renderBlock = [[-s,-s,-s],[s,s,s]], iters, _dfBuilderResult){
//     var dfBuilderResult = _dfBuilderResult || buildDfFromRTreeObjs(dfObjList)
//     var subBlocks = dfsb.getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE(renderBlock,iters, dfBuilderResult.rtree);
//     var mcRes = mcvl.marchingCubes(subBlocks);
//     mcRes.dfBuilderResult = dfBuilderResult;
//     return mcRes;
// }

var bbb = require('./bb-bbs.js');
function dfListBounds(dfList){
    return bbb(dfList.map(d=>d.bounds));
}

function buildForList(dfObjList, iters=5, renderBlock = dfListBounds(dfObjList), _dfBuilderResult){
    var dfBuilderResult = _dfBuilderResult || buildDfFromRTreeObjs(dfObjList);
    var subBlocks = dfsb.getSubBlocksForBlockIteratedDFunc_edgesOnly_TREE(renderBlock,iters, dfBuilderResult.rtree);
    var mcRes = mcvl.marchingCubes(subBlocks);
    mcRes.dfBuilderResult = dfBuilderResult;
    return mcRes;
}

module.exports = {dfListBounds, buildDfFromRTreeObjs, buildForList/*, buildForBlock*/};

