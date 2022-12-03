module.exports.raytraceExample = function(regl){
    const raytrace = regl({
        vert: `
    precision mediump float;
    attribute vec2 position;
    void main () {
      gl_Position = vec4(position, 0, 1);
    }`,
        frag: `
    uniform sampler2D tAABBTexture;
    precision mediump float;
    uniform float width, height, timestep;
    uniform vec3 eye1, center1;
    vec2 resolution = vec2(width, height);
    
    #define INFINITY 999999.9;


//from https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/shaders/BVH_Animated_Model_Fragment.glsl

//see also https://github.com/erichlof/THREE.js-PathTracing-Renderer/blob/gh-pages/js/PathTracingCommon.js

vec2 stackLevels[28];

//float InvTextureWidth = 0.000244140625; // (1 / 4096 texture width)
//float InvTextureWidth = 0.00048828125;  // (1 / 2048 texture width)
//float InvTextureWidth = 0.0009765625;   // (1 / 1024 texture width)

#define INV_TEXTURE_WIDTH 0.00048828125

//vec4 boxNodeData0 corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
//vec4 boxNodeData1 corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z

// void GetBoxNodeData(const in float i, inout vec4 boxNodeData0, inout vec4 boxNodeData1)
// {
//     // each bounding box's data is encoded in 2 rgba(or xyzw) texture slots
//     float ix2 = i * 2.0;
//     // (ix2 + 0.0) corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
//     // (ix2 + 1.0) corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z
//
// //before was ivec, now vecs w floor
//     vec2 uv0 = floor(vec2( mod(ix2 + 0.0, 2048.0), (ix2 + 0.0) * INV_TEXTURE_WIDTH )); // data0
//     vec2 uv1 = floor(vec2( mod(ix2 + 1.0, 2048.0), (ix2 + 1.0) * INV_TEXTURE_WIDTH )); // data1
//
//     // boxNodeData0 = texelFetch(tAABBTexture, uv0, 0);
//     // boxNodeData1 = texelFetch(tAABBTexture, uv1, 0);
//    
//     boxNodeData0 = texture2D(tAABBTexture, uv0 , 0).rgba;
//     boxNodeData1 = texture2D(tAABBTexture, uv1 , 0).rgba;
// }

vec4 GetBoxNodeData0(float i)
{
    // each bounding box's data is encoded in 2 rgba(or xyzw) texture slots
    float ix2 = i * 2.0;
    // (ix2 + 0.0) corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
    // (ix2 + 1.0) corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z

    //old 
    //vec2 uv0 = floor(vec2( mod(ix2 + 0.0, 2048.0), (ix2 + 0.0) * INV_TEXTURE_WIDTH )); // data0
    
    //new
    vec2 uv0 = vec2( mod(ix2 + 0.0, 2048.0) * INV_TEXTURE_WIDTH, (ix2 + 0.0) * INV_TEXTURE_WIDTH * INV_TEXTURE_WIDTH ); // data0
    
    
    
    //vec2 uv1 = floor(vec2( mod(ix2 + 1.0, 2048.0), (ix2 + 1.0) * INV_TEXTURE_WIDTH )); // data1

    // boxNodeData0 = texelFetch(tAABBTexture, uv0, 0);
    // boxNodeData1 = texelFetch(tAABBTexture, uv1, 0);
    
    return texture2D(tAABBTexture, uv0 , 0.0).rgba;
}

vec4 GetBoxNodeData1(const in float i)
{
    // each bounding box's data is encoded in 2 rgba(or xyzw) texture slots
    float ix2 = i * 2.0;
    // (ix2 + 0.0) corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
    // (ix2 + 1.0) corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z

    //before was ivec, now vecs w floor
    //vec2 uv0 = floor(vec2( mod(ix2 + 0.0, 2048.0), (ix2 + 0.0) * INV_TEXTURE_WIDTH )); // data0
    //vec2 uv1 = floor(vec2( mod(ix2 + 1.0, 2048.0), (ix2 + 1.0) * INV_TEXTURE_WIDTH )); // data1

    vec2 uv1 = vec2( mod(ix2 + 1.0, 2048.0) * INV_TEXTURE_WIDTH, (ix2 + 1.0) * INV_TEXTURE_WIDTH * INV_TEXTURE_WIDTH ); // data0
   
    // boxNodeData0 = texelFetch(tAABBTexture, uv0, 0);
    // boxNodeData1 = texelFetch(tAABBTexture, uv1, 0);
    
    return texture2D(tAABBTexture, uv1, 0.0).rgba; //vec4(0.0);//texture2D(tAABBTexture, uv1)
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

    return max(t0, 0.0) > t1 ? 99999.9 : t0;
}

//--------------------------------------------------------------------------------------------------------------
float SceneIntersect( vec3 rayOrigin, vec3 rayDirection)//, out bool isRayExiting, out float intersectedObjectID )
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

    //intersectedObjectID = -INFINITY;

    bool skip = false;
    bool triangleLookupNeeded = false;

    objectCount++;

    // transform ray into GLTF_Model's object space
    //rayOrigin = vec3( uGLTF_Model_InvMatrix * vec4(rayOrigin, 1.0) );
    //rayDirection = vec3( uGLTF_Model_InvMatrix * vec4(rayDirection, 0.0) );
    inverseDir = 1.0 / rayDirection;

    //vec4 currentBoxNodeData0 corresponds to .x = idTriangle,  .y = aabbMin.x, .z = aabbMin.y, .w = aabbMin.z
    //vec4 currentBoxNodeData1 corresponds to .x = idRightChild .y = aabbMax.x, .z = aabbMax.y, .w = aabbMax.z
    currentBoxNodeData0 = GetBoxNodeData0(stackptr);//, currentBoxNodeData0, currentBoxNodeData1);
    currentBoxNodeData1 = GetBoxNodeData1(stackptr);//, currentBoxNodeData0, currentBoxNodeData1);
    //currentBoxNodeData0 = [idTriangle, aabbMin.x, aabbMin.y, aabbMin.z];
    //currentBoxNodeData1 = [idRightChild, aabbMax.x, aabbMax.y, aabbMax.z];
    currentStackData = vec2(stackptr, BoundingBoxIntersect(currentBoxNodeData0.yzw, currentBoxNodeData1.yzw, rayOrigin, inverseDir));
    stackLevels[0] = currentStackData;
    skip = (currentStackData.y < t);

    int tries = 0;

    while (true)// && tries<99999) //no need for bailout w tries var 
    {
        tries++;
        if (!skip)
        {
            // decrease pointer by 1 (0.0 is root level, 27.0 is maximum depth)
            if (--stackptr < 0.0) // went past the root level, terminate loop
                break;

            currentStackData = stackLevels[int(stackptr)];

            if (currentStackData.y >= t)
                continue;

            currentBoxNodeData0 = GetBoxNodeData0(currentStackData.x);
            currentBoxNodeData1 = GetBoxNodeData1(currentStackData.x);
        }
        skip = false; // reset skip

        if (currentBoxNodeData0.x < 0.0) // < 0.0 signifies an inner node [idTriangle<0]
        {
            nodeAData0 = GetBoxNodeData0(currentStackData.x + 1.0 );
            nodeAData1 = GetBoxNodeData1(currentStackData.x + 1.0 );
          
            nodeBData0 = GetBoxNodeData0(currentBoxNodeData1.x );
            nodeBData1 = GetBoxNodeData1(currentBoxNodeData1.x );
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
        //id = 8.0 * currentBoxNodeData0.x;

        //vd0 etc is triangle data would be fetched form texture
        // d = BVH_TriangleIntersect( vec3(vd0.xyz), vec3(vd0.w, vd1.xy), vec3(vd1.zw, vd2.x), rayOrigin, rayDirection, tu, tv );
        d = BoundingBoxIntersect(currentBoxNodeData0.yzw, currentBoxNodeData1.yzw, rayOrigin, inverseDir);
        
        if (d < t)
        {
            t = d;
            // triangleID = id;
            // triangleU = tu;
            // triangleV = tv;
            // triangleLookupNeeded = true;
        }

    } // end while (true)

    return t;

} // end float SceneIntersect( vec3 rayOrigin, vec3 rayDirection, out bool isRayExiting, out float intersectedObjectID )




    float torus(vec3 p, vec2 t)
    {
      vec2 q = vec2(length(p.xz)-t.x,p.y);
      return length(q)-t.y;
    }

    float sphere(vec3 p, float s)
    {
      return length(p)-s;
    }

    vec2 opU(vec2 d1, vec2 d2)
    {
      return (d1.x < d2.x) ? d1 : d2;
    }

    vec3 opRep(vec3 p, vec3 c)
    {
      return vec3(mod(p.yz, c.yz)-0.5*c.yz, p.x);
    }

    float plane(vec3 p, vec4 n)
    {
      return dot(p, n.xyz) + n.w;
    }

    vec2 distanceEstimate(vec3 pos)
    {
      float cellSize = 5.;
      float cellNumber = floor(pos.y/cellSize)+1.;
      float period = 50./cellNumber;
      float s = sin(timestep/period);
      float c = cos(timestep/period);
      mat3 r = mat3(c,  -s,  0.,
                    s,   c,  0.,
                    0.,  0., 1.);
      vec2 ball = vec2(sphere(opRep(pos-vec3(0, 0, s*2.0), vec3(cellSize)), 0.5), 45.);
      vec2 tor = vec2(torus(opRep(pos, vec3(cellSize))*r, vec2(1.0, 0.25)), 15.);
      vec2 floor = vec2(plane(pos, vec4(0, 1, 0, -1)), 0.);
      vec2 objects = opU(tor, ball);
      return opU(floor, objects);
    }

    vec3 getNormal(vec3 pos)
    {
      const vec2 delta = vec2(0.01, 0);

      vec3 n;
      n.x = distanceEstimate(pos + delta.xyy).x - distanceEstimate(pos - delta.xyy).x;
      n.y = distanceEstimate(pos + delta.yxy).x - distanceEstimate(pos - delta.yxy).x;
      n.z = distanceEstimate(pos + delta.yyx).x - distanceEstimate(pos - delta.yyx).x;

      return normalize(n);
    }

    float softshadow(in vec3 ro, in vec3 rd, in float mint, in float tmax)
    {
      float res = 1.0;
      float t = mint;
      for (int i=0; i<16; i++)
      {
        float h = distanceEstimate(ro + rd*t).x;
        res = min(res, 8.0*h/t);
        t += clamp(h, 0.02, 0.11);
        if( h<0.001 || t>tmax ) break;
      }
      return clamp(res, 0., 1.);
    }

    float calcAO(in vec3 pos, in vec3 nor)
    {
      float occ = 0.0;
      float sca = 1.0;
      for (int i=0; i<5; i++)
      {
        float hr = 0.01 + 0.12*float(i)/4.0;
        vec3 aopos =  nor * hr + pos;
        float dd = distanceEstimate(aopos).x;
        occ += -(dd-hr)*sca;
        sca *= 0.95;
      }
      return clamp(1.0 - 3.0*occ, 0., 1.);
    }

    vec3 sunLight  = normalize(vec3(-0.6, 0.7, 0.5));
    vec3 sunColour = vec3(1.0, .75, .6);
    vec3 Sky(in vec3 rayDir)
    {
      float sunAmount = max(dot(rayDir, sunLight), 0.0);
      float v = pow(1.0 - max(rayDir.y, 0.0), 6.);
      vec3  sky = mix(vec3(.1, .2, .3), vec3(.32, .32, .32), v);
      sky = sky + sunColour * sunAmount * sunAmount * .25;
      sky = sky + sunColour * min(pow(sunAmount, 800.0)*1.5, .3);

      return clamp(sky, 0., 1.);
    }

    const float horizonLength = 100.;
    const float surfacePrecision = 0.01;
    const int maxIterations = 128;
    vec2 castRay(vec3 rayOrigin, vec3 rayDir)
    {
      float t = 0.;
      for (int i=0; i<maxIterations; i++)
      {
        vec3 p = rayOrigin + rayDir * t;
        vec2 d = distanceEstimate(p);
        if (abs(d.x) < surfacePrecision)
        {
          return vec2(t, d.y);
        }
        t += d.x;
        if (t >= horizonLength) break;
      }
      return vec2(t, -1.);
    }
    
    float BoundingBoxIntersect2( vec3 minCorner, vec3 maxCorner, vec3 rayOrigin, vec3 rayDirection )
    {
       vec3 invDir = 1.0 / rayDirection; //todo this was param before, more efficient before? 
       vec3 near = (minCorner - rayOrigin) * invDir;
       vec3 far  = (maxCorner - rayOrigin) * invDir;

       vec3 tmin = min(near, far);
       vec3 tmax = max(near, far);

       float t0 = max( max(tmin.x, tmin.y), tmin.z);
       float t1 = min( min(tmax.x, tmax.y), tmax.z);

       //return t1 >= max(t0, 0.0) ? t0 : INFINITY;
       
       //return 0.0;
       return max(t0, 0.0) > t1 ? 99999.9 : t0;
    }
    
    vec2 castRay_rect(vec3 rayOrigin, vec3 rayDir)
    {
      //float t = BoundingBoxIntersect2(vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0), rayOrigin, rayDir);
      
      float t = SceneIntersect(rayOrigin, rayDir);
      
      vec3 p = rayOrigin + rayDir * t;
      if(t<9999.9){
        return vec2(t,0.01);
      }  
      
      return vec2(t, -1.);
    }

    vec3 getRay(vec3 dir, vec2 pos) {
      pos = pos - 0.5;
      pos.x *= resolution.x/resolution.y;

      dir = normalize(dir);
      vec3 right = normalize(cross(vec3(0., 1., 0.), dir));
      vec3 up = normalize(cross(dir, right));

      return dir + right*pos.x + up*pos.y;
    }

    vec3 render(in vec3 ro, in vec3 rd)
    {
      vec3 skyColor = Sky(rd);
      vec3 color = skyColor;
      vec2 res = castRay_rect(ro, rd);
      float t = res.x; 
      float material = res.y;
      float colorScale = 8.0;
      if (t < horizonLength)
      {
        vec3 pos = ro + t*rd;
        vec3 normal = getNormal(pos);
        color = mod(vec3(t),colorScale)/colorScale;//normal;//mix(color, skyColor, 1.0-exp(-0.001*t*t));
      }
      return vec3(clamp(color, 0., 1.));
    }

    void main () {
      vec2 p = vec2(1.0-gl_FragCoord.x/resolution.x, gl_FragCoord.y/resolution.y);
      vec3 rayDir = normalize(getRay(eye1-center1, p));
      vec3 res = render(center1, rayDir);
      gl_FragColor = vec4(res.rgb, 1.);
    }`,
        attributes: {
            position: [-4, -4, 4, -4, 0, 4]
        },
        uniforms: {
            center1: regl.context('center1'),
            eye1: regl.context('eye1'),
            height: regl.context('viewportHeight'),
            width: regl.context('viewportWidth'),
            timestep: regl.context('tick'),
            tAABBTexture: regl.context('tAABBTexture')
        },
        context: {
            eye1: function (context, props) {return props.eye1},
            center1: function (context, props) {return props.center1},
            tAABBTexture: function (context, props) {return props.tAABBTexture}
        },
        count: 3
    })
    return raytrace;
}