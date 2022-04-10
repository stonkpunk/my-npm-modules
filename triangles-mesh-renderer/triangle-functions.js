//BASIC GEOM FUNCS:

//https://stackoverflow.com/questions/12219802/a-javascript-function-that-returns-the-x-y-points-of-intersection-between-two-ci
function intersectCircles(x0, y0, r0, x1, y1, r1) {
    var a, dx, dy, d, h, rx, ry;
    var x2, y2;

    /* dx and dy are the vertical and horizontal distances between
     * the circle centers.
     */
    dx = x1 - x0;
    dy = y1 - y0;

    /* Determine the straight-line distance between the centers. */
    d = Math.sqrt((dy*dy) + (dx*dx));

    /* Check for solvability. */
    if (d > (r0 + r1)) {
        /* no solution. circles do not intersect. */
        return false;
    }
    if (d < Math.abs(r0 - r1)) {
        /* no solution. one circle is contained in the other */
        return false;
    }

    /* 'point 2' is the point where the line through the circle
     * intersection points crosses the line between the circle
     * centers.
     */

    /* Determine the distance from point 0 to point 2. */
    a = ((r0*r0) - (r1*r1) + (d*d)) / (2.0 * d) ;

    /* Determine the coordinates of point 2. */
    x2 = x0 + (dx * a/d);
    y2 = y0 + (dy * a/d);

    /* Determine the distance from point 2 to either of the
     * intersection points.
     */
    h = Math.sqrt((r0*r0) - (a*a));

    /* Now determine the offsets of the intersection points from
     * point 2.
     */
    rx = -dy * (h/d);
    ry = dx * (h/d);

    /* Determine the absolute intersection points. */
    var xi = x2 + rx;
    var xi_prime = x2 - rx;
    var yi = y2 + ry;
    var yi_prime = y2 - ry;

    if(yi>yi_prime){
        return  [xi, yi,0];
    }else{
        return [xi_prime, yi_prime,0];
    }
}

//https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function _linesIntersect2d(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) {
    //var i_x, i_y;
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        //i_x = p0_x + (t * s1_x);
        //i_y = p0_y + (t * s1_y);
        return 1;
    }

    return 0; // No collision
}

function getLineIntersection(p0_x, p0_y, p1_x, p1_y, p2_x, p2_y, p3_x, p3_y) { var s1_x, s1_y, s2_x, s2_y; s1_x = p1_x - p0_x; s1_y = p1_y - p0_y; s2_x = p3_x - p2_x; s2_y = p3_y - p2_y; var s, t; s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y); t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) { // Collision detected
        var intX = p0_x + (t * s1_x); var intY = p0_y + (t * s1_y); return [intX, intY]; } return null; // No collision
}

function linesIntersect2d(l0, l1){
    return getLineIntersection(l0[0][0],l0[0][1], l0[1][0],l0[1][1], l1[0][0],l1[0][1], l1[1][0],l1[1][1]);
}

//TRIANGLES:

function ptIsInTriangle2D(s, a, b, c){ //https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
    /*
     bool intpoint_inside_trigon(intPoint s, intPoint a, intPoint b, intPoint c)
     {
     int as_x = s.x-a.x;
     int as_y = s.y-a.y;

     bool s_ab = (b.x-a.x)*as_y-(b.y-a.y)*as_x > 0;

     if((c.x-a.x)*as_y-(c.y-a.y)*as_x > 0 == s_ab) return false;

     if((c.x-b.x)*(s.y-b.y)-(c.y-b.y)*(s.x-b.x) > 0 != s_ab) return false;

     return true;
     }
     */

    var as_x = s[0]-a[0];
    var as_y = s[1]-a[1];

    var s_ab = (b[0]-a[0])*as_y-(b[1]-a[1])*as_x > 0;

    if((c[0]-a[0])*as_y-(c[1]-a[1])*as_x > 0 == s_ab) return false;

    if((c[0]-b[0])*(s[1]-b[1])-(c[1]-b[1])*(s[0]-b[0]) > 0 != s_ab) return false;

    return true;
}

var triangleContainsPt = function(pt, tri){
    return ptIsInTriangle2D(pt, tri[0], tri[1], tri[2]);
};

function triangleCenter(tri){
    return averagePts3Sop(tri);
}

function triangle2Sides(tri){
    return [
        [tri[0], tri[1]],
        [tri[0], tri[2]],
        [tri[1], tri[2]]
    ];
}

