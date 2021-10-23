/**
* bvh-tree
* A Bounding Volume Hierarchy data structure implementation.
* https://github.com/pixpipe/bvh-tree
*
* Created by
* @author Ben Raziel
*
* Forked by
* @author Jonathan Lurie
*/
var bvhtree = bvhtree || {};
bvhtree.EPSILON = 1e-6;

/**
* A 3D Vector class. Based on three.js Vector3
*/
bvhtree.BVHVector3 = function ( x, y, z ) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;

};

bvhtree.BVHVector3.prototype = {

  constructor: bvhtree.BVHVector3,


  copy: function ( v ) {
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  },


  set: function ( x, y, z ) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  },


  setFromArray: function(array, firstElementPos) {
    this.x = array[firstElementPos];
    this.y = array[firstElementPos+1];
    this.z = array[firstElementPos+2];
  },


  add: function ( v ) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  },


  multiplyScalar: function ( scalar ) {
    this.x *= scalar;
    this.y *= scalar;
    this.z *= scalar;
    return this;
  },


  subVectors: function ( a, b ) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    this.z = a.z - b.z;
    return this;
  },


  dot: function ( v ) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },


  cross: function ( v ) {
    var x = this.x, y = this.y, z = this.z;
    this.x = y * v.z - z * v.y;
    this.y = z * v.x - x * v.z;
    this.z = x * v.y - y * v.x;
    return this;
  },


  crossVectors: function ( a, b ) {
    var ax = a.x, ay = a.y, az = a.z;
    var bx = b.x, by = b.y, bz = b.z;
    this.x = ay * bz - az * by;
    this.y = az * bx - ax * bz;
    this.z = ax * by - ay * bx;
    return this;
  },


  clone: function () {
    return new bvhtree.BVHVector3( this.x, this.y, this.z );
  }
};














/**
* Constructor of a BVH tree.
* @param {Float32Array} triangles - array of triangles such as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z, ...]
* @param {Number} maxTrianglesPerNode - Maximum number of triangles per node (default: 10)
*/
bvhtree.BVH = function(triangles, maxTrianglesPerNode) {

  this._trianglesArray = triangles;
  this._maxTrianglesPerNode = maxTrianglesPerNode || 10;
  this._bboxArray = this.calcBoundingBoxes(triangles);

  // clone a helper array
  this._bboxHelper = new Float32Array(this._bboxArray);

  // create the root node, add all the triangles to it
  var triangleCount = triangles.length / 9;

  // compute the box root node box (includes all the triangles)
  var extents = this.calcExtents(0, triangleCount, bvhtree.EPSILON);
  this._rootNode = new bvhtree.BVHNode(extents[0], extents[1], 0, triangleCount, 0);

  this._nodesToSplit = [this._rootNode];

  while (this._nodesToSplit.length > 0) {
    var node = this._nodesToSplit.pop();
    this.splitNode(node);
  }
};


/**
* Check if the given point is inside the mesh. The mesh has to be closed
* @param {Array} pos - position of the point to test as [x, y, z]
* @return {Boolean} true if the point is inside and false if outside
*/
bvhtree.BVH.prototype.isInside = function( pos ) {
  var intersection = this.intersectRay({x: pos[0], y: pos[1], z:pos[2]}, {x: 1, y: 0, z: 0}, false);

  if( !intersection )
      return false;

  return (intersection.length % 2 === 1);
}


/**
* Intersect the BVH with the given axis aligned bounding box.
* @param {Object} box - the box to test the intersection on as {min:[x, y, z], max:[x, y, z]}
* @return {Array} each element of the array is an Onject such as {triangleIndex: Number, triangle: Float32Array(9)} and each triangle being described as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
*/
bvhtree.BVH.prototype.intersectBox = function( box ) {
  var intersection = this._intersectShape( box, box, bvhtree.BVH._isTriangleInsideBox );
  return intersection;
}


