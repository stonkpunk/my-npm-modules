//ported to js by stonkpunk, see orig glsl by Erich Loftis https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/shaders/BVH_Animated_Model_Fragment.glsl

var aabb_array = [];
var stackLevels = new Array(28).fill([0,0]);

function GetBoxNodeData(i) {
    var ix2 = i*8;
    var boxNodeData0 = [aabb_array[ix2], aabb_array[ix2+1], aabb_array[ix2+2], aabb_array[ix2+3]];
    var boxNodeData1 = [aabb_array[ix2+4], aabb_array[ix2+5], aabb_array[ix2+6], aabb_array[ix2+7]];
    return {boxNodeData0, boxNodeData1}
}

function ptDiff(a,b){
    return [a[0]-b[0],a[1]-b[1],a[2]-b[2]]
}

function ptScaleByPt(a,s){
    return [a[0]*s[0],a[1]*s[1],a[2]*s[2]]
}

function ptMin(a,b){
    return [
        Math.min(a[0],b[0]),
        Math.min(a[1],b[1]),
        Math.min(a[2],b[2])
    ]
}

function ptMax(a,b){
    return [
        Math.max(a[0],b[0]),
        Math.max(a[1],b[1]),
        Math.max(a[2],b[2])
    ]
}

var _NOHIT=-9999;
var _IRSf = new Float32Array(8);
function intersectRaySector(rpos, rdir, sector){//https://gamedev.stackexchange.com/questions/18436/most-efficient-aabb-vs-ray-collision-algorithms
    _IRSf[0] = (sector[0][0] - rpos[0])/rdir[0];
    _IRSf[1] = (sector[1][0] - rpos[0])/rdir[0];
    _IRSf[2] = (sector[0][1] - rpos[1])/rdir[1];
    _IRSf[3] = (sector[1][1] - rpos[1])/rdir[1];
    _IRSf[4] = (sector[0][2] - rpos[2])/rdir[2];
    _IRSf[5] = (sector[1][2] - rpos[2])/rdir[2];
    _IRSf[6] = Math.max(Math.max(Math.min(_IRSf[0], _IRSf[1]), Math.min(_IRSf[2], _IRSf[3])), Math.min(_IRSf[4], _IRSf[5]));
    _IRSf[7] = Math.min(Math.min(Math.max(_IRSf[0], _IRSf[1]), Math.max(_IRSf[2], _IRSf[3])), Math.max(_IRSf[4], _IRSf[5]));
    return (_IRSf[7] < 0 || _IRSf[6] > _IRSf[7]) ? _NOHIT : _IRSf[6];
}

// float BoundingBoxIntersect( vec3 minCorner, vec3 maxCorner, vec3 rayOrigin, vec3 invDir )
// //--------------------------------------------------------------------------------------
// {
//     vec3 near = (minCorner - rayOrigin) * invDir;
//     vec3 far  = (maxCorner - rayOrigin) * invDir;
//
//     vec3 tmin = min(near, far);
//     vec3 tmax = max(near, far);
//
//     float t0 = max( max(tmin.x, tmin.y), tmin.z);
//     float t1 = min( min(tmax.x, tmax.y), tmax.z);
//
//     //return t1 >= max(t0, 0.0) ? t0 : INFINITY;
//     return max(t0, 0.0) > t1 ? INFINITY : t0;
// }

function BoundingBoxIntersect( minCorner, maxCorner, rayOrigin, invDir ) {
   var near = ptScaleByPt(ptDiff(minCorner, rayOrigin),invDir)//(minCorner - rayOrigin) * invDir;
   var far  = ptScaleByPt(ptDiff(maxCorner, rayOrigin),invDir)//(maxCorner - rayOrigin) * invDir;
   var tmin = ptMin(near, far);
   var tmax = ptMax(near, far);

   var t0 = Math.max( Math.max(tmin[0], tmin[1]), tmin[2]);
   var t1 = Math.min( Math.min(tmax[0], tmax[1]), tmax[2]);
   return Math.max(t0, 0.0) > t1  ? 9999: t0;
}

function BoundingBoxDistance(minCorner, maxCorner, rayOrigin){
    var s = [minCorner, maxCorner];
    var x = rayOrigin[0];
    var y = rayOrigin[1];
    var z = rayOrigin[2];
    return Math.max(Math.max(  //intersection of 3 planes offset by half-size per coord
            Math.abs(x-(s[1][0]+s[0][0])/2.0)-(s[1][0]-s[0][0])/2.0,
            Math.abs(y-(s[1][1]+s[0][1])/2.0)-(s[1][1]-s[0][1])/2.0),
        Math.abs(z-(s[1][2]+s[0][2])/2.0)-(s[1][2]-s[0][2])/2.0
    );
}

