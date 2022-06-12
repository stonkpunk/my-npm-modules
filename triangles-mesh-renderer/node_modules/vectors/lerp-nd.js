module.exports = lerpn

function lerpn(vec, a, b, scalar) {
  for (var n = 0; n < a.length; n++) {
    vec[n] = a[n] + (b[n] - a[n]) * scalar
  }
  return vec
}