/**
* Intersect the BVH with the given sphere.
* @param {Object} sphere the sphere to test the intersection with as {center:[x, y, z], radius:Number}
* @return {Array} each element of the array is an Onject such as {triangleIndex: Number, triangle: Float32Array(9)} and each triangle being described as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
*/
bvhtree.BVH.prototype.intersectSphere = function( sphere ) {
  var box = {
    min: [
      sphere.center[0] - sphere.radius,
      sphere.center[1] - sphere.radius,
      sphere.center[2] - sphere.radius
    ],
    max: [
      sphere.center[0] + sphere.radius,
      sphere.center[1] + sphere.radius,
      sphere.center[2] + sphere.radius
    ]
  }

  var intersection = this._intersectShape( sphere, box, bvhtree.BVH.isTriangleInsideSphere );
  return intersection;
}


/**
* [PRIVATE]
* Generic intersection between the BVH and a shape.
* @param {Object} shape - a generic shape
* @param {Object} shapeBB - the bounding box of the given sphere {min:[x, y, z], max:[x, y, z]}
* @param {Function} intersectMethod - function that determine if a triangle is inside the shape
* @return {Array} each element of the array is an Onject such as {triangleIndex: Number, triangle: Float32Array(9)} and each triangle being described as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
*/
bvhtree.BVH.prototype._intersectShape = function(shape, shapeBB, intersectMethod){
  var nodesToIntersect = [this._rootNode];

  // triangles that are in intersected nodes - they are not necessary in the box
  var trianglesCandidates = [];
  // short list of triangles that are actually fully into the box
  var trianglesShortlist = [];

  while (nodesToIntersect.length > 0) {
    var node = nodesToIntersect.pop();

    if( bvhtree.BVH._nodeIntersectBox( node, shapeBB ) ){
      if( node._node0 )
      nodesToIntersect.push( node._node0 )

      if( node._node1 )
      nodesToIntersect.push( node._node1 )

      for (i = node._startIndex; i < node._endIndex; i++) {
        trianglesCandidates.push(this._bboxArray[i*7]);
      }
    }
  }

  // running through all the triangle candidates
  for (var i = 0; i < trianglesCandidates.length; i++) {
    var triIndex = trianglesCandidates[i];
    let indexInArray = triIndex*9;
    var triangle = this._trianglesArray.subarray(indexInArray, indexInArray + 9);

    if( intersectMethod( triangle, shape )){
      trianglesShortlist.push({
        triangle: new Float32Array(triangle),
        triangleIndex: triIndex
      });
    }
  }

  return trianglesShortlist;
}


/**
* [PRIVATE]
* Check if there is an intersection between a node (using its box) and an arbitrary box. Both kind of boxes are axis aligned.
* @param {BVHNode} node the node to test the intersection on
* @param {Object} box the box to test the intersection on as {min:[x, y, z], max:[x, y, z]}
* @return {Boolean} true if there is an intersection
*/
bvhtree.BVH._nodeIntersectBox = function( node, box ){
  var nodeMin = [node._extentsMin.x, node._extentsMin.y, node._extentsMin.z];
  var nodeMax = [node._extentsMax.x, node._extentsMax.y, node._extentsMax.z];
  var boxMin = box.min;
  var boxMax = box.max;

  var intersection = [false, false, false];

  // for each dimension
  for(var i=0; i<3; i++){
    let overlap = (boxMin[i] < nodeMax[i]) && (boxMax[i] > nodeMin[i]);
    let inclusion = ((boxMin[i] < nodeMin[i]) && (boxMax[i] > nodeMax[i])) ||
    ((nodeMin[i] < boxMin[i]) && (nodeMax[i] > boxMax[i]))
    intersection[i] = overlap || inclusion;
  }

  return (intersection[0] && intersection[1] && intersection[2]);
}


/**
* [PRIVATE]
* Check if every vertices of a triangle is inside the given box
* @param {Float32Array} triangle array as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
* @param {Object} box the box to test the intersection with as {min:[x, y, z], max:[x, y, z]}
* @return {Boolean} true is inside, false if outside
*/
bvhtree.BVH._isTriangleInsideBox = function( triangle, box ){
  var boxMin = box.min;
  var boxMax = box.max;

  var dimensionInside = [false, false, false];

  // for each dimension
  for(var i=0; i<3; i++){
    var v0 = triangle[0 + i];
    var v1 = triangle[3 + i];
    var v2 = triangle[6 + i];

    dimensionInside[i] = (v0 > boxMin[i] && v0 < boxMax[i]) &&
    (v1 > boxMin[i] && v1 < boxMax[i]) &&
    (v2 > boxMin[i] && v2 < boxMax[i]);
  }

  return dimensionInside[0] && dimensionInside[1] && dimensionInside[2];
}


