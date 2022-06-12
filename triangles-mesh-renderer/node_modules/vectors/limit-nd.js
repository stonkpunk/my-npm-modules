module.exports = limitn

function limitn(vec, scalar) {
  var mag = 0
  for (var n = 0; n < vec.length; n++) {
    mag += vec[n]*vec[n]
  }

  if (mag > scalar*scalar) {
    mag = Math.sqrt(mag)
    for (var n = 0; n < vec.length; n++) {
      vec[n] = vec[n] * scalar / mag
    }
  }

  return vec
}
