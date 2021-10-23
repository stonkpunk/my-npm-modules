
function hashBy1000(v){return Math.floor(v*1000);}

function addSectorToCoordBucket(sector, c_b){
    var s = sector;

    if(!c_b){
        c_b = {
            xlo: {},
            xhi: {},
            ylo: {},
            yhi: {},
            zlo: {},
            zhi: {}
        }
    }

    var xLoHash = hashBy1000(s[0][0]);
    var yLoHash = hashBy1000(s[0][1]);
    var zLoHash = hashBy1000(s[0][2]);
    var xHiHash = hashBy1000(s[1][0]);
    var yHiHash = hashBy1000(s[1][1]);
    var zHiHash = hashBy1000(s[1][2]);

    c_b.xlo[xLoHash] = c_b.xlo[xLoHash] || [];
    c_b.ylo[yLoHash] = c_b.ylo[yLoHash] || [];
    c_b.zlo[zLoHash] = c_b.zlo[zLoHash] || [];

    c_b.xhi[xHiHash] = c_b.xhi[xHiHash] || [];
    c_b.yhi[yHiHash] = c_b.yhi[yHiHash] || [];
    c_b.zhi[zHiHash] = c_b.zhi[zHiHash] || [];

    if(c_b.xlo[xLoHash].indexOf(s)==-1){c_b.xlo[xLoHash].push(sector);}
    if(c_b.ylo[yLoHash].indexOf(s)==-1){c_b.ylo[yLoHash].push(sector);}
    if(c_b.zlo[zLoHash].indexOf(s)==-1){c_b.zlo[zLoHash].push(sector);}

    if(c_b.xhi[xHiHash].indexOf(s)==-1){c_b.xhi[xHiHash].push(sector);}
    if(c_b.yhi[yHiHash].indexOf(s)==-1){c_b.yhi[yHiHash].push(sector);}
    if(c_b.zhi[zHiHash].indexOf(s)==-1){c_b.zhi[zHiHash].push(sector);}

    return c_b;
}

function removeSectorFromCoordBucket(sector, c_b){
    var s = sector;

    var xLoHash = hashBy1000(s[0][0]);
    var yLoHash = hashBy1000(s[0][1]);
    var zLoHash = hashBy1000(s[0][2]);
    var xHiHash = hashBy1000(s[1][0]);
    var yHiHash = hashBy1000(s[1][1]);
    var zHiHash = hashBy1000(s[1][2]);
    var arr;

    arr = c_b.xlo[xLoHash]; if(arr){arr.splice(arr.indexOf(s),1);}
    arr = c_b.ylo[yLoHash]; if(arr){arr.splice(arr.indexOf(s),1);}
    arr = c_b.zlo[zLoHash]; if(arr){arr.splice(arr.indexOf(s),1);}
    arr = c_b.xhi[xHiHash]; if(arr){arr.splice(arr.indexOf(s),1);}
    arr = c_b.yhi[yHiHash]; if(arr){arr.splice(arr.indexOf(s),1);}
    arr = c_b.zhi[zHiHash]; if(arr){arr.splice(arr.indexOf(s),1);}

    return c_b;
}

function sectorFirstMergeableNeighborViaCoordBuckets_aspectLimited(sector, c_b, aspectLimit){
    var s = sector;

    var res = null;
    var xLoHash = hashBy1000(s[0][0]);
    res = c_b.xhi[xLoHash] && c_b.xhi[xLoHash].find(function(_s){return sectorsCanMerge(s,_s, aspectLimit);});
    if(res)return res;

    var yLoHash = hashBy1000(s[0][1]);
    res = c_b.yhi[yLoHash] && c_b.yhi[yLoHash].find(function(_s){return sectorsCanMerge(s,_s, aspectLimit);});
    if(res)return res;

    var zLoHash = hashBy1000(s[0][2]);
    res = c_b.zhi[zLoHash] && c_b.zhi[zLoHash].find(function(_s){return sectorsCanMerge(s,_s, aspectLimit);});
    if(res)return res;

    var xHiHash = hashBy1000(s[1][0]);
    res = c_b.xlo[xHiHash] && c_b.xlo[xHiHash].find(function(_s){return sectorsCanMerge(s,_s, aspectLimit);});
    if(res)return res;

    var yHiHash = hashBy1000(s[1][1]);
    res = c_b.ylo[yHiHash] && c_b.ylo[yHiHash].find(function(_s){return sectorsCanMerge(s,_s, aspectLimit);});
    if(res)return res;

    var zHiHash = hashBy1000(s[1][2]);
    res = c_b.zlo[zHiHash] && c_b.zlo[zHiHash].find(function(_s){return sectorsCanMerge(s,_s, aspectLimit);});
    if(res)return res;

    return null;
};

function sectorAspect(sector){
    var s = sector;
    var sx = Math.abs(s[1][0]-s[0][0]);
    var sy = Math.abs(s[1][1]-s[0][1]);
    var sz = Math.abs(s[1][2]-s[0][2]);

    var minDim = Math.min.apply(null, [sx,sy,sz]);
    var maxDim = Math.max.apply(null, [sx,sy,sz]);

    if(minDim==0)minDim=0.0001;

    return maxDim/minDim;
}

function setSectorColors(sector, colorsMap){
    sector.colors = {
        xlo: colorsMap.xlo ? colorsMap.xlo : 0,
        xhi: colorsMap.xhi ? colorsMap.xhi : 0,
        ylo: colorsMap.ylo ? colorsMap.ylo : 0,
        yhi: colorsMap.yhi ? colorsMap.yhi : 0,
        zlo: colorsMap.zlo ? colorsMap.zlo : 0,
        zhi: colorsMap.zhi ? colorsMap.zhi : 0,
    };
    return sector;
}