function BoundingBoxDistanceUnsigned(minCorner, maxCorner, rayOrigin){ //normals dont render well using this ...
    return Math.abs(BoundingBoxDistance(minCorner, maxCorner, rayOrigin));
}

function BoundingBoxIntersect( minCorner, maxCorner, rayOrigin, invDir ) {
    var near = ptScaleByPt(ptDiff(minCorner, rayOrigin),invDir)//(minCorner - rayOrigin) * invDir;
    var far  = ptScaleByPt(ptDiff(maxCorner, rayOrigin),invDir)//(maxCorner - rayOrigin) * invDir;
    var tmin = ptMin(near, far);
    var tmax = ptMax(near, far);

    var t0 = Math.max( Math.max(tmin[0], tmin[1]), tmin[2]);
    var t1 = Math.min( Math.min(tmax[0], tmax[1]), tmax[2]);
    return Math.max(t0, 0.0) > t1  ? 9999: t0;
}

function SceneDistance( rayOrigin, _aabb_array){

    if(_aabb_array){
        aabb_array = _aabb_array;
    }

    var currentBoxNodeData0 = [], nodeAData0 = [], nodeBData0 = [], tmpNodeData0;
    var currentBoxNodeData1 = [], nodeAData1 = [], nodeBData1 = [], tmpNodeData1;

    var currentStackData, stackDataA, stackDataB, tmpStackData;

    var t = 9999;
    var stackptr = 0.0;

    var bnd = GetBoxNodeData(stackptr);
    currentBoxNodeData0 = bnd.boxNodeData0;
    currentBoxNodeData1 = bnd.boxNodeData1;

    var intersectResult = BoundingBoxDistance(
        [currentBoxNodeData0[1],currentBoxNodeData0[2],currentBoxNodeData0[3]],
        [currentBoxNodeData1[1],currentBoxNodeData1[2],currentBoxNodeData1[3]],
        rayOrigin);

    currentStackData = [stackptr, intersectResult];
    stackLevels[0] = currentStackData;
    var skip = (currentStackData[1] < t);

    while (true) {
        if (!skip) {
            // decrease pointer by 1 (0.0 is root level, 27.0 is maximum depth)
            if (--stackptr < 0.0) // went past the root level, terminate loop
                break;
            currentStackData = stackLevels[Math.floor(stackptr)];
            if (currentStackData[1] >= t){
                continue;
            }
            //GetBoxNodeData(currentStackData[0], currentBoxNodeData0, currentBoxNodeData1);
            var _bnd = GetBoxNodeData(currentStackData[0]);//, currentBoxNodeData0, currentBoxNodeData1);
            currentBoxNodeData0 = _bnd.boxNodeData0;
            currentBoxNodeData1 = _bnd.boxNodeData1;
        }
        skip = false; // reset skip
        if (currentBoxNodeData0[0] < 0.0){ // < 0.0 signifies an inner node [idTriangle<0]
            var _bnd = GetBoxNodeData(currentStackData[0] + 1.0);//, currentBoxNodeData0, currentBoxNodeData1);
            nodeAData0 = _bnd.boxNodeData0;
            nodeAData1 = _bnd.boxNodeData1;
            _bnd = GetBoxNodeData(currentBoxNodeData1[0]);//, currentBoxNodeData0, currentBoxNodeData1);
            nodeBData0 = _bnd.boxNodeData0;
            nodeBData1 = _bnd.boxNodeData1;
            stackDataA = [currentStackData[0] + 1.0, BoundingBoxDistance([nodeAData0[1],nodeAData0[2],nodeAData0[3]], [nodeAData1[1],nodeAData1[2],nodeAData1[3]], rayOrigin)];
            stackDataB = [currentBoxNodeData1[0], BoundingBoxDistance([nodeBData0[1],nodeBData0[2],nodeBData0[3]], [nodeBData1[1],nodeBData1[2],nodeBData1[3]], rayOrigin)];
            // first sort the branch node data so that 'a' is the smallest
            if (stackDataB[1] < stackDataA[1]) {
                tmpStackData = stackDataB;
                stackDataB = stackDataA;
                stackDataA = tmpStackData;
                tmpNodeData0 = nodeBData0;   tmpNodeData1 = nodeBData1;
                nodeBData0   = nodeAData0;   nodeBData1   = nodeAData1;
                nodeAData0   = tmpNodeData0; nodeAData1   = tmpNodeData1;
            } // branch 'b' now has the larger rayT value of 'a' and 'b'
            if (stackDataB[1] < t){ // see if branch 'b' (the larger rayT) needs to be processed
                currentStackData = stackDataB;
                currentBoxNodeData0 = nodeBData0;
                currentBoxNodeData1 = nodeBData1;
                skip = true; // this will prevent the stackptr from decreasing by 1
            }
            if (stackDataA[1] < t){ // see if branch 'a' (the smaller rayT) needs to be processed
                if (skip) // if larger branch 'b' needed to be processed also,
                    stackLevels[Math.floor(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
                // also, increase pointer by 1
                currentStackData = stackDataA;
                currentBoxNodeData0 = nodeAData0;
                currentBoxNodeData1 = nodeAData1;
                skip = true; // this will prevent the stackptr from decreasing by 1
            }
            // t = Math.min(stackDataA[1],stackDataB[1]);
            continue;
        } // end if (currentBoxNodeData0.x < 0.0) // inner node
//
        // var bnd = GetBoxNodeData(stackptr);//, currentBoxNodeData0, currentBoxNodeData1);
        // currentBoxNodeData0 = bnd.boxNodeData0;
        // currentBoxNodeData1 = bnd.boxNodeData1;
        var d = BoundingBoxDistance(
            [currentBoxNodeData0[1],currentBoxNodeData0[2],currentBoxNodeData0[3]],
            [currentBoxNodeData1[1],currentBoxNodeData1[2],currentBoxNodeData1[3]],
            rayOrigin);

        if (d < t) {
            t = d;
        }


//         // else this is a leaf
//
//         // each triangle's data is encoded in 8 rgba(or xyzw) texture slots
        //var id = 8.0 * currentBoxNodeData0.x;
//
//         //vd0 etc is triangle data would be fetched form texture
//         d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rayOrigin, rayDirection, tu, tv );
//
//         if (d < t)
//         {
//             t = d;
//             triangleID = id;
//             triangleU = tu;
//             triangleV = tv;
//             triangleLookupNeeded = true;
//         }
//
    } // end while (true)
//
    return t;
//
}

function SceneIntersect( rayOrigin, rayDirection, _aabb_array){

        // stackLevels.forEach(function(sl){
        //     sl[0]=0;
        //     sl[1]=0;
        // })

        if(_aabb_array){
            aabb_array = _aabb_array;
        }

       var currentBoxNodeData0 = [], nodeAData0 = [], nodeBData0 = [], tmpNodeData0;
       var currentBoxNodeData1 = [], nodeAData1 = [], nodeBData1 = [], tmpNodeData1;

       // var  vec4, vd0, vd1, vd2, vd3, vd4, vd5, vd6, vd7;

       var inverseDir = [1.0/rayDirection[0],1.0/rayDirection[1],1.0/rayDirection[2]];
       // var inverseDir2 = rayDirection;
       // var normal, hitPos, toLightBulb;

        var testAabb = [[0,0,0],[15,15,15]];
       //return intersectRaySector(rayOrigin, rayDirection,testAabb)

      // return BoundingBoxIntersect(
      //   testAabb[0],
      //   testAabb[1],
      //   rayOrigin, inverseDir);


       var currentStackData, stackDataA, stackDataB, tmpStackData;

       // var uv0, uv1, uv2, uv3, uv4, uv5, uv6, uv7;
       // var d;

       var t = 9999;
       var minT = t;
       var stackptr = 0.0;
       // var id = 0.0;
       // var tu,tv;

       var bnd = GetBoxNodeData(stackptr);//, currentBoxNodeData0, currentBoxNodeData1);
       currentBoxNodeData0 = bnd.boxNodeData0;
       currentBoxNodeData1 = bnd.boxNodeData1;

       var intersectResult = BoundingBoxIntersect(
           [currentBoxNodeData0[1],currentBoxNodeData0[2],currentBoxNodeData0[3]],
           [currentBoxNodeData1[1],currentBoxNodeData1[2],currentBoxNodeData1[3]],
           rayOrigin, inverseDir);

       currentStackData = [stackptr, intersectResult];
       stackLevels[0] = currentStackData;
       var skip = (currentStackData[1] < t);

       while (true) {
           if (!skip) {
                // decrease pointer by 1 (0.0 is root level, 27.0 is maximum depth)
                if (--stackptr < 0.0) // went past the root level, terminate loop
                    break;
                currentStackData = stackLevels[Math.floor(stackptr)];
                if (currentStackData[1] >= t){
                    continue;
                }
               //GetBoxNodeData(currentStackData[0], currentBoxNodeData0, currentBoxNodeData1);
               var _bnd = GetBoxNodeData(currentStackData[0]);//, currentBoxNodeData0, currentBoxNodeData1);
               currentBoxNodeData0 = _bnd.boxNodeData0;
               currentBoxNodeData1 = _bnd.boxNodeData1;
           }
           skip = false; // reset skip
           if (currentBoxNodeData0[0] < 0.0){ // < 0.0 signifies an inner node [idTriangle<0]
              var _bnd = GetBoxNodeData(currentStackData[0] + 1.0);//, currentBoxNodeData0, currentBoxNodeData1);
              nodeAData0 = _bnd.boxNodeData0;
              nodeAData1 = _bnd.boxNodeData1;
              _bnd = GetBoxNodeData(currentBoxNodeData1[0]);//, currentBoxNodeData0, currentBoxNodeData1);
              nodeBData0 = _bnd.boxNodeData0;
              nodeBData1 = _bnd.boxNodeData1;
               ////GetBoxNodeData(currentStackData[0] + 1.0, nodeAData0, nodeAData1);
               ////GetBoxNodeData(currentBoxNodeData1[0], nodeBData0, nodeBData1);
               //stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeAData0.yzw, nodeAData1.yzw, rayOrigin, inverseDir));
               //stackDataB = vec2(currentBoxNodeData1.x, BoundingBoxIntersect(nodeBData0.yzw, nodeBData1.yzw, rayOrigin, inverseDir));
               stackDataA = [currentStackData[0] + 1.0, BoundingBoxIntersect([nodeAData0[1],nodeAData0[2],nodeAData0[3]], [nodeAData1[1],nodeAData1[2],nodeAData1[3]], rayOrigin, inverseDir)];
               stackDataB = [currentBoxNodeData1[0], BoundingBoxIntersect([nodeBData0[1],nodeBData0[2],nodeBData0[3]], [nodeBData1[1],nodeBData1[2],nodeBData1[3]], rayOrigin, inverseDir)];
//             // first sort the branch node data so that 'a' is the smallest
                if (stackDataB[1] < stackDataA[1]) {
                    tmpStackData = stackDataB;
                    stackDataB = stackDataA;
                    stackDataA = tmpStackData;
                    tmpNodeData0 = nodeBData0;   tmpNodeData1 = nodeBData1;
                    nodeBData0   = nodeAData0;   nodeBData1   = nodeAData1;
                    nodeAData0   = tmpNodeData0; nodeAData1   = tmpNodeData1;
                } // branch 'b' now has the larger rayT value of 'a' and 'b'
                if (stackDataB[1] < t){ // see if branch 'b' (the larger rayT) needs to be processed
                    currentStackData = stackDataB;
                    currentBoxNodeData0 = nodeBData0;
                    currentBoxNodeData1 = nodeBData1;
                    skip = true; // this will prevent the stackptr from decreasing by 1
                }
                if (stackDataA[1] < t){ // see if branch 'a' (the smaller rayT) needs to be processed
                    if (skip) // if larger branch 'b' needed to be processed also,
                        stackLevels[Math.floor(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
                    // also, increase pointer by 1
                    currentStackData = stackDataA;
                    currentBoxNodeData0 = nodeAData0;
                    currentBoxNodeData1 = nodeAData1;
                    skip = true; // this will prevent the stackptr from decreasing by 1
                }
// t = Math.min(stackDataA[1],stackDataB[1]);
            continue;
           } // end if (currentBoxNodeData0.x < 0.0) // inner node
//
           // var bnd = GetBoxNodeData(stackptr);//, currentBoxNodeData0, currentBoxNodeData1);
           // currentBoxNodeData0 = bnd.boxNodeData0;
           // currentBoxNodeData1 = bnd.boxNodeData1;
           var d = BoundingBoxIntersect(
               [currentBoxNodeData0[1],currentBoxNodeData0[2],currentBoxNodeData0[3]],
               [currentBoxNodeData1[1],currentBoxNodeData1[2],currentBoxNodeData1[3]],
               rayOrigin, inverseDir);

           if (d < t) {
                t = d;
           }


//         // else this is a leaf
//
//         // each triangle's data is encoded in 8 rgba(or xyzw) texture slots
            //var id = 8.0 * currentBoxNodeData0.x;
//
//         //vd0 etc is triangle data would be fetched form texture
//         d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rayOrigin, rayDirection, tu, tv );
//
//         if (d < t)
//         {
//             t = d;
//             triangleID = id;
//             triangleU = tu;
//             triangleV = tv;
//             triangleLookupNeeded = true;
//         }
//
       } // end while (true)
//
    return t;
//
}

module.exports = {SceneIntersect, SceneDistance};
