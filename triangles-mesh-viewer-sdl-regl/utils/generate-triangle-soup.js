function rndPos(S){
    return [
        Math.random()*S-S/2,
        Math.random()*S-S/2,
        Math.random()*S-S/2
    ]
}

function triangleSoup(numTris=100, spaceSize=10){
    var res = {
        positions:[],
        cells:[]
    }

    var S = spaceSize;

    for(var i=0;i<numTris;i++){
        res.cells.push([i*3,i*3+1,i*3+2]);
        res.positions.push(rndPos(S));
        res.positions.push(rndPos(S));
        res.positions.push(rndPos(S));
    }

    return res;
}

module.exports = {triangleSoup};