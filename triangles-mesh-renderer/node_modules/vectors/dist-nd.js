module.exports = distn

function distn(vec, other) {
  var res = 0
  for (var n = 0; n < vec.length; n++) {
    res += Math.pow(other[n] - vec[n], 2)
  }
  return Math.sqrt(res)
}