/**
* Check if every vertices of a triangle is inside the given sphere
* @param {Float32Array} triangle array as [v0x, v0y, v0z, v1x, v1y, v1z, v2x, v2y, v2z]
* @param {Object} sphere the sphere to test the intersection with as {center:[x, y, z], radius:Number}
* @return {Boolean} true is inside, false if outside
*/
bvhtree.BVH.isTriangleInsideSphere = function( triangle, sphere ){
  var isInside = true;

  // for each point of the triangle
  for(var i=0; i<3; i++){
    var dx = triangle[i*3] - sphere.center[0];
    var dy = triangle[i*3 + 1] - sphere.center[1];
    var dz = triangle[i*3 + 2] - sphere.center[2];
    var d = Math.sqrt( dx*dx + dy*dy + dz*dz );
    isInside = isInside && ( d < sphere.radius );
  }
  return isInside;
}


/**
* returns a list of all the triangles in the BVH which interected a specific node.
* We use the BVH node structure to first cull out nodes which do not intereset the ray.
* For rays that did intersect, we test intersection of the ray with each triangle.
* @param {Point} rayOrigin the origin position of the ray.
* @param {Point} rayDirection the direction vector of the ray.
* @param {Boolean} backfaceCulling if 'true', only intersections with front-faces of the mesh will be performed.
* @return IntersectionResult[] an array of intersection result, one for each triangle which intersected the BVH
*
* @typedef {Object} IntersectionResult
* @property Array[] triangle the triangle which the ray intersected
* @property number triangleIndex the position of the interescting triangle in the input triangle array provided to the BVH constructor.
* @property {Point} intersectionPoint the interesection point of the ray on the triangle.
*/
bvhtree.BVH.prototype.intersectRay = function(rayOrigin, rayDirection, backfaceCulling) {
  var nodesToIntersect = [this._rootNode];
  var trianglesInIntersectingNodes = []; // a list of nodes that intersect the ray (according to their bounding box)
  var intersectingTriangles = [];
  var i;

  var invRayDirection = new bvhtree.BVHVector3(
    1.0 / rayDirection.x,
    1.0 / rayDirection.y,
    1.0 / rayDirection.z
  );

  // go over the BVH tree, and extract the list of triangles that lie in nodes that intersect the ray.
  // note: these triangles may not intersect the ray themselves
  while (nodesToIntersect.length > 0) {
    var node = nodesToIntersect.pop();

    if (bvhtree.BVH.intersectNodeBox(rayOrigin, invRayDirection, node)) {
      if (node._node0) {
        nodesToIntersect.push(node._node0);
      }

      if (node._node1) {
        nodesToIntersect.push(node._node1);
      }

      for (i = node._startIndex; i < node._endIndex; i++) {
        trianglesInIntersectingNodes.push(this._bboxArray[i*7]);
      }
    }
  }

  // go over the list of candidate triangles, and check each of them using ray triangle intersection
  var a = new bvhtree.BVHVector3();
  var b = new bvhtree.BVHVector3();
  var c = new bvhtree.BVHVector3();
  var rayOriginVec3 = new bvhtree.BVHVector3(rayOrigin.x, rayOrigin.y, rayOrigin.z);
  var rayDirectionVec3 = new bvhtree.BVHVector3(rayDirection.x, rayDirection.y, rayDirection.z);

  for (i = 0; i < trianglesInIntersectingNodes.length; i++) {
    var triIndex = trianglesInIntersectingNodes[i];
    var indexInArray = triIndex*9;

    a.setFromArray(this._trianglesArray, indexInArray);
    b.setFromArray(this._trianglesArray, indexInArray+3);
    c.setFromArray(this._trianglesArray, indexInArray+6);

    var intersectionPoint = bvhtree.BVH.intersectRayTriangle(a, b, c, rayOriginVec3, rayDirectionVec3, backfaceCulling);

    if (intersectionPoint) {
      intersectingTriangles.push({
        triangle: this._trianglesArray.slice(indexInArray, indexInArray+9),
        triangleIndex: triIndex,
        intersectionPoint: intersectionPoint
      });
    }
  }
  return intersectingTriangles;
};


