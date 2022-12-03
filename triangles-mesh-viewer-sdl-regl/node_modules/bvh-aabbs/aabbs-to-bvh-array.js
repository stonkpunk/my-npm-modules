var BVH_Build_Iterative_Fast = require('./BVH_Acc_Structure_Iterative_Fast_Builder.js').BVH_Build_Iterative;
var BVH_Build_Iterative_SAH = require('./BVH_Acc_Structure_Iterative_SAH_Builder.js').BVH_Build_Iterative;

function aabbsToBvhArray(listAabbs, doFastNotSAH=false){
    var totalWork = new Uint32Array(listAabbs.length);
    var aabb_array = new Float32Array(2048 * 2048 * 4);
    // 2048 = width of texture, 2048 = height of texture, 4 = r,g,b, and a components

    for(var i=0;i<listAabbs.length;i++){ //todo accept "flat" arr of aabb data ...
        var aabb = listAabbs[i];
        aabb_array[9 * i + 0] = aabb[0][0]; //min x
        aabb_array[9 * i + 1] = aabb[0][1]; //min y
        aabb_array[9 * i + 2] = aabb[0][2]; //min z
        aabb_array[9 * i + 3] = aabb[1][0]; //max x
        aabb_array[9 * i + 4] = aabb[1][1]; //max y
        aabb_array[9 * i + 5] = aabb[1][2]; //max z
        aabb_array[9 * i + 6] = (aabb[0][0] + aabb[1][0])/2.0; //center x [centroid]
        aabb_array[9 * i + 7] = (aabb[0][1] + aabb[1][1])/2.0; //center y
        aabb_array[9 * i + 8] = (aabb[0][2] + aabb[1][2])/2.0; //center z
        totalWork[i] = i;
    }

    if(doFastNotSAH){
        BVH_Build_Iterative_Fast(totalWork, aabb_array);
    }else{
        BVH_Build_Iterative_SAH(totalWork, aabb_array);
    }

    return aabb_array;//{totalWork, aabb_array}
}

module.exports = {aabbsToBvhArray};


//
// aabb_array[9 * i + 0] = triangle_b_box_min.x;
// aabb_array[9 * i + 1] = triangle_b_box_min.y;
// aabb_array[9 * i + 2] = triangle_b_box_min.z;
// aabb_array[9 * i + 3] = triangle_b_box_max.x;
// aabb_array[9 * i + 4] = triangle_b_box_max.y;
// aabb_array[9 * i + 5] = triangle_b_box_max.z;
// aabb_array[9 * i + 6] = triangle_b_box_centroid.x;
// aabb_array[9 * i + 7] = triangle_b_box_centroid.y;
// aabb_array[9 * i + 8] = triangle_b_box_centroid.z;

//totalWork[i] = i;

//var BVH_Build_Iterative_Fast = require('./bvh/BVH_Acc_Structure_Iterative_Fast_Builder.js').BVH_Build_Iterative;
//var BVH_Build_Iterative_SAH = require('./bvh/BVH_Acc_Structure_Iterative_SAH_Builder.js').BVH_Build_Iterative;

//BVH_Build_Iterative(totalWork, aabb_array);

//aabb_array after:
// // slot 0
// aabb_array[8 * n + 0] = buildnodes[n].idPrimitive;  // r or x component
// aabb_array[8 * n + 1] = buildnodes[n].minCorner.x;  // g or y component
// aabb_array[8 * n + 2] = buildnodes[n].minCorner.y;  // b or z component
// aabb_array[8 * n + 3] = buildnodes[n].minCorner.z;  // a or w component
// // slot 1
// aabb_array[8 * n + 4] = buildnodes[n].idRightChild; // r or x component
// aabb_array[8 * n + 5] = buildnodes[n].maxCorner.x;  // g or y component
// aabb_array[8 * n + 6] = buildnodes[n].maxCorner.y;  // b or z component
// aabb_array[8 * n + 7] = buildnodes[n].maxCorner.z;  // a or w component

