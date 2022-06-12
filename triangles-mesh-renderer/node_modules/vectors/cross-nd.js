module.exports = crossn

function crossn(vec, other) {
  return vec.length < 3 ? (
    vec[0] * other[1] -
    vec[1] * other[0]
  ) : [
    (vec[1] * other[2]) - (vec[2] * other[1]),
    (vec[2] * other[0]) - (vec[0] * other[2]),
    (vec[0] * other[1]) - (vec[1] * other[0])
  ]
}
