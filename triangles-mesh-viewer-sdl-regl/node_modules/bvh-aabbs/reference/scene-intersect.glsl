//from https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/shaders/BVH_Animated_Model_Fragment.glsl

//see also https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/js/PathTracingCommon.js

vec2 stackLevels[28];

#define INV_TEXTURE_WIDTH 0.00048828125

//vec4 boxNodeData0 corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
//vec4 boxNodeData1 corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z

void GetBoxNodeData(const in float i, inout vec4 boxNodeData0, inout vec4 boxNodeData1)
{
    // each bounding box's data is encoded in 2 rgba(or xyzw) texture slots
    float ix2 = i * 2.0;
    // (ix2 + 0.0) corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
    // (ix2 + 1.0) corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z

    ivec2 uv0 = ivec2( mod(ix2 + 0.0, 2048.0), (ix2 + 0.0) * INV_TEXTURE_WIDTH ); // data0
    ivec2 uv1 = ivec2( mod(ix2 + 1.0, 2048.0), (ix2 + 1.0) * INV_TEXTURE_WIDTH ); // data1

    boxNodeData0 = texelFetch(tAABBTexture, uv0, 0);
    boxNodeData1 = texelFetch(tAABBTexture, uv1, 0);
}

float BoundingBoxIntersect( vec3 minCorner, vec3 maxCorner, vec3 rayOrigin, vec3 invDir )
//--------------------------------------------------------------------------------------
{
    vec3 near = (minCorner - rayOrigin) * invDir;
    vec3 far  = (maxCorner - rayOrigin) * invDir;

    vec3 tmin = min(near, far);
    vec3 tmax = max(near, far);

    float t0 = max( max(tmin.x, tmin.y), tmin.z);
    float t1 = min( min(tmax.x, tmax.y), tmax.z);

    //return t1 >= max(t0, 0.0) ? t0 : INFINITY;
    return max(t0, 0.0) > t1 ? INFINITY : t0;
}

//--------------------------------------------------------------------------------------------------------------
float SceneIntersect( vec3 rayOrigin, vec3 rayDirection, out bool isRayExiting, out float intersectedObjectID )
//--------------------------------------------------------------------------------------------------------------
{
    vec4 currentBoxNodeData0, nodeAData0, nodeBData0, tmpNodeData0;
    vec4 currentBoxNodeData1, nodeAData1, nodeBData1, tmpNodeData1;

    vec4 vd0, vd1, vd2, vd3, vd4, vd5, vd6, vd7;

    vec3 inverseDir = 1.0 / rayDirection;
    vec3 normal;
    vec3 hitPos, toLightBulb;

    vec2 currentStackData, stackDataA, stackDataB, tmpStackData;
    ivec2 uv0, uv1, uv2, uv3, uv4, uv5, uv6, uv7;

    float d;
    float t = INFINITY;
    float stackptr = 0.0;
    float id = 0.0;
    float tu, tv;
    float triangleID = 0.0;
    float triangleU = 0.0;
    float triangleV = 0.0;
    float triangleW = 0.0;

    int objectCount = 0;

    intersectedObjectID = -INFINITY;

    bool skip = false;
    bool triangleLookupNeeded = false;

    objectCount++;

    // transform ray into GLTF_Model's object space
    rayOrigin = vec3( uGLTF_Model_InvMatrix * vec4(rayOrigin, 1.0) );
    rayDirection = vec3( uGLTF_Model_InvMatrix * vec4(rayDirection, 0.0) );
    inverseDir = 1.0 / rayDirection;

    //vec4 currentBoxNodeData0 corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
    //vec4 currentBoxNodeData1 corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z
    GetBoxNodeData(stackptr, currentBoxNodeData0, currentBoxNodeData1);
    //currentBoxNodeData0 = [idTriangle, aabbMin.x, aabbMin.y, aabbMin.z];
    //currentBoxNodeData1 = [idRightChild, aabbMax.x, aabbMax.y, aabbMax.z];
    currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNodeData0.yzw, currentBoxNodeData1.yzw, rayOrigin, inverseDir));
    stackLevels[0] = currentStackData;
    skip = (currentStackData.y < t);

    while (true)
    {
        if (!skip)
        {
            // decrease pointer by 1 (0.0 is root level, 27.0 is maximum depth)
            if (--stackptr < 0.0) // went past the root level, terminate loop
                break;

            currentStackData = stackLevels[int(stackptr)];

            if (currentStackData.y >= t)
                continue;

            GetBoxNodeData(currentStackData.x, currentBoxNodeData0, currentBoxNodeData1);
        }
        skip = false; // reset skip

        if (currentBoxNodeData0.x < 0.0) // < 0.0 signifies an inner node [idTriangle<0]
        {
            GetBoxNodeData(currentStackData.x + 1.0, nodeAData0, nodeAData1);
            GetBoxNodeData(currentBoxNodeData1.x, nodeBData0, nodeBData1);
            stackDataA = vec2(currentStackData.x + 1.0, BoundingBoxIntersect(nodeAData0.yzw, nodeAData1.yzw, rayOrigin, inverseDir));
            stackDataB = vec2(currentBoxNodeData1.x, BoundingBoxIntersect(nodeBData0.yzw, nodeBData1.yzw, rayOrigin, inverseDir));

            // first sort the branch node data so that 'a' is the smallest
            if (stackDataB.y < stackDataA.y)
            {
                tmpStackData = stackDataB;
                stackDataB = stackDataA;
                stackDataA = tmpStackData;

                tmpNodeData0 = nodeBData0;   tmpNodeData1 = nodeBData1;
                nodeBData0   = nodeAData0;   nodeBData1   = nodeAData1;
                nodeAData0   = tmpNodeData0; nodeAData1   = tmpNodeData1;
            } // branch 'b' now has the larger rayT value of 'a' and 'b'

            if (stackDataB.y < t) // see if branch 'b' (the larger rayT) needs to be processed
            {
                currentStackData = stackDataB;
                currentBoxNodeData0 = nodeBData0;
                currentBoxNodeData1 = nodeBData1;
                skip = true; // this will prevent the stackptr from decreasing by 1
            }
            if (stackDataA.y < t) // see if branch 'a' (the smaller rayT) needs to be processed
            {
                if (skip) // if larger branch 'b' needed to be processed also,
                    stackLevels[int(stackptr++)] = stackDataB; // cue larger branch 'b' for future round
                // also, increase pointer by 1

                currentStackData = stackDataA;
                currentBoxNodeData0 = nodeAData0;
                currentBoxNodeData1 = nodeAData1;
                skip = true; // this will prevent the stackptr from decreasing by 1
            }

            continue;
        } // end if (currentBoxNodeData0.x < 0.0) // inner node


        // else this is a leaf

        // each triangle's data is encoded in 8 rgba(or xyzw) texture slots
        id = 8.0 * currentBoxNodeData0.x;

        //vd0 etc is triangle data would be fetched form texture
        d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rayOrigin, rayDirection, tu, tv );

        if (d < t)
        {
            t = d;
            triangleID = id;
            triangleU = tu;
            triangleV = tv;
            triangleLookupNeeded = true;
        }

    } // end while (true)

    return t;

} // end float SceneIntersect( vec3 rayOrigin, vec3 rayDirection, out bool isRayExiting, out float intersectedObjectID )

