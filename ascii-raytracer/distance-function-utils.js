
var Vector = require('./Vector.js');

var eps=0.0001;

function clamp1(x){return x < 0.0 ? 0.0 : x > 1.0 ? 1.0 : x;} //see https://jsperf.com/clamp-functions/7

function fNormalUnitLinePtTurbo_old(f1){
    return function(x,y,z){
        var dx = f1(x+eps,y  ,z  )-f1(x-eps,y  ,z  );
        var dy = f1(x  ,y+eps,z  )-f1(x  ,y-eps,z  );
        var dz = f1(x  ,y  ,z+eps)-f1(x  ,y  ,z-eps);
        var dlen = Math.sqrt(dx*dx+dy*dy+dz*dz);
        //if(dlen<0.01)return scaledRandomLine(0.10); //on a proper nonzero dfunc this shouldnt ever happen
        return [dx/dlen,dy/dlen,dz/dlen];
    };
}

function fNormalUnitLinePtTurbo_alt(f1){

    //based on https://github.com/nicoptere/raymarching-for-THREE/blob/master/glsl/fragment.glsl
    //in turn from https://github.com/stackgl/glsl-sdf-normal -- mit license

    return function(x,y,z){
        var dv1 = f1(x+eps,y-eps,z-eps);
        var dv2 = f1(x-eps,y-eps,z+eps);
        var dv3 = f1(x-eps,y+eps,z-eps);
        var dv4 = f1(x+eps,y+eps,z+eps);
        var vecSum = [
            dv1-dv2-dv3+dv4,
            -dv1-dv2+dv3+dv4,
            -dv1+dv2-dv3+dv4];
        var dlen = Math.sqrt(vecSum[0]*vecSum[0]+vecSum[1]*vecSum[1]+vecSum[2]*vecSum[2]);

        return [vecSum[0]/dlen,vecSum[1]/dlen,vecSum[2]/dlen];
    };
}


var lastIntPt = null;
var lastIntV = null;
var lastIntDist = 9999;
function projectLineByDF(r, df, boundingRad){ //aka dfRayTrace //see also lineDFcrossingPts

    var shiftVector = {x: 0, y: 0, z: 0};

    /*if(df.bb){//bounding box
        var intDist = intersectRaySector(r.point,r.vector,df.bb);
        if(intDist==_NOHIT)return Infinity;
        //shift ray up to intersection pt (or slightly before...)
        //shiftVector = r.vector scaled up to intDist
        shiftVector = Vector.scale(Vector.unitVector(r.vector),intDist);
    }*/

    var ray = {point: {x:r.point.x+shiftVector.x, y:r.point.y+shiftVector.y, z:r.point.z+shiftVector.z}, vector: {x:r.vector.x, y:r.vector.y, z:r.vector.z}};
    var pt0 = {x:r.point.x, y:r.point.y, z:r.point.z};
    var rayUnit = Vector.unitVector(ray.vector);

    var dx,dy,dz,s;
    var PIXEL_WIDTH = 0.05*1.5; //minimum feature size

    for(var i=0; i<256;i++){

        var dfv = df(ray.point.x,ray.point.y,ray.point.z);

        if(dfv<PIXEL_WIDTH){
            lastIntV=dfv;
            lastIntPt=ray.point;
            dx = pt0.x-ray.point.x;
            dy = pt0.y-ray.point.y;
            dz = pt0.z-ray.point.z;
            lastIntDist = Math.sqrt(dx*dx+dy*dy+dz*dz)
            return lastIntDist; //ray length to reach df
        }else{
            if(dfv<1.0){
                s=dfv*0.5;
                ray.point={x: ray.point.x+rayUnit.x*s, y: ray.point.y+rayUnit.y*s, z: ray.point.z+rayUnit.z*s};
                //ray.point=Vector.add(ray.point,Vector.scale(rayUnit, dfv*0.25));
            }else{
                s=dfv*0.90;
                ray.point={x: ray.point.x+rayUnit.x*s, y: ray.point.y+rayUnit.y*s, z: ray.point.z+rayUnit.z*s};
                //ray.point=Vector.add(ray.point,Vector.scale(rayUnit, dfv-1.0));
            }
        }
    }
    lastIntDist=9999;
    lastIntV=null;
    lastIntPt=null;
    return Infinity;
};