var copySector = function(line){
    if(!line)return null;
    return [[line[0][0]+0,line[0][1]+0,line[0][2]+0],[line[1][0]+0,line[1][1]+0,line[1][2]+0]];
};

var copyBlock = copySector;
var cloneSector = copySector;

function sectorVolume_fast(s){ //assumes sector parts in correct order
    return (s[1][0]-s[0][0])*(s[1][1]-s[0][1])*(s[1][2]-s[0][2]);
}

//TODO array based version?
function sectorsCanMerge(s0, s1, aspectLimit){ //TODO include case where one sector encloses the other ?
    if(s0==s1)return false;
    var mergedSector = sectorIncludeSector(cloneSector(s0),s1);
    var volumeChange = sectorVolume_fast(s0)+sectorVolume_fast(s1)-sectorVolume_fast(mergedSector);
    var noVolumeChange = Math.abs(volumeChange)<0.00001;
    if(!noVolumeChange)return false;

    if(sectorAspect(mergedSector)>aspectLimit){
        return false;
    }

    return true;
}

//from https://github.com/pex-gl/pex-geom/blob/master/aabb.js
// Copyright (c) 2012-2014 Marcin Ignac
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
function sectorIsEmpty (aabb) {
    return (aabb[0][0] > aabb[1][0]) || (aabb[0][1] > aabb[1][1]) || (aabb[0][2] > aabb[1][2])
}

function sectorIncludeSector (sectorA, sectorB) {
    var a = cloneSector(sectorA);
    var b = cloneSector(sectorB);
    if (sectorIsEmpty(a)) {
        a = cloneSector(b);
    } else if (sectorIsEmpty(b)) {
        // do nothing
    } else {
        a[0][0] = Math.min(a[0][0], b[0][0]);
        a[0][1] = Math.min(a[0][1], b[0][1]);
        a[0][2] = Math.min(a[0][2], b[0][2]);
        a[1][0] = Math.max(a[1][0], b[1][0]);
        a[1][1] = Math.max(a[1][1], b[1][1]);
        a[1][2] = Math.max(a[1][2], b[1][2]);
    }

    if(sectorA.colors || sectorB.colors){
        a.colors = {};
        setSectorColors(sectorA,sectorA.colors || {});
        setSectorColors(sectorB,sectorB.colors || {});
        a.colors.xlo = sectorA[0][0] < sectorB[0][0] ? sectorA.colors.xlo : sectorB.colors.xlo;
        a.colors.xhi = sectorA[1][0] > sectorB[1][0] ? sectorA.colors.xhi : sectorB.colors.xhi;
        a.colors.ylo = sectorA[0][1] < sectorB[0][1] ? sectorA.colors.ylo : sectorB.colors.ylo;
        a.colors.yhi = sectorA[1][1] > sectorB[1][1] ? sectorA.colors.yhi : sectorB.colors.yhi;
        a.colors.zlo = sectorA[0][2] < sectorB[0][2] ? sectorA.colors.zlo : sectorB.colors.zlo;
        a.colors.zhi = sectorA[1][2] > sectorB[1][2] ? sectorA.colors.zhi : sectorB.colors.zhi;
    }

    return a;
}


function sectorsAttemptMerge_coordBuckets_aspectLimited(inscribedBlocks, c_b, aspectLimit){
    var didMerge = false;
    while(!didMerge){
        var candidate = null; //inscribedBlocks.find(function(b){return !b.noMoreMerges;});

        var i = inscribedBlocks.length;
        while(i--){
            if(!inscribedBlocks[i].noMoreMerges){
                candidate=inscribedBlocks[i];
                break;
            }
        }

        if(candidate){
            var toBeMergedBlock  = sectorFirstMergeableNeighborViaCoordBuckets_aspectLimited(candidate, c_b, aspectLimit);
            if(toBeMergedBlock){
                var mergedBlock = sectorIncludeSector(candidate, toBeMergedBlock);
                inscribedBlocks.splice(inscribedBlocks.indexOf(candidate), 1);
                inscribedBlocks.splice(inscribedBlocks.indexOf(toBeMergedBlock), 1);

                c_b = removeSectorFromCoordBucket(candidate, c_b);
                c_b = removeSectorFromCoordBucket(toBeMergedBlock, c_b);

                inscribedBlocks.push(mergedBlock);

                //inscribedBlocks = chance.shuffle(inscribedBlocks);

                addSectorToCoordBucket(mergedBlock, c_b);

                didMerge= true;
            }else{
                candidate.noMoreMerges=true;
                didMerge= false;
            }
        }else{
            break;
        }
    }
    return didMerge;
}

function sectorsMergeFull_coordBuckets_aspectLimited(sectors, aspectLimit){

    var coordBucket = null;

    for(var i=0; i<sectors.length; i++){
        var s = sectors[i];
        coordBucket = addSectorToCoordBucket(s, coordBucket);
    }

    //console.log("C_B", coordBucket);

    while(sectorsAttemptMerge_coordBuckets_aspectLimited(sectors, coordBucket, aspectLimit)){
        //console.log("merged ", sectors.length);
    }

    sectors.forEach(function(s){
        delete s.noMoreMerges;
    });
}

module.exports.mergeBoxes = sectorsMergeFull_coordBuckets_aspectLimited;
