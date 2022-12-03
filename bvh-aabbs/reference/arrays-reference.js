//excerpt from initSceneData.js


console.log("Triangle count:" + total_number_of_triangles);

totalWork = new Uint32Array(total_number_of_triangles);

triangle_array = new Float32Array(2048 * 2048 * 4);
// 2048 = width of texture, 2048 = height of texture, 4 = r,g,b, and a components

aabb_array = new Float32Array(2048 * 2048 * 4);
// 2048 = width of texture, 2048 = height of texture, 4 = r,g,b, and a components

aabb_array[9 * i + 0] = triangle_b_box_min.x;
aabb_array[9 * i + 1] = triangle_b_box_min.y;
aabb_array[9 * i + 2] = triangle_b_box_min.z;
aabb_array[9 * i + 3] = triangle_b_box_max.x;
aabb_array[9 * i + 4] = triangle_b_box_max.y;
aabb_array[9 * i + 5] = triangle_b_box_max.z;
aabb_array[9 * i + 6] = triangle_b_box_centroid.x;
aabb_array[9 * i + 7] = triangle_b_box_centroid.y;
aabb_array[9 * i + 8] = triangle_b_box_centroid.z;

totalWork[i] = i;

// Build the BVH acceleration structure, which places a bounding box ('root' of the tree) around all of the
// triangles of the entire mesh, then subdivides each box into 2 smaller boxes.  It continues until it reaches 1 triangle,
// which it then designates as a 'leaf'
BVH_Build_Iterative(totalWork, aabb_array);


triangleDataTexture = new THREE.DataTexture(triangle_array,
    2048,
    2048,
    THREE.RGBAFormat,
    THREE.FloatType,
    THREE.Texture.DEFAULT_MAPPING,
    THREE.ClampToEdgeWrapping,
    THREE.ClampToEdgeWrapping,
    THREE.NearestFilter,
    THREE.NearestFilter,
    1,
    THREE.LinearEncoding);

triangleDataTexture.flipY = false;
triangleDataTexture.generateMipmaps = false;
triangleDataTexture.needsUpdate = true;

aabbDataTexture = new THREE.DataTexture(aabb_array,
    2048,
    2048,
    THREE.RGBAFormat,
    THREE.FloatType,
    THREE.Texture.DEFAULT_MAPPING,
    THREE.ClampToEdgeWrapping,
    THREE.ClampToEdgeWrapping,
    THREE.NearestFilter,
    THREE.NearestFilter,
    1,
    THREE.LinearEncoding);

aabbDataTexture.flipY = false;
aabbDataTexture.generateMipmaps = false;
aabbDataTexture.needsUpdate = true;


// scene/demo-specific uniforms go here
pathTracingUniforms.tTriangleTexture = { value: triangleDataTexture };
pathTracingUniforms.tAABBTexture = { value: aabbDataTexture };