function traceNormal(ray,SCENE_DF,SCENE_DF_NORMAL,TRACE_FUNC) {
    var intersectionDist = TRACE_FUNC ? TRACE_FUNC(ray, lastIntPt) : projectLineByDF(ray, SCENE_DF);
    lastIntDist=intersectionDist;
    if(TRACE_FUNC){
        lastIntPt = Vector.add(Vector.scale(Vector.unitVector(ray.vector), intersectionDist),ray.point);
    }
    if (intersectionDist > 9000 ) {return Vector.ZERO;}
    var norm = SCENE_DF_NORMAL(lastIntPt.x,lastIntPt.y,lastIntPt.z); //last df val is stored in lastIntV
    return {x: clamp1(norm[0]), y: clamp1(norm[1]), z: clamp1(norm[2])};
}

//from https://github.com/nicoptere/raymarching-for-THREE -- https://www.shadertoy.com/view/Xds3zN -- mit license
//use lastIntPt
function calcAO(  pos , SCENE_DF, SCENE_DF_NORMAL){
    var nor0 = SCENE_DF_NORMAL(pos[0],pos[1],pos[2]);
    var nor = [clamp1(nor0[0]), clamp1(nor0[1]), clamp1(nor0[2])];
    var occ = 0.0;
    var sca = 1.0;
    var ambienOcclusionSteps = 3.0;
    for( var i=0; i<ambienOcclusionSteps; i++ )
    {
        var hr = 0.055 + 0.43*i/( ambienOcclusionSteps ); //TODO too many magic numbers here!
        //vec3 aopos =  nor * hr + pos;
        var aopos = [nor[0]*hr+pos[0],nor[1]*hr+pos[1],nor[2]*hr+pos[2]];
        var dd = SCENE_DF( aopos[0],aopos[1],aopos[2] );
        occ += -(dd-hr)*sca;
        sca *= 0.95;
    }
    return clamp1( 1.0 - 3.0*occ, 0.0, 1.0 );
}


var lineLength = function(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function hardShadow(pos, lightPt, SCENE_DF){
    var copyPt = [pos.x,pos.y,pos.z];
    var rayTowardsLight = { //ray FROM light towards last int pt
        point: lightPt,
        vector: Vector.unitVector(Vector.subtract(pos, lightPt))
    };

    var intersectionDist = projectLineByDF(rayTowardsLight, SCENE_DF);
    if(lastIntPt){
        if (lineLength([copyPt, [lastIntPt.x,lastIntPt.y,lastIntPt.z]])<1.0){
            return false;
        }
    }
    return true;
}

/*

//from https://github.com/nicoptere/raymarching-for-THREE -- https://www.shadertoy.com/view/Xds3zN -- mit license
float softshadow( in vec3 ro, in vec3 rd, in float mint, in float tmax, in float K )
{
	float res = 1.0;
    float t = mint;
    for( int i=0; i<shadowSteps; i++ )
    {
		float h = field( ro + rd*t ).x;
        res = min( res, K * h/t );
        t += clamp( h, 0.02, 0.10 );
        if( h<0.001 || t>tmax ) break;
    }
    return clamp( res, 0.0, 1.0 );
}
 */

function getLastIntPt(){
    return lastIntPt;
}

function getLastIntDist(){
    return lastIntDist;
}


var RTREE = require('rbush-3d');
//const {BBox} = require("rbush-3d");


function sectorsDistFast(sectors, radius){
    var sectorsRTree = sectors2RTree(sectors);//console.log("TRI RTREE?", trisRTree);
    var s = radius;
    return function(x,y,z){
        var potentialSectors = sectorsRTree.search(sector2RTreeObj([[x,y,z],[x,y,z]],s)).map(s=>s.sector);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);
        return sectorStackDistFast(potentialSectors,x,y,z);
    }
}

function sectors2RTree(sos) {
    if (!RTREE) console.log("RTREE library not found! import rtree.js");
    var theTree = new RTREE.RBush3D(2); //Higher value means faster insertion and slower search, and vice versa.
    theTree.clear();
    var sectorBoxes = sos.map(function (sector) {
        return sector2RTreeObj(sector, 0.0001);
    });
    theTree.load(sectorBoxes);
    return theTree;

    //rtree.js
    //intersectOp = theTree.raycast(rndPt[0],rndPt[1],rndPt[2],theDir[0],theDir[1],theDir[2],2000);
    //if(intersectOp && intersectOp.dist < Infinity)

    //var nearbyLines = theTree.search(sector2RTreeObj(pt2Sector(candidates[0],1.0),neighborRad)).map(box => box.origLine);
}

