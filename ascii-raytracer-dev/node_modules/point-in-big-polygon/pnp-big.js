"use strict"

module.exports = preprocessPolygon

var orient = require("robust-orientation")
var makeSlabs = require("slab-decomposition")

function dummyFunction(p) {
  return -1
}

function createClassifyPoint(segments, slabs, outside, orientation) {
  function classifyPoint(p) {
    var index = slabs.castUp(p)
    if(index < 0) {
      return outside
    }
    var seg = segments[index]
    if(!orientation) {
      return orient(p, seg[0], seg[1])
    } else {
      return orient(p, seg[1], seg[0])
    }
  }
  return classifyPoint
}

function preprocessPolygon(loops, orientation) {
  orientation = !!orientation

  //Compute number of loops
  var numLoops = loops.length
  var numSegments = 0
  for(var i=0; i<numLoops; ++i) {
    numSegments += loops[i].length
  }

  //Degenerate case: All loops are empty
  if(numSegments === 0) {
    return dummyFunction
  }

  //Unpack segments
  var segments = new Array(numSegments)
  var ptr = 0
  for(var i=0; i<numLoops; ++i) {
    var loop = loops[i]
    var numVertices = loop.length
    for(var s=numVertices-1,t=0; t<numVertices; s=(t++)) {
      segments[ptr++] = [loop[s], loop[t]]
    }
  }

  //Build slab decomposition
  var slabs = makeSlabs(segments)

  //Find outer orientation
  var outside
  var root = slabs.slabs[0]
  if(root) {
    while(root.left) {
      root = root.left
    }
    var h = root.key
    if(h[0][0] < h[1][0]) {
      outside = -1
    } else {
      outside = 1
    }
  } else {
    var h = segments[slabs.horizontal[0][0].index]
    if(h[0][1] < h[1][1]) {
      outside = 1
    } else {
      outside = -1
    }
  }
  if(orientation) {
    outside = -outside
  }

  //Return classification function
  return createClassifyPoint(segments, slabs, outside, orientation)
}