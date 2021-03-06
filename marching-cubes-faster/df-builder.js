var dfl = require('./df-list.js');
var dflr = require('./df-list-rtree.js');
var RTREE = require('rbush-3d');
var lu = require('./lines-utils-basic.js');
var bbp = require('./bb-pts.js')


function padSector(s,p){
    return [lu.addPts(s[0],[-p,-p,-p]),lu.addPts(s[1],[p,p,p])]
}

//TODO try build from set of linecones, bricks, triangles -- addline(existingRes), addtriangle func etc

//TODO build cloud with raycaster loop

//TODO squiggle random line demo

//TODO get rTreeObjList bounds...

function jitterPt(pt, s){ //2d jitter along x-z
    return [pt[0]+Math.random()*s-s/2,pt[1]+Math.random()*s-s/2,pt[2]+Math.random()*s-s/2];
}

function randomPt(){
    var S = 500;
    return [Math.random()*S-S/2,Math.random()*S-S/2,Math.random()*S-S/2];
}

function randomSector(){
    var center = randomPt();
    return bbp([
        jitterPt(center,31.0),
        jitterPt(center,31.0)
    ]);
}

var randomBrick = randomSector;

function randomTriangle(){
    var center = randomPt();
    return [
        jitterPt(center,31.0),
        jitterPt(center,31.0),
        jitterPt(center,31.0)
    ];
}

function randomTetrahedron(){
    var center = randomPt();
    return [
        jitterPt(center,31.0),
        jitterPt(center,31.0),
        jitterPt(center,31.0),
        jitterPt(center,31.0)
    ];
}

function randomLine(){
    var center = randomPt();
    return [
        jitterPt(center,31.0),
        jitterPt(center,31.0)
    ];
}

function randomLineCone(){
    var center = randomPt();
    return {
        line: [
            jitterPt(center,31.0),
            jitterPt(center,31.0)
        ],
        r0: Math.random()*8+0.1,
        r1: Math.random()*8+0.1,
    }
}

function randomColor(){
    return [
        Math.floor(Math.random()*1  ),
        Math.floor(Math.random()*1  ),
        Math.floor(Math.random()*1  )
    ]
}
function buildDfFromRTreeObjs(rTreeObjs){
    var numObjs = 1000;

    if(!rTreeObjs){
        rTreeObjs = [];

        for(var i=0;i<numObjs;i++){
            var S = randomSector();
            addBrick(S,randomColor(),rTreeObjs)
        }
    }

    var rtree = new RTREE.RBush3D(2);
    rtree.load(rTreeObjs);

    return {rTreeObjs, rtree};
}

function addBrick(existingList, sector, radius, doSubtract=false, color = null){
    var newObj = {
        i:existingList.length,
        df: dfl.dfForSector(sector, radius),
        op: doSubtract ? "sub" : "add",
        color: color,
        bounds: padSector(sector,radius),
        ...dflr.rTreeObjForSector(sector, radius)
    }
    if(existingList){existingList.push(newObj);}
    return existingList;
}

function subtractBrick(existingList, sector, radius, color ){
    return addBrick(existingList, sector, radius,true, color);
}

var bbp = require('./bb-pts.js');
//var bbb = require('./bb-bbs.js');



function addTriangle(existingList, triangle, radius, doSubtract=false, color = null){
    var newObj = {
        i:existingList.length,
        df: dfl.dfForTriangle(triangle, radius),
        op: doSubtract ? "sub" : "add",
        color: color,
        bounds: padSector(bbp(triangle),radius),
        ...dflr.rTreeObjForTriangle(triangle, radius)
    }
    if(existingList){existingList.push(newObj);}
    return existingList;
}

function subtractTriangle(existingList, triangle, radius, color){
    return addTriangle(existingList, triangle, radius, true, color);
}


function addTetra(existingList, tet, radius, doSubtract=false, color = null){
    var newObj = {
        i:existingList.length,
        df: dfl.dfForTetra(tet, radius),
        op: doSubtract ? "sub" : "add",
        color: color,
        bounds: padSector(bbp(tet),radius),
        ...dflr.rTreeObjForTetra(tet, radius)
    }
    if(existingList){existingList.push(newObj);}
    return existingList;
}

function subtractTetra(existingList, tet, radius, color){
    return addTetra(existingList, tet , radius,true, color);
}

function addLineCone(existingList, lc, doSubtract=false, color){
    var {line, r0, r1} = lc;

    var bbl = bbp(line);
    bbl[0]=lu.addPts(bbl[0],[-r0,-r0,-r0])
    bbl[1]=lu.addPts(bbl[1],[r1,r1,r1])

    var newObj = {
        i:existingList.length,
        df: dfl.dfForLineCone(lc),
        op: doSubtract ? "sub" : "add",
        color: color,
        bounds: bbl,
        ...dflr.rTreeObjForLineCone(lc)
    }
    if(existingList){existingList.push(newObj);}
    return existingList;
}

function subtractLineCone(existingList, lc, color ){
    return addLineCone(existingList, lc, true, color);
}

function addLine(existingList, line, radius, doSubtract, color ){
    addLineCone(existingList, {line, r0:radius, r1:radius}, doSubtract, color);
}

function subtractLine(existingList, line, radius, color ){
    addLineCone(existingList, {line, r0:radius, r1:radius}, true, color);
}

//TODO add/sub custom function...
//TODO add set-of-tris / indexed mesh

module.exports = {
    randomSector,randomBrick,
    randomTriangle,
    randomLineCone,
    randomLine,
    randomTetrahedron,
    addTetra,
    subtractTetra,
    addBrick,
    subtractBrick,
    addTriangle,
    subtractTriangle,
    addLineCone,
    subtractLineCone,
    addLine,
    subtractLine,
    buildDfFromRTreeObjs}