function triangle2SideMids(tri){
    return triangle2Sides(tri).map(lineMidPt);
}

function triangleLongestSideIndex(tri){
    var sideLens = triangle2SidesLengths(tri);
    if(sideLens[0] > sideLens[1]){ //might be 0 or 2
        if(sideLens[0] > sideLens[2]){
            return 0;
        }else{// cant be 0
            return 2;
        }
    }else{ //might be 1 or 2
        if(sideLens[1] > sideLens[2]){
            return 1;
        }else{// cant be 1
            return 2;
        }
    }
}

function triangle2SidesLengths(tri){
    return [
        [tri[0], tri[1]],
        [tri[0], tri[2]],
        [tri[1], tri[2]]
    ].map(lineLength);
}

function triangleLongestSideLength(tri){
    var sides = triangle2Sides(tri);
    return Math.max(lineLength(sides[0]), Math.max(lineLength(sides[1], lineLength(sides[2]))));
}

function triangle2SideVectors(tri){ //returns 3 pts not lines
    return [
        ptDiff( tri[1], tri[0]),
        ptDiff( tri[2], tri[0]),
        ptDiff( tri[1], tri[2])
    ];
}

function triangle2SideAngles(tri){
    return triangle2SideVectors(tri).map(function(sideVecPt){
        return Math.PI-pt2polarPt(sideVecPt,[0,0,0])[0];
    });
}

function triangleAlignSideToXAxisNegative(tri, _sideNo){ //align 2D triangle side to x axis, with tri center above x axis
    var sideNo = _sideNo || 0;
    var sides = triangle2Sides(tri);
    var triCenter = triangleCenter(tri);
    var mids = sides.map(lineMidPt);
    var sideAngles = triangle2SideAngles(tri);
    var rotatedTri = triangleRotated(tri, sideAngles[sideNo], triangleCenter(tri));

    var midPtForThisSide = mids[sideNo];

    var triCenterIsAboveXAxis = midPtForThisSide[1] < triCenter[1];

    if(triCenterIsAboveXAxis){
        return rotatedTri;
    }else{
        return triangleRotated(rotatedTri, Math.PI, triangleCenter(rotatedTri)); //flip 180 degrees
    }
}

function triangleAlignSideToXAxisPositive(tri, _sideNo){ //align 2D triangle side to x axis, with tri center above x axis
    var sideNo = _sideNo || 0;
    var sides = triangle2Sides(tri);
    var triCenter = triangleCenter(tri);
    var mids = sides.map(lineMidPt);
    var sideAngles = triangle2SideAngles(tri);
    var rotatedTri = triangleRotated(tri, sideAngles[sideNo], triangleCenter(tri));

    var midPtForThisSide = mids[sideNo];

    var triCenterIsAboveXAxis = midPtForThisSide[1] < triCenter[1];

    if(triCenterIsAboveXAxis){
        return triangleRotated(rotatedTri, Math.PI, triangleCenter(rotatedTri));
    }else{
        return rotatedTri;
    }
}

function triangleJoinWithTriangleBb(triA,triB){ //a on top b on bottom
    var A = triangleBoundingBlock(triA);
    var B = triangleBoundingBlock(triB);
    var dimsA = sectorDimensions(A);
    var dimsB = sectorDimensions(B);
    var mA = addPts(A[0], [dimsA[0]/2,0,0]); //join pt for A
    var mB = addPts(B[0], [dimsB[0]/2,dimsB[1],0]); //join pt for B
    var translation = ptDiff(mB, mA);
    var movedTriA = triA.map(function(pt){return addPts(pt, translation);});
    return [movedTriA, triB];
}

function flattenTriToZeroZ(tri){
    return ptsFlattenByIndex(tri,2);
}

function triangle2MeshRGB(tri){
    var group = new THREE.Group();
    var sides = triangle2Sides(tri);
    group.add(setOfLines2Mesh([sides[0]], 0xFF0000));
    group.add(setOfLines2Mesh([sides[1]], 0x00FF00));
    group.add(setOfLines2Mesh([sides[2]], 0x0000FF));
    return group;
}

