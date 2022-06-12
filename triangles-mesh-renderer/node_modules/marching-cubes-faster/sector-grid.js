//https://stackoverflow.com/questions/15728893/how-to-always-round-down-to-the-nearest-multiple-of-x-in-javascript
var customFloor = function(value, roundTo) {
    return Math.floor(value / roundTo) * roundTo;
}
var customCeil = function(value, roundTo) {
    return Math.ceil(value / roundTo) * roundTo;
}

function gridHash(s,n){
    return [
        Math.floor(s[0][0] / n),
        Math.floor(s[0][1] / n),
        Math.floor(s[0][2] / n),
        Math.floor(s[1][0] / n),
        Math.floor(s[1][1] / n),
        Math.floor(s[1][2] / n)
    ].join('_')
}

function roundDownPt(pt,n){
    return [
        customFloor(pt[0],n),
        customFloor(pt[1],n),
        customFloor(pt[2],n)
    ]
}

function roundUpPt(pt,n){
    return [
        customCeil(pt[0],n),
        customCeil(pt[1],n),
        customCeil(pt[2],n)
    ]
}

//sector grid aligned to multiples of blockSize. all sectors have edges with coordinates along multiples of blockSize.
function sectorGrid(bounds,blockSize=64,hashMap={}){ //TODO sieve by radius maybe
    var boundsRounded = [
        roundDownPt(bounds[0],blockSize),
        roundUpPt(bounds[1],blockSize)
    ];
    var res = [];
    for(var x=boundsRounded[0][0]; x<boundsRounded[1][0]; x+=blockSize){
        for(var y=boundsRounded[0][1]; y<boundsRounded[1][1]; y+=blockSize){
            for(var z=boundsRounded[0][2]; z<boundsRounded[1][2]; z+=blockSize){
                var block =   [[x,y,z],[x+blockSize,y+blockSize,z+blockSize]];
                var hash = gridHash(block,blockSize);
                if(!hashMap[hash]){
                    hashMap[hash] = block;
                    res.push(
                        block
                    );
                }
            }
        }
    }
    return {blockList:res, hashMap};
}

module.exports = sectorGrid;