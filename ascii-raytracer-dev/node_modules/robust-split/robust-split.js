module.exports = robustSplit;

var SPLITTER = +(Math.pow(2, 27) + 1.0)

function robustSplit(a) {
  var c = SPLITTER * a
  var abig = c - a
  var ahi = c - abig
  var alo = a - ahi
  return [alo, ahi]
}
