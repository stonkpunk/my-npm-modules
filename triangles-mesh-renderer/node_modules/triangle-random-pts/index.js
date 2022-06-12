function generateRandomBarycoord(){
    var pt = [Math.random(),Math.random(),0];
    if(pt[0]+pt[1]>1){
        pt[0]=1.0-pt[0];
        pt[1]=1.0-pt[1];
    }
    pt[2] = 1.0-pt[0]-pt[1];
    return pt;
}

function triCartesianCoordsFromBarycentric(triBaryCoords, tri){
    return [
        tri[0][0]*triBaryCoords[0] + tri[1][0]*triBaryCoords[1] + tri[2][0]*triBaryCoords[2],
        tri[0][1]*triBaryCoords[0] + tri[1][1]*triBaryCoords[1] + tri[2][1]*triBaryCoords[2],
        tri[0][2]*triBaryCoords[0] + tri[1][2]*triBaryCoords[1] + tri[2][2]*triBaryCoords[2],
    ];
}

function triangleRndPtsForTotal(tri,totalPts){
    var res=[];
    for(var i=0; i<totalPts; i++){
        res.push(triCartesianCoordsFromBarycentric(generateRandomBarycoord(),tri));
    }
    return res;
}

//based on http://extremelearning.com.au/unreasonable-effectiveness-of-quasirandom-sequences/
var ___n=1.0;
function randomXY_low_discrep(){
    var g = 1.32471795724474602596;
    var a1 = 1.0/g;
    var a2 = 1.0/(g*g);
    var x = (0.5+a1*___n) %1.0;
    var y = (0.5+a2*___n) %1.0;
    ___n+=1.0;
    return [x,y];
}

function generateRandomBarycoord_low_discrep(){
    var xy = randomXY_low_discrep();
    var pt = [xy[0],xy[1],0];
    if(pt[0]+pt[1]>1){
        pt[0]=1.0-pt[0];
        pt[1]=1.0-pt[1];
    }
    pt[2] = 1.0-pt[0]-pt[1];
    return pt;
}

function triangleRndPtsForTotal_low_discrep(tri,totalPts){
    var res=[];
    for(var i=0; i<totalPts; i++){
        res.push(triCartesianCoordsFromBarycentric(generateRandomBarycoord_low_discrep(),tri));
    }
    return res;
}

module.exports.randomPointsInTriangle = triangleRndPtsForTotal;
module.exports.quasiRandomPointsInTriangle = triangleRndPtsForTotal_low_discrep;