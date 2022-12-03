"use strict"

var computeIntersection = require("../intersect.js")

var tape = require("tape")
var robustProduct = require("robust-product")
var det = require("robust-determinant")
var robustSum = require("robust-sum")
var robustDiff = require("robust-subtract")
var robustCompare = require("robust-compare")
var validate = require("validate-robust-sequence")

tape("exact-intersect", function(t) {

  //Evaluate:
  //
  //  | a[0]  a[1]  1 |
  //  | b[0]  b[1]  1 |
  //  |  x     y    w |
  //
  function testPoint(a, b, x, y, w) {

    var d0 = robustSum([a[1]], [-b[1]])
    var d1 = robustSum([a[0]], [-b[0]])
    var d2 = det([a, b])

    t.ok(validate(d2), "validate det")

    var p0 = robustProduct(x, d0)
    var p1 = robustProduct(y, d1)
    var p2 = robustProduct(w, d2)

    t.ok(validate(p0), "validate p0")
    t.ok(validate(p1), "validate p1")
    t.ok(validate(p2), "validate p2")

    var s = robustSum(robustDiff(p0, p1), p2)
    t.ok(validate(s), "validate s")

    t.equals(robustCompare(s, [0]), 0, "check point on line")
  }

  function verify(a, b, c, d) {
    var x = computeIntersection(a, b, c, d)
    t.ok(validate(x[0]), "validate x")
    t.ok(validate(x[1]), "validate y")
    t.ok(validate(x[2]), "validate w")
    testPoint(a, b, x[0], x[1], x[2])
    testPoint(c, d, x[0], x[1], x[2])
    var p = [[a, b], [c, d]]
    for(var s=0; s<2; ++s) {
      for(var r=0; r<2; ++r) {
        for(var h=0; h<2; ++h) {
          var y = computeIntersection(
            p[h][s], p[h][s^1],
            p[h^1][r], p[h^1][r^1])
          t.ok(validate(y[0]), "validate x")
          t.ok(validate(y[1]), "validate y")
          t.ok(validate(y[2]), "validate w")
          t.equals(robustCompare(robustProduct(y[0], x[2]), robustProduct(x[0], y[2])), 0, "check x")
          t.equals(robustCompare(robustProduct(y[1], x[2]), robustProduct(x[1], y[2])), 0, "check y")
        }
      }
    }
  }

  //Fuzz test
  for(var i=0; i<100; ++i) {
    verify(
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
      [Math.random(), Math.random()],
      [Math.random(), Math.random()])
  }

  t.end()
})

tape('no isect', function(t) {
  var isect = computeIntersection([-1, 10], [-10, 1], [10, 0], [10, 10]);


  t.equal(isect[2][0], 0, 'no intersections')

  t.end();
})