function triangleCircumcenter(tri){
    var sidesLens = triangle2SidesLengths(tri);
    var a = sidesLens[2];
    var b = sidesLens[1];
    var c = sidesLens[0];

    var bsum = a*a*(b*b+c*c-a*a) + b*b*(a*a+c*c-b*b) + c*c*(a*a+b*b-c*c);

    var baryCoords = [
        a*a*(b*b+c*c-a*a)/bsum,
        b*b*(a*a+c*c-b*b)/bsum,
        c*c*(a*a+b*b-c*c)/bsum
    ];

    return triangleCartesianCoordsFromBarycentric(baryCoords, tri);
}

function triangle2CircumcenterSpokes(tri){
    var sides = triangle2Sides(tri);
    var mids = triangle2SideMids(tri);
    var center = triangleCircumcenter(tri);
    return mids.map(function(mid){
        return [center, mid];
    });
}

function triangle2SideNormals(tri){
    /* var centerSpokes = triangle2CircumcenterSpokes(tri);

     console.log("CENTER SPOKES", centerSpokes);

     var centerPt = triangleCenter(tri);
     var sideNormalLines = [];

     centerSpokes.forEach(function(centerSpoke){
        var lineFromMidPtToCenter = flippedLine(centerSpoke);
        var shortLine = [lineFromMidPtToCenter[0], getPointAlongLine(lineFromMidPtToCenter, 0.0001)];
        var shortLineBackwards = [lineFromMidPtToCenter[0], getPointAlongLine(lineFromMidPtToCenter, -0.0001)];
         if(linePointingTowardsPt(shortLine, centerPt)){
             sideNormalLines.push(normalizeLine(shortLineBackwards));
         }else{
             sideNormalLines.push(normalizeLine(shortLine));
         }
     });

     //^this is not reliable because circumcenter is often coincident with side midpt!
     */

    var centerPt = triangleCenter(tri);
    var mids = triangle2SideMids(tri);
    var normalVec = normalizeAndCenterLine(triangle2NormalLine(tri))[1];
    var _sideNormalVecs = triangle2SideVectors(tri).map(function(sideVecPt){
        return normalizePt(_crossProduct(sideVecPt, normalVec));
    });

    var sideNormalLines = mids.map(function(midPt,i){
        var theLine = [midPt, addPts(midPt, _sideNormalVecs[i])];
        if(linePointingTowardsPt(theLine, centerPt)){
            return [midPt, getPointAlongLine(theLine, -1)]
        }else{
            return theLine;
        }
    });

    return sideNormalLines;
}

function randomTriangleNormalized(s=1.0, center){ //randomptnormalized
    var A0n = normalizePt(randomPt(s));
    //var A1 = scalePt(A0n,-1);

    var B0 = randomPt(s)
    var B0n = normalizePt(_crossProduct(A0n, B0));

    var C = [0,0,0];

    var tri = [A0n,B0n,C];
    return triangleTranslated(triangleTranslated(tri,scalePt(triangleCenter(tri),-1)),center);
}


function triangleScaleFromCenter(tri,s){
    var c = triangleCenter(tri);
    return tri.map(pt=>addPts(ptDiffScaled(pt,c,s),c))
}

function triangleExpanded(tri, dist){ //expands triangle by pushing sides out in perpendicular directions -- should result in equilateral triangle for large values

    if(dist==0)return tri;

    var expandedSpokes = triangle2SideNormals(tri).map(function(line){
        return [getPointAlongLine(line, dist), getPointAlongLine(line, dist*2)];
    });
    var triSidePlanes = expandedSpokes.map(normalLine2PlaneObjNormalized);

    var triNormPlane = normalLine2PlaneObjNormalized(triangle2NormalLine(tri));

    var expandedPts = [
        intersectionPtOf3Planes(triSidePlanes[0], triSidePlanes[1], triNormPlane), //vert 0 shared by sides 0, 1
        intersectionPtOf3Planes(triSidePlanes[0], triSidePlanes[2], triNormPlane), //vert 1 shared by sides 0, 2
        intersectionPtOf3Planes(triSidePlanes[1], triSidePlanes[2], triNormPlane)  //vert 2 shared by sides 1, 2
    ];

    return expandedPts;
}

var triangleExpandLines = triangle2SideNormals

var triangle2BeamsMidSide = triangle2CircumcenterSpokes;

