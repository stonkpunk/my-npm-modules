function sectorDistFast(s,x,y,z){
    return Math.max(Math.max(  //intersection of 3 planes offset by half-size per coord
            Math.abs(x-(s[1][0]+s[0][0])/2.0)-(s[1][0]-s[0][0])/2.0,
            Math.abs(y-(s[1][1]+s[0][1])/2.0)-(s[1][1]-s[0][1])/2.0),
        Math.abs(z-(s[1][2]+s[0][2])/2.0)-(s[1][2]-s[0][2])/2.0
    );
}

function dfForSector(s, radius=0){
    return function(x,y,z){
        return sectorDistFast(s,x,y,z)-radius;
    }
}

module.exports = {
    sectorDistFast,
    dfForSector
};