module.exports = magn

function magn(vec) {
  var res = 0
  for (var n = 0; n < vec.length; n++) {
    res += vec[n]*vec[n]
  }
  return Math.sqrt(res)
}
