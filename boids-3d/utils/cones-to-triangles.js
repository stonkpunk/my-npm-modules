// cone format
// {
//     line: [pt3d,pt3d], //pt is [x,y,z]
//     r0: radius0,
//     r1: radius1
// }

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

var addPts = function(p0, p1){
  return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

var addPtsScaled = function(p0, p1,s0,s1){
    return [p0[0]*s0+p1[0]*s1,p0[1]*s0+p1[1]*s1,p0[2]*s0+p1[2]*s1];
};

var _crossProduct = function (a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0]
    ];
};

var nonParallelPt = function(pt){

         //based on randomNonParallelVector from openjscad

         // ## openjscad License
         // #https://github.com/joostn/openjscad/tree/gh-pages
         // Copyright (c) 2014 bebbi (elghatta@gmail.com)
         // Copyright (c) 2013 Eduard Bespalov (edwbes@gmail.com)
         // Copyright (c) 2012 Joost Nieuwenhuijse (joost@newhouse.nl)
         // Copyright (c) 2011 Evan Wallace (http://evanw.github.com/csg.js/)
         // Copyright (c) 2012 Alexandre Girard (https://github.com/alx)
         //
         // All code released under MIT license


        // randomNonParallelVector: function() {
        //     var abs = this.abs();
        //     if ((abs._x <= abs._y) && (abs._x <= abs._z)) {
        //         return CSG.Vector3D.Create(1, 0, 0);
        //     } else if ((abs._y <= abs._x) && (abs._y <= abs._z)) {
        //         return CSG.Vector3D.Create(0, 1, 0);
        //     } else {
        //         return CSG.Vector3D.Create(0, 0, 1);
        //     }
        // },

        //see also set of lines - autonormaldirection

        var abs = [Math.abs(pt[0]),Math.abs(pt[1]),Math.abs(pt[2])];
        if ((abs[0] <= abs[1]) && (abs[0] <= abs[2])) {
            return [1,0,0];
        } else if ((abs[1] <= abs[0]) && (abs[1] <= abs[2])) {
            return [0,1,0];
        } else {
            return [0,0,1];
        }
}

var _nplen = new Float32Array(1);
function normalizePt(pt){ //pt = [x,y,z];
    //var len = ptLength(pt);
    _nplen[0] = Math.sqrt(pt[0]*pt[0]+pt[1]*pt[1]+pt[2]*pt[2]);
    return [pt[0]/_nplen[0],pt[1]/_nplen[0],pt[2]/_nplen[0]];
}

function lineDirection(line){
    return normalizePt(ptDiff(line[1],line[0]));
}

var cone2Triangles = function(cone, sides,color, doAddEndCaps=true){

    var d = lineDirection(cone.line);
    var lineAxis0 = _crossProduct(nonParallelPt(d),d);
    var lineAxis1 = _crossProduct(lineAxis0,d);

    var steps = sides || 5;
    var circlePts0p=[];
    var circlePts1p=[];
    for(var i=0;i<steps;i++){
        var xy0=[
            Math.cos(2*Math.PI/steps*i)*cone.r0,
            Math.sin(2*Math.PI/steps*i)*cone.r0,
        ];
        var xy1=[
            Math.cos(2*Math.PI/steps*i)*cone.r1,
            Math.sin(2*Math.PI/steps*i)*cone.r1,
        ];

        circlePts0p.push(addPtsScaled(lineAxis0,lineAxis1,xy0[0],xy0[1]));
        circlePts1p.push(addPtsScaled(lineAxis0,lineAxis1,xy1[0],xy1[1]));
    }

    return circlePtsPair2Triangles(circlePts0p,circlePts1p,cone.line,  color, doAddEndCaps);
}

function circlePtsPair2Triangles(circlePts0, circlePts1, origLine, color, doAddEndCaps = true){
    var tris = [];
    circlePts0.forEach(function(circlePt,i){

        var c0 = [
            addPts(circlePts0[i],origLine[0]),
            addPts(circlePts0[(i+1)%circlePts0.length],origLine[0])
        ];

        var c1 = [
            addPts(circlePts1[i],origLine[1]),
            addPts(circlePts1[(i+1)%circlePts1.length],origLine[1])
        ];

        //add sides
        tris.push([c1[0],c0[1],c0[0]]);
        tris.push([c1[0],c1[1],c0[1]]);

        //end caps //TODO if there are 3 sides we only need 1 tri per endcap
        if(doAddEndCaps){
            // if(circlePts0.length==3){
            //     if(i==0){
            //         tris.push([origLine[0],c0[0],c0[1]]);
            //         tris.push([origLine[1],c1[1],c1[0]]);
            //     }
            // }else{
                tris.push([origLine[0],c0[0],c0[1]]);
                tris.push([origLine[1],c1[1],c1[0]]);
            //}
        }

        //TODO extend caps by radius?
    });
    return tris.map(function(tri){
        if(color){
            tri.color=color;
        }
        return tri;
    });
}

function cones2Triangles(cones){
    var res = [];
    cones.forEach(function(cone){
        res.push(...cone2Triangles(cone));
    });
    return res;
}

module.exports = {cone2Triangles, cones2Triangles};