function trianglesIntersect2d(tri0,tri1){ //detect triangle collisions including if they include e/o
    var sides0 = triangle2Sides(tri0);
    var sides1 = triangle2Sides(tri1);

    var a = sides0[0]; //a
    var b = sides0[1]; //b
    var c = sides0[2]; //c

    var d = sides1[0]; //d
    var e = sides1[1]; //e
    var f = sides1[2]; //f

    //console.log("LINES?", a,b,c,d,e,f);

    if(
        linesIntersect2d(a, d) ||
        linesIntersect2d(a, e) ||
        linesIntersect2d(a, f) ||

        linesIntersect2d(b, d) ||
        linesIntersect2d(b, e) ||
        linesIntersect2d(b, f) ||

        linesIntersect2d(c, d) ||
        linesIntersect2d(c, e) ||
        linesIntersect2d(c, f)
    ){
        return true;
    }

    if(
        triangleContainsPt(tri0[0], tri1) ||
        triangleContainsPt(tri0[1], tri1) ||
        triangleContainsPt(tri0[2], tri1) ||

        triangleContainsPt(tri1[0], tri0) ||
        triangleContainsPt(tri1[1], tri0) ||
        triangleContainsPt(tri1[2], tri0)
    ){
        return true;
    }

    return false;
}

function triangleIntersectTris2d(tri, tris){
    for(var i=0;i<tris.length;i++){
        if(trianglesIntersect2d(tri,tris[i])){
            return true;
        }
    }
    return false;
}

function pt2polarPt(pt, origin){ //returns [angleRadiansFromXAxis, radius]
    var npt = ptDiff(pt,origin);

    return [
        Math.atan2(npt[1],npt[0]),
        lineLength([pt,origin])
    ]
}

function polarPt2Pt(polarPt, origin){
    return [
        Math.cos(polarPt[0])*polarPt[1]+origin[0],
        Math.sin(polarPt[0])*polarPt[1]+origin[1],
        0
    ];
}

function ptsRotateScale2d(pts, origin, scale, angle){

    var polarPts = pts.map(function(pt){return pt2polarPt(pt,origin);}).map(function(polarPt){return [polarPt[0],polarPt[1]*scale];});
    return polarPts.map(function(polarPt){
        return polarPt2Pt([polarPt[0]+angle,polarPt[1]], origin);
    });
}

function ptsRotate2d(pts, origin, angle){

    var polarPts = pts.map(function(pt){return pt2polarPt(pt,origin);});
    return polarPts.map(function(polarPt){
        return polarPt2Pt([polarPt[0]+angle,polarPt[1]], origin);
    });
}

function triangleRotated(tri,angle,center){
    return ptsRotate2d(tri, center || triangleCenter(tri), angle);
}

function triangleScaledRotated(tri,angle,scale,center){
    return ptsRotateScale2d(tri, center || triangleCenter(tri), scale,angle);
}

function trianglesPts(tris){
    var pts = [];
    tris.forEach(function(tri){pts.push(tri[0],tri[1],tri[2]);});
    return pts;
}

function triangles2Blocks(tris){
    return tris.map(boundingBlockOfPts);
}

function flatArr2Pts(flatArr){
    var pts=[];
    for(var i=0; i<flatArr.length; i+=3){
        pts.push([flatArr[i],flatArr[i+1],flatArr[i+2]]);
    }
    return pts;
}

function flatArrXY2Pts(flatArr){
    var pts=[];
    for(var i=0; i<flatArr.length; i+=2){
        pts.push([flatArr[i],flatArr[i+1],0]);
    }
    return pts;
}

function trianglesFromPts(pts){
    if(pts.length ==0 || pts.length%3!=0){
        console.log("pt length must be multiple of 3!");
    }

    var tris = [];
    for(var i=0; i<pts.length-2; i+=3){
        tris.push([pts[i], pts[i+1], pts[i+2]]);
    }
    return tris;
}

var points2Triangles = trianglesFromPts;
var pts2Triangles = trianglesFromPts;

function trianglesRotated(tris,angle,center){
    var pts = trianglesPts(tris);
    var ptsRotated = ptsRotate2d(pts, center, angle);
    return trianglesFromPts(ptsRotated);
}

function triangleRotateMinimizeBounds(tri, center){
    return trianglesRotateMinimizeBounds([tri], center || triangleCenter(tri))[0];
}