/**
* Gets an array of triangle, and calculates the bounding box for each of them, and adds an index to the triangle's position in the array
* Each bbox is saved as 7 values in a Float32Array: (position, minX, minY, minZ, maxX, maxY, maxZ)
*/
bvhtree.BVH.prototype.calcBoundingBoxes = function(trianglesArray) {
  var p0x, p0y, p0z;
  var p1x, p1y, p1z;
  var p2x, p2y, p2z;
  var minX, minY, minZ;
  var maxX, maxY, maxZ;

  var triangleCount = trianglesArray.length / 9;

  // the 7 is because we have to store 7 numbers per box: min and max in the 3d
  // + one field for triangle ID (which is its index in the list)
  var bboxArray = new Float32Array(triangleCount * 7);

  for (var i = 0; i < triangleCount; i++) {
    minX = Math.min(trianglesArray[i*9],   trianglesArray[i*9+3], trianglesArray[i*9+6]);
    minY = Math.min(trianglesArray[i*9+1], trianglesArray[i*9+4], trianglesArray[i*9+7]);
    minZ = Math.min(trianglesArray[i*9+2], trianglesArray[i*9+5], trianglesArray[i*9+8]);
    maxX = Math.max(trianglesArray[i*9],   trianglesArray[i*9+3], trianglesArray[i*9+6]);
    maxY = Math.max(trianglesArray[i*9+1], trianglesArray[i*9+4], trianglesArray[i*9+7]);
    maxZ = Math.max(trianglesArray[i*9+2], trianglesArray[i*9+5], trianglesArray[i*9+8]);

    bvhtree.BVH.setBox(bboxArray, i, i, minX, minY, minZ, maxX, maxY, maxZ);
  }

  return bboxArray;
};




/**
* Calculates the extents (i.e the min and max coordinates) of a list of bounding boxes in the bboxArray
* @param startIndex the index of the first triangle that we want to calc extents for
* @param endIndex the index of the last triangle that we want to calc extents for
* @param expandBy a small epsilon to expand the bbox by, for safety during ray-box intersections
*/
bvhtree.BVH.prototype.calcExtents = function(startIndex, endIndex, expandBy) {
  expandBy = expandBy || 0.0;

  if (startIndex >= endIndex) {
    return [{'x': 0, 'y': 0, 'z': 0}, {'x': 0, 'y': 0, 'z': 0}];
  }

  var minX = Infinity;
  var minY = Infinity;
  var minZ = Infinity;
  var maxX = -Infinity;
  var maxY = -Infinity;
  var maxZ = -Infinity;

  for (var i = startIndex; i < endIndex; i++) {
    minX = Math.min(this._bboxArray[i*7+1], minX);
    minY = Math.min(this._bboxArray[i*7+2], minY);
    minZ = Math.min(this._bboxArray[i*7+3], minZ);
    maxX = Math.max(this._bboxArray[i*7+4], maxX);
    maxY = Math.max(this._bboxArray[i*7+5], maxY);
    maxZ = Math.max(this._bboxArray[i*7+6], maxZ);
  }

  return [
    {'x': minX - expandBy, 'y': minY - expandBy, 'z': minZ - expandBy},
    {'x': maxX + expandBy, 'y': maxY + expandBy, 'z': maxZ + expandBy}
  ];
};


