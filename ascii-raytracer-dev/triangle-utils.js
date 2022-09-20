function boundingBlockOfBlocks(blocks){
    var eps = 0.001;
    var bb = [blocks[0][0], blocks[0][1]];

    for(var i=0; i<blocks.length;i++){
        var b = blocks[i];
        var xLo = Math.min(Math.min(b[0][0],bb[0][0]), Math.min(b[1][0],bb[0][0]));
        var xHi = Math.max(Math.max(b[0][0],bb[1][0]), Math.max(b[1][0],bb[1][0]));
        var yLo = Math.min(Math.min(b[0][1],bb[0][1]), Math.min(b[1][1],bb[0][1]));
        var yHi = Math.max(Math.max(b[0][1],bb[1][1]), Math.max(b[1][1],bb[1][1]));
        var zLo = Math.min(Math.min(b[0][2],bb[0][2]), Math.min(b[1][2],bb[0][2]));
        var zHi = Math.max(Math.max(b[0][2],bb[1][2]), Math.max(b[1][2],bb[1][2]));
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }

    return bb;
};

function triangleBounds(tri){
    return boundingBlockOfPts([tri[0],tri[1],tri[2]]);
}

function trianglesBounds(tris){
    return boundingBlockOfBlocks(tris.map(triangleBounds));
}

module.exports = {trianglesBounds};