function trianglesRotateMinimizeBounds(tris, _center){
    var center = _center || [0,0,0];
    var pts = trianglesPts(tris);
    var ptsRotated=null;

    var minBoundingArea = 999999999;
    var angleStep = 2.0*Math.PI/360.0 * 4.0; //4 degree steps

    for(var angle=0; angle<Math.PI/2.0; angle+=angleStep){
        var rPts = ptsRotate2d(pts, center, angle);
        var bArea = ptBoundsAreaXY(rPts);
        if(bArea<minBoundingArea){
            minBoundingArea=bArea;
            ptsRotated = rPts;
        }
    }

    if(!ptsRotated)return null;

    return trianglesFromPts(ptsRotated);
}

function trianglesJoinedForMinimalBounds(tri0, tri1){
    var lowerTri = triangleAlignSideToXAxisNegative(triangleLayFlat(tri0),triangleLongestSideIndex(tri0));
    var upperTri = triangleAlignSideToXAxisPositive(triangleLayFlat(tri1),triangleLongestSideIndex(tri1));
    var trisJoined =  trianglesRotateMinimizeBounds(triangleJoinWithTriangleBb(upperTri, lowerTri));
    return trisJoined;
}

function ptBoundsAreaXY(pts){
    var bounds = triangleBoundingBlock(pts);
    var dims = sectorDimensions(bounds);
    return dims[0]*dims[1];
}

function triangleShiftToOrigin(_triPts3){
    var bounds3d = triangleBoundingBlock(_triPts3);
    return _triPts3.map(function(pt){return ptDiff(pt,bounds3d[0]);});
}

function triangle2Rect(_triPts3){
    var t = _triPts3; //triangleLayFlat(_triPts3);
    var bounds3d = triangleBoundingBlock(t);
    var boundsY = bounds3d[1][1]-bounds3d[0][1];
    var boundsX = bounds3d[1][0]-bounds3d[0][0];
    var rect= [[0,0,0],[boundsX,boundsY,0]]; //3d bounds should be aligned to x axis, z values zero
    return rect;
}

function triangleTranslated(tri, trans){
    return tri.map(function(pt){
        return translatePt(pt, trans);
    });
}

function triangleBoundingBlock(tri){
    return boundingBlockOfPts([tri[0],tri[1],tri[2]]);
}

var triangleBounds = triangleBoundingBlock;

function trianglesBounds(tris){
    return boundingBlockOfBlocks(tris.map(triangleBoundingBlock));
}

function triangleLayFlat(tri){ //lay 3d triangle down in 2d then fix winding

    return triangleLayFlatQuat(tri);
    /*
        var sides = triangle2Sides(tri);
        var _lenA = lineLength(sides[0]);
        var _lenB = lineLength(sides[1]);
        var _lenC = lineLength(sides[2]);

        var rPt0 = [0,0,0];
        var rPt1 = [_lenA,0,0];
        var rPt2 = intersectCircles(0,0,_lenB, _lenA,0,_lenC); //returns the intersection w the greater y value
        var flatTri = [rPt0, rPt1, rPt2];
        var vecs = triangle2SideVectors(flatTri);*/

    //https://stackoverflow.com/questions/9120032/determine-winding-of-a-2d-triangles-after-triangulation
    /*
     For a triangle A B C, you can find the winding by computing the cross product (B - A) x (C - A). For 2d tri's, with z=0, it will only have a z component.
     To give all the same winding, swap vertices C and B if this z component is negative.
     */
    /*
        var crossVec = _crossProduct(vecs[0], vecs[1]);

        if(crossVec[2]<0){
            console.log("warning FLIPPED TRI");
            return [rPt0, rPt2, rPt1];
        }else{
            return flatTri;
        }*/
}

function triangleLayFlatQuat(tri){
    var vFrom = normalizeAndCenterLine(triangle2NormalLine(tri))[1];
    var vTo = [0, 0, 1];
    var theQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3().fromArray(vFrom), new THREE.Vector3().fromArray(vTo));
    var triRotated = tri.map(function(pt){
        var vector = new THREE.Vector3().fromArray(pt);//console.log("VEC0", vector);
        vector.applyQuaternion( theQuat );//console.log("VEC1", vector);
        return [vector.x,vector.y,vector.z];
    });

    //console.log("TRI ROTATTED", vFrom, vTo, theQuat, triRotated);

    return triangleTranslated(triRotated, ptDiff([0,0,0], triangleCenter(triRotated)));
}

function invertPt(pt){
    return [-pt[0], -pt[1], -pt[2]];
}