/**
* Split the given node in 2 distinc nodes.
* Severals steps are involved:
* 1. compute the size of the given node
* 2. sort the bbox(es) of the node. For each bbox,
*     - to a LEFT container if its (center) position is lower than the center of the node
*     - to a RIGHT container if its (center) position is higher than the center of the node
*     - both LEFT and RIGHT have 3 components, one for each dimension
* 3. make sure the node is splitable in any of the 3 axis (=there is at least 1 bbox in each octant)
* 4. choose the longest axis of the node to split along
* 5. reorganize the bbox index (from start to end of the current node) to put first
*    all the ones that go LEFT and second, all the ones that go RIGHT
* 6. compute the extent (size + EPSILON) of the future node 0 and 1
* 7. create the actual sub node 0 and 1 (of 1 level higher than the parent)
*    with their reletive sub list of bboxes.
* 8. associate the sub node 0 and 1 to the parent and remove the bboxes of the parent
*    (since they now belong to the child nodes)
* 9. add the 2 child node to the list of node to split, just to prepare the next iterration
*/
bvhtree.BVH.prototype.splitNode = function(node) {
  if ((node.elementCount() <= this._maxTrianglesPerNode) || (node.elementCount() === 0)) {
    return;
  }

  // [step 1]
  var startIndex = node._startIndex;
  var endIndex = node._endIndex;

  var leftNode = [ [],[],[] ];
  var rightNode = [ [],[],[] ];
  var extentCenters = [node.centerX(), node.centerY(), node.centerZ()];

  var extentsLength = [
    node._extentsMax.x - node._extentsMin.x,
    node._extentsMax.y - node._extentsMin.y,
    node._extentsMax.z - node._extentsMin.z
  ];

  var objectCenter = [];
  objectCenter.length = 3;

  // [step 2]
  // for each bbox of this node...
  for (var i = startIndex; i < endIndex; i++) {
    // computing the center of each bbox of this node...
    objectCenter[0] = (this._bboxArray[i * 7 + 1] + this._bboxArray[i * 7 + 4]) * 0.5; // center = (min + max) / 2
    objectCenter[1] = (this._bboxArray[i * 7 + 2] + this._bboxArray[i * 7 + 5]) * 0.5; // center = (min + max) / 2
    objectCenter[2] = (this._bboxArray[i * 7 + 3] + this._bboxArray[i * 7 + 6]) * 0.5; // center = (min + max) / 2

    // for each dim, if the center of the current (for) box is lower than the
    // the center of the node (function), we put it in the leftNode
    // (referenced by the index of the coordinate on which it's lower)
    for (var j = 0; j < 3; j++) {
      if (objectCenter[j] < extentCenters[j]) {
        leftNode[j].push(i);
      }
      else {
        rightNode[j].push(i);
      }
    }
  }

  // [step 3]
  // check if we couldn't split the node by any of the axes (x, y or z). halt here, dont try to split any more (cause it will always fail, and we'll enter an infinite loop
  var splitFailed = [];
  splitFailed.length = 3;

  splitFailed[0] = (leftNode[0].length === 0) || (rightNode[0].length === 0);
  splitFailed[1] = (leftNode[1].length === 0) || (rightNode[1].length === 0);
  splitFailed[2] = (leftNode[2].length === 0) || (rightNode[2].length === 0);

  if (splitFailed[0] && splitFailed[1] && splitFailed[2]) {
    return;
  }

  // [step 4]
  // choose the longest split axis. if we can't split by it, choose next best one.
  var splitOrder = [0, 1, 2];

  splitOrder.sort(function(axis0, axis1) {
    return (extentsLength[axis1] - extentsLength[axis0])
  });

  var leftElements;
  var rightElements;

  for (j = 0; j < 3; j++) {
    var candidateIndex = splitOrder[j];

    if (!splitFailed[candidateIndex]) {
      leftElements = leftNode[candidateIndex];
      rightElements = rightNode[candidateIndex];

      break;
    }
  }

  // [step 5]
  // sort the elements in range (startIndex, endIndex) according to which node they should be at
  var node0Start = startIndex;
  var node0End = node0Start + leftElements.length;
  var node1Start = node0End;
  var node1End = endIndex;
  var currElement;

  var helperPos = node._startIndex;
  var concatenatedElements = leftElements.concat(rightElements);

  for (i = 0; i < concatenatedElements.length; i++) {
    currElement = concatenatedElements[i];
    bvhtree.BVH.copyBox(this._bboxArray, currElement, this._bboxHelper, helperPos);
    helperPos++;
  }

  // copy results back to main array
  var subArr = this._bboxHelper.subarray(node._startIndex * 7, node._endIndex * 7);
  this._bboxArray.set(subArr, node._startIndex * 7);

  // [step 6]
  // create 2 new nodes for the node we just split, and add links to them from the parent node
  var node0Extents = this.calcExtents(node0Start, node0End, bvhtree.EPSILON);
  var node1Extents = this.calcExtents(node1Start, node1End, bvhtree.EPSILON);

  // [step 7]
  var node0 = new bvhtree.BVHNode(node0Extents[0], node0Extents[1], node0Start, node0End, node._level + 1);
  var node1 = new bvhtree.BVHNode(node1Extents[0], node1Extents[1], node1Start, node1End, node._level + 1);

  // [step 8]
  node._node0 = node0;
  node._node1 = node1;
  node.clearShapes();

  // [step 9]
  // add new nodes to the split queue
  this._nodesToSplit.push(node0);
  this._nodesToSplit.push(node1);
};


