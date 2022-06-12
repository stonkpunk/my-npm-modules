module.exports = dotn

function dotn(vec, other) {
  var res = 0
  for (var n = 0; n < vec.length; n++) {
    res += vec[n] * other[n]
  }
  return res
}