function sector2RTreeObj(sector,_rad){
    var rad = _rad || 0.0001;
    const item = {
        minX: sector[0][0]-rad,
        minY: sector[0][1]-rad,
        minZ: sector[0][2]-rad,
        maxX: sector[1][0]+rad,
        maxY: sector[1][1]+rad,
        maxZ: sector[1][2]+rad,
        sector: sector
    };
    return item;
}


function sectorStackDistFast(sectors, x,y,z){
    var i = sectors.length;
    var d = 99999999;
    var s = null;
    while(i--){
        s = sectors[i];
        d = Math.min(d, //"union" operation
            Math.max(Math.max( //intersection of 3 planes offset by half-size per coord
                Math.abs(x-(s[1][0]+s[0][0])/2.0)-(s[1][0]-s[0][0])/2.0,
                Math.abs(y-(s[1][1]+s[0][1])/2.0)-(s[1][1]-s[0][1])/2.0),
                Math.abs(z-(s[1][2]+s[0][2])/2.0)-(s[1][2]-s[0][2])/2.0
        ));
    }
    return d;
}


function triangleBoundingBlock(tri){
    return boundingBlockOfPts([tri[0],tri[1],tri[2]]);
}

function boundingBlockOfPts(sop){
    //var eps = 0.001;
    var bb = [sop[0],sop[0]];

    for(var i=0; i<sop.length;i++){
        var p = sop[i];
        var xLo = Math.min(Math.min(p[0],bb[0][0]), Math.min(p[0],bb[0][0]));
        var xHi = Math.max(Math.max(p[0],bb[1][0]), Math.max(p[0],bb[1][0]));
        var yLo = Math.min(Math.min(p[1],bb[0][1]), Math.min(p[1],bb[0][1]));
        var yHi = Math.max(Math.max(p[1],bb[1][1]), Math.max(p[1],bb[1][1]));
        var zLo = Math.min(Math.min(p[2],bb[0][2]), Math.min(p[2],bb[0][2]));
        var zHi = Math.max(Math.max(p[2],bb[1][2]), Math.max(p[2],bb[1][2]));
        bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
    }

    return bb;
};

function triangle2RTreeObj(triangle, _rad){
    var rad = _rad || 0.0;
    var sector = triangleBoundingBlock(triangle);
    const item = {
        minX: sector[0][0]-rad,
        minY: sector[0][1]-rad,
        minZ: sector[0][2]-rad,
        maxX: sector[1][0]+rad,
        maxY: sector[1][1]+rad,
        maxZ: sector[1][2]+rad,
        triangle: triangle
    };
    return item;
}

var triangleDistance = require('triangle-distance').triangleDistance_arr;

function triangles2RTree(tris){
    if(!RTREE)console.log("RTREE library not found! import rtree.js");
    var theTree = new RTREE.RBush3D(2);
    theTree.clear();
    var triangles = tris;//threeGeom2TrianglesArrs(geom);
    var triangleBoxes = triangles.map(t=>triangle2RTreeObj(t, 0.0));
    theTree.load(triangleBoxes);
    return theTree;
}

function sectorDistFast(s,x,y,z){
    return Math.max(Math.max(  //intersection of 3 planes offset by half-size per coord
        Math.abs(x-(s[1][0]+s[0][0])/2.0)-(s[1][0]-s[0][0])/2.0,
        Math.abs(y-(s[1][1]+s[0][1])/2.0)-(s[1][1]-s[0][1])/2.0),
        Math.abs(z-(s[1][2]+s[0][2])/2.0)-(s[1][2]-s[0][2])/2.0
    );
}

function trianglesDistFast(tris, radius){
    var trianglesRTree = triangles2RTree(tris);//console.log("TRI RTREE?", trisRTree);
    var s = radius;
    return function(x,y,z){
        var potentialTris = trianglesRTree.search(sector2RTreeObj([[x,y,z],[x,y,z]],s)).map(s=>s.triangle);//(x,y,z,ndir[0],ndir[1],ndir[2],1000);//.map(o=>o.triangle);
        if(potentialTris.length>0){
            var dist = 9999+Math.random();
            var triDists = potentialTris.map(t=>triangleDistance([x,y,z],t));
            //return Math.min(...triDists);
            for(var i=0;i<triDists.length;i++){
                dist = Math.min(dist,triDists[i]);
            }
            return dist;
        }

        return 9999+Math.random();
    }
}



module.exports = {sectorsDistFast, trianglesDistFast, hardShadow, traceNormal, calcAO, fNormalUnitLinePtTurbo_old, fNormalUnitLinePtTurbo_alt, projectLineByDF, getLastIntPt,getLastIntDist, lastIntPt, lastIntV, lastIntDist};