bvhtree.BVH._calcTValues = function(minVal, maxVal, rayOriginCoord, invdir) {
  var res = {min: 0, max: 0};

  if ( invdir >= 0 ) {
    res.min = ( minVal - rayOriginCoord ) * invdir;
    res.max = ( maxVal - rayOriginCoord ) * invdir;

  } else {
    res.min = ( maxVal - rayOriginCoord ) * invdir;
    res.max = ( minVal - rayOriginCoord ) * invdir;
  }

  return res;
};


bvhtree.BVH.intersectNodeBox = function(rayOrigin, invRayDirection, node) {
  var t = bvhtree.BVH._calcTValues(node._extentsMin.x, node._extentsMax.x, rayOrigin.x, invRayDirection.x);
  var ty = bvhtree.BVH._calcTValues(node._extentsMin.y, node._extentsMax.y, rayOrigin.y, invRayDirection.y);

  if ( ( t.min > ty.max ) || ( ty.min > t.max ) ) {
    return false;
  }

  // These lines also handle the case where tmin or tmax is NaN
  // (result of 0 * Infinity). x !== x returns true if x is NaN
  if ( ty.min > t.min || t.min !== t.min ) {
    t.min = ty.min;
  }

  if ( ty.max < t.max || t.max !== t.max ) {
    t.max = ty.max;
  }

  var tz = bvhtree.BVH._calcTValues(node._extentsMin.z, node._extentsMax.z, rayOrigin.z, invRayDirection.z);

  if ( ( t.min > tz.max ) || ( tz.min > t.max ) ) {
    return false;
  }

  if ( tz.min > t.min || t.min !== t.min ) {
    t.min = tz.min;
  }

  if ( tz.max < t.max || t.max !== t.max ) {
    t.max = tz.max;
  }

  //return point closest to the ray (positive side)
  if (t.max < 0 ) {
    return false;
  }

  return true;
};


bvhtree.BVH.intersectRayTriangle = (function () {
  // Compute the offset origin, edges, and normal.
  var diff = new bvhtree.BVHVector3();
  var edge1 = new bvhtree.BVHVector3();
  var edge2 = new bvhtree.BVHVector3();
  var normal = new bvhtree.BVHVector3();

  return function (a, b, c, rayOrigin, rayDirection, backfaceCulling) {

    // from http://www.geometrictools.com/LibMathematics/Intersection/Wm5IntrRay3Triangle3.cpp

    edge1.subVectors(b, a);
    edge2.subVectors(c, a);
    normal.crossVectors(edge1, edge2);

    // Solve Q + t*D = b1*E1 + bL*E2 (Q = kDiff, D = ray direction,
    // E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
    //   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
    //   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
    //   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
    var DdN = rayDirection.dot(normal);
    var sign;

    if (DdN > 0) {

      if (backfaceCulling) {
        return null;
      }

      sign = 1;

    } else if (DdN < 0) {

      sign = -1;
      DdN = -DdN;

    } else {

      return null;

    }

    diff.subVectors(rayOrigin, a);
    var DdQxE2 = sign * rayDirection.dot(edge2.crossVectors(diff, edge2));

    // b1 < 0, no intersection
    if (DdQxE2 < 0) {
      return null;
    }

    var DdE1xQ = sign * rayDirection.dot(edge1.cross(diff));

    // b2 < 0, no intersection
    if (DdE1xQ < 0) {
      return null;
    }

    // b1+b2 > 1, no intersection
    if (DdQxE2 + DdE1xQ > DdN) {
      return null;
    }

    // Line intersects triangle, check if ray does.
    var QdN = -sign * diff.dot(normal);

    // t < 0, no intersection
    if (QdN < 0) {
      return null;
    }

    // Ray intersects triangle.
    var t = QdN / DdN;
    var result = new bvhtree.BVHVector3();
    return result.copy( rayDirection ).multiplyScalar( t ).add( rayOrigin );
  };
}());


