'use strict'

/**
 * Module dependencies.
 */

const normals = require('angle-normals')
const isArray = Array.isArray

function isArrayLike(x) {
  return isArray(x) || x.length
}

function TypeExpectationError(what, type, input) {
  return new TypeError('Expecting '+what+' to be a '+type+'. Got '+ typeof input)
}

/**
 * Creates a regl draw command from a simplicial complex
 * with optional attributes.
 *
 * @public
 * @default
 * @param {Function} regl
 * @param {Object} complex
 * @param {Object?} configuration
 */

module.exports = createREGLPrimitive
function createREGLPrimitive(regl, complex, configuration) {
  if (!regl || 'function' != typeof regl) {
    throw TypeExpectationError('regl', 'function', regl)
  }

  if (!complex || 'object' != typeof complex) {
    throw TypeExpectationError('complex', 'object', complex)
  }

  if (configuration && 'object' != typeof configuration) {
    throw TypeExpectationError('configuration', 'object', configuration)
  }

  if (false == isArrayLike(complex.positions)) {
    throw TypeExpectationError('complex.positions', 'array', complex.positions)
  }

  if (complex.normals && false == isArrayLike(complex.normals)) {
    throw TypeExpectationError('complex.normals', 'array', complex.normals)
  }

  if (complex.cells && false == isArrayLike(complex.cells)) {
    throw TypeExpectationError('complex.cells', 'array', complex.cells)
  }

  if (complex.uvs && false == isArrayLike(complex.uvs)) {
    throw TypeExpectationError('complex.uvs', 'array', complex.uvs)
  }

  // initial regl draw command state derived from
  // optional input configuration
  const state = Object.assign({attributes: {}}, configuration)

  // derive normals if not given
  if (null == complex.normals && complex.cells) {
    complex.normals = normals(complex.cells, complex.positions)
  }



  // attribute setter helper
  function attribute(k, x) {
    if (x) { state.attributes[k] = x }
  }

  //var rndNormalList =  complex.normals.map((n,i)=>[Math.random(),Math.random(),Math.random()]);

  // sets regl draw command attributes
  //attribute('position', complex.positions)
  //attribute('normal', complex.normals)
  //attribute('uv', complex.uvs || complex.positions.map((v) => ([v[0], v[1]])))

  if (complex.cells && complex.cells.length) {
    state.elements = complex.cells
  }

  if (null == state.count && null == state.elements) {
    state.count = complex.positions.length
  }

  return regl(state)
}
