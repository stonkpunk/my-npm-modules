module.exports = divn

function divn(vec) {
  for (var i = 1; i < arguments.length; i++) {
    if (Array.isArray(arguments[i])) {
      for (var n = 0; n < vec.length; n++) {
        vec[n] /= arguments[i][n]
      }
    } else {
      for (var n = 0; n < vec.length; n++) {
        vec[n] /= arguments[i]
      }
    }
  }

  return vec
}