bvhtree.BVH.setBox = function(bboxArray, pos, triangleId, minX, minY, minZ, maxX, maxY, maxZ) {
  bboxArray[pos*7] = triangleId;
  bboxArray[pos*7+1] = minX;
  bboxArray[pos*7+2] = minY;
  bboxArray[pos*7+3] = minZ;
  bboxArray[pos*7+4] = maxX;
  bboxArray[pos*7+5] = maxY;
  bboxArray[pos*7+6] = maxZ;
};


bvhtree.BVH.copyBox = function(sourceArray, sourcePos, destArray, destPos) {
  destArray[destPos*7] = sourceArray[sourcePos*7];
  destArray[destPos*7+1] = sourceArray[sourcePos*7+1];
  destArray[destPos*7+2] = sourceArray[sourcePos*7+2];
  destArray[destPos*7+3] = sourceArray[sourcePos*7+3];
  destArray[destPos*7+4] = sourceArray[sourcePos*7+4];
  destArray[destPos*7+5] = sourceArray[sourcePos*7+5];
  destArray[destPos*7+6] = sourceArray[sourcePos*7+6];
};


bvhtree.BVH.getBox = function(bboxArray, pos, outputBox) {
  outputBox.triangleId = bboxArray[pos*7];
  outputBox.minX = bboxArray[pos*7+1];
  outputBox.minY = bboxArray[pos*7+2];
  outputBox.minZ = bboxArray[pos*7+3];
  outputBox.maxX = bboxArray[pos*7+4];
  outputBox.maxY = bboxArray[pos*7+5];
  outputBox.maxZ = bboxArray[pos*7+6];
};


/**
* A node in the BVH structure
* @class
* @param {Point} extentsMin the min coords of this node's bounding box ({x,y,z})
* @param {Point} extentsMax the max coords of this node's bounding box ({x,y,z})
* @param {number} startIndex an index in the bbox array, where the first element of this node is located
* @param {number} endIndex an index in the bbox array, where the last of this node is located, plus 1 (meaning that its non-inclusive).
* @param {number} the distance of this node from the root for the bvh tree. root node has level=0, its children have level=1 etc.
*/
bvhtree.BVHNode = function(extentsMin, extentsMax, startIndex, endIndex, level) {
  this._extentsMin = extentsMin;
  this._extentsMax = extentsMax;
  this._startIndex = startIndex;
  this._endIndex = endIndex;
  this._level = level;
  this._node0 = null;
  this._node1 = null;
};


bvhtree.BVHNode.prototype.elementCount = function() {
  return this._endIndex - this._startIndex;
};


bvhtree.BVHNode.prototype.centerX = function() {
  return (this._extentsMin.x + this._extentsMax.x) * 0.5;
};


bvhtree.BVHNode.prototype.centerY = function() {
  return (this._extentsMin.y + this._extentsMax.y) * 0.5;
};


bvhtree.BVHNode.prototype.centerZ = function() {
  return (this._extentsMin.z + this._extentsMax.z) * 0.5;
};


bvhtree.BVHNode.prototype.clearShapes = function() {
  this._startIndex = -1;
  this._endIndex = -1;
};


bvhtree.BVHNode.calcBoundingSphereRadius = function(extentsMin, extentsMax) {
  var centerX = (extentsMin.x + extentsMax.x) * 0.5;
  var centerY = (extentsMin.y + extentsMax.y) * 0.5;
  var centerZ = (extentsMin.z + extentsMax.z) * 0.5;

  var extentsMinDistSqr =
  (centerX - extentsMin.x) * (centerX - extentsMin.x) +
  (centerY - extentsMin.y) * (centerY - extentsMin.y) +
  (centerZ - extentsMin.z) * (centerZ - extentsMin.z);

  var extentsMaxDistSqr =
  (centerX - extentsMax.x) * (centerX - extentsMax.x) +
  (centerY - extentsMax.y) * (centerY - extentsMax.y) +
  (centerZ - extentsMax.z) * (centerZ - extentsMax.z);

  return Math.sqrt(Math.max(extentsMinDistSqr, extentsMaxDistSqr));
};

// commonjs module definiton
if (typeof module !== 'undefined' && module.exports) {
  module.exports.BVH = bvhtree.BVH;
  module.exports.intersectRay = bvhtree.intersectRay;
}