function trianglesJoinedBySides(tri0, tri1, sideNo0, sideNo1){ //assuming tri0 tri1 already flat

    var sidePerpLines0 = triangleExpandLines(tri0);
    var sidePerpLines1 = triangleExpandLines(tri1);

    var side0Mids = triangle2SideMids(tri0);

    var vFrom = normalizeAndCenterLine(sidePerpLines1[sideNo1])[1];
    var vTo = invertPt(normalizeAndCenterLine(sidePerpLines0[sideNo0])[1]);

    var theQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3().fromArray(vFrom), new THREE.Vector3().fromArray(vTo));

    //console.log("INCOMING TRIs", tri0, tri1);
    //console.log("areas", triangleArea(tri0), triangleArea(tri1));
    // console.log("expand lines", sidePerpLines0, sidePerpLines1);
    //console.log("expand lens", sidePerpLines0.map(lineLength), sidePerpLines1.map(lineLength));
    // console.log("TRI BEFORE QUAT0", sidePerpLines0[sideNo0], normalizeAndCenterLine(sidePerpLines0[sideNo0]));
    // console.log("TRI BEFORE QUAT1", tri1, vFrom, vTo);

    var tri1Rotated = tri1.map(function(pt){
        var vector = new THREE.Vector3().fromArray(pt);
        vector.applyQuaternion( theQuat );
        return [vector.x,vector.y,vector.z];
    });

    var side1Mids = triangle2SideMids(tri1Rotated);

    //console.log("TRI BEFORE TRANS", tri1Rotated);

    var tri1Translated = triangleTranslated(tri1Rotated, ptDiff(side0Mids[sideNo0], side1Mids[sideNo1]))

    //console.log("PERP LINES", sidePerpLines0, sidePerpLines1, theQuat, side0Mids, side1Mids, tri1Rotated, tri1Translated);

    return [tri0, tri1Translated];

    /*

    var sideAngles0 = triangle2SideAngles(tri0);
    var sideAngles1 = triangle2SideAngles(tri1);
    var sides0 = triangle2Sides(tri0);
    var angleErr = sideAngles1[sideNo1] - sideAngles0[sideNo0];
    var t1c = triangleCenter(tri1);
    var tri1Transformed = triangleRotated(tri1, angleErr, t1c);
    var sides1 = triangle2Sides(tri1Transformed);
    var translation = ptDiff(lineMidPt(sides0[sideNo0]), lineMidPt(sides1[sideNo1]));
    var tri1Candidate = triangleTranslated(tri1Transformed, translation);

    if(trianglesIntersect2d(triangleExpanded(tri0, -0.1), triangleExpanded(tri1Candidate, -0.1))){
        tri1Transformed = triangleRotated(tri1, angleErr+Math.PI, t1c);
        sides1 = triangle2Sides(tri1Transformed);
        translation = ptDiff(lineMidPt(sides0[sideNo0]), lineMidPt(sides1[sideNo1]));
        tri1Candidate = triangleTranslated(tri1Transformed, translation);
    }

    return [tri0, tri1Candidate];*/
}

function triangleRadius(tri){
    var center = triangleCenter(tri);
    return Math.max(
        Math.max(
            lineLength([tri[0], center]), lineLength([tri[1], center])),
        lineLength([tri[2], center]));
}

function triangleTriangleDist(tri0,tri1){
    var minDist = 99999999;
    var sides0 = triangle2Sides(tri0);
    var sides1 = triangle2Sides(tri1);
    for(var i=0;i<sides0.length;i++){
        for(var j=0;j<sides1.length;j++){
            minDist=Math.min(minDist, lineLength(lineLineClosestPtsLine(sides0[i],sides1[j])));
        }
    }

    minDist = Math.min(minDist, triangleDFuncTurbo(tri0[0], tri1[0], tri1[1], tri1[2]));
    minDist = Math.min(minDist, triangleDFuncTurbo(tri0[1], tri1[0], tri1[1], tri1[2]));
    minDist = Math.min(minDist, triangleDFuncTurbo(tri0[2], tri1[0], tri1[1], tri1[2]));

    minDist = Math.min(minDist, triangleDFuncTurbo(tri1[0], tri0[0], tri0[1], tri0[2]));
    minDist = Math.min(minDist, triangleDFuncTurbo(tri1[1], tri0[0], tri0[1], tri0[2]));
    minDist = Math.min(minDist, triangleDFuncTurbo(tri1[2], tri0[0], tri0[1], tri0[2]));

    return minDist;
}