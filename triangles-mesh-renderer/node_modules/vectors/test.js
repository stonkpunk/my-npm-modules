var v = require('./')
var test = require('tape')

test('add', function(t) {
  t.plan(8)

  t.deepEqual(v.add(2)([1, 2], [2, 1]), [3, 3])
  t.deepEqual(v.add(3)([1, 2, 3], [3, 2, 1]), [4, 4, 4])
  t.deepEqual(v.add(3)([1, 2, 3], [3, 2, 1], [2, 1, 2], [1, 2, 1]), [7, 7, 7])
  t.deepEqual(v.add(3)([1, 2, 3], 5), [6, 7, 8])

  t.deepEqual(v.addn([1, 2], [2, 1]), [3, 3])
  t.deepEqual(v.addn([1, 2, 3], [3, 2, 1]), [4, 4, 4])
  t.deepEqual(v.addn([1, 2, 3], [3, 2, 1], [2, 1, 2], [1, 2, 1]), [7, 7, 7])
  t.deepEqual(v.addn([1, 2, 3], 5), [6, 7, 8])
})

test('copy', function(t) {
  t.plan(2)
  t.deepEqual(v.copy(2)([1, 2]), [1, 2])
  t.deepEqual(v.copyn([1, 2]), [1, 2])
})

test('cross', function(t) {
  t.plan(4)
  t.deepEqual(v.cross(2)([1, 2], [8, 4]), -12)
  t.deepEqual(v.cross(3)([1, 2, 3], [8, 4, 2]), [-8, 22, -12])

  t.deepEqual(v.crossn([1, 2], [8, 4]), -12)
  t.deepEqual(v.crossn([1, 2, 3], [8, 4, 2]), [-8, 22, -12])
})

test('dist', function(t) {
  t.plan(4)

  t.deepEqual(v.dist(2)([2, 4], [4, 4]), 2)
  t.deepEqual(v.dist(3)([2, 4, 6], [3, 3, 8]).toFixed(2), 2.45)

  t.deepEqual(v.distn([2, 4], [4, 4]), 2)
  t.deepEqual(v.distn([2, 4, 6], [3, 3, 8]).toFixed(2), 2.45)
})

test('div', function(t) {
  t.plan(8)
  t.deepEqual(v.div(2)([2, 2], [2, 2]), [1, 1])
  t.deepEqual(v.div(3)([6, 6, 6], [2, 2, 2]), [3, 3, 3])
  t.deepEqual(v.div(3)([12, 6, 4], [2, 2, 2], [2, 2, 2]), [3, 1.5, 1])
  t.deepEqual(v.div(3)([12, 12, 12], 6), [2, 2, 2])

  t.deepEqual(v.divn([2, 2], [2, 2]), [1, 1])
  t.deepEqual(v.divn([6, 6, 6], [2, 2, 2]), [3, 3, 3])
  t.deepEqual(v.divn([12, 6, 4], [2, 2, 2], [2, 2, 2]), [3, 1.5, 1])
  t.deepEqual(v.divn([12, 12, 12], 6), [2, 2, 2])
})

test('dot', function(t) {
  t.plan(4)

  t.deepEqual(v.dot(2)([15, 5], [10, 8]), 190)
  t.deepEqual(v.dot(3)([15, 5, 5], [10, 8, 8]), 230)

  t.deepEqual(v.dotn([15, 5], [10, 8]), 190)
  t.deepEqual(v.dotn([15, 5, 5], [10, 8, 8]), 230)
})

test('heading', function(t) {
  t.plan(1)
  t.deepEqual(v.heading(2)([5, 0], [0, 5]) * 180 / Math.PI, -45)
})

test('lerp', function(t) {
  t.plan(4)
  t.deepEqual(v.lerp(2)([], [0, 0], [100, 100], 0.75), [75, 75])
  t.deepEqual(v.lerp(3)([], [0, 0, 0], [100, 100, 100], 0.75), [75, 75, 75])

  t.deepEqual(v.lerpn([], [0, 0], [100, 100], 0.75), [75, 75])
  t.deepEqual(v.lerpn([], [0, 0, 0], [100, 100, 100], 0.75), [75, 75, 75])
})

test('limit', function(t) {
  t.plan(8)
  t.deepEqual(v.limit(2)([3, 0], 2), [2, 0])
  t.deepEqual(v.limit(3)([3, 2, 0], 5), [3, 2, 0])
  t.deepEqual(v.limit(3)([3, 0, 4], 3).map(function(n) { return n.toFixed(2) }), [1.8, 0, 2.4])
  t.deepEqual(v.limit(3)([100, 0, 200], 10).map(function(n) { return n.toFixed(2) }), [4.47, 0, 8.94])

  t.deepEqual(v.limitn([3, 0], 2), [2, 0])
  t.deepEqual(v.limitn([3, 2, 0], 5), [3, 2, 0])
  t.deepEqual(v.limitn([3, 0, 4], 3).map(function(n) { return n.toFixed(2) }), [1.8, 0, 2.4])
  t.deepEqual(v.limitn([100, 0, 200], 10).map(function(n) { return n.toFixed(2) }), [4.47, 0, 8.94])
})

test('mag', function(t) {
  t.plan(4)

  t.deepEqual(v.mag(2)([2, 4]).toFixed(2), 4.47)
  t.deepEqual(v.mag(3)([2, 4, 6]).toFixed(2), 7.48)

  t.deepEqual(v.magn([2, 4]).toFixed(2), 4.47)
  t.deepEqual(v.magn([2, 4, 6]).toFixed(2), 7.48)
})

test('mult', function(t) {
  t.plan(8)
  t.deepEqual(v.mult(2)([2, 2], [2, 2]), [4, 4])
  t.deepEqual(v.mult(3)([6, 6, 6], [2, 2, 2]), [12, 12, 12])
  t.deepEqual(v.mult(3)([12, 6, 4], [2, 2, 2], [2, 2, 2]), [48, 24, 16])
  t.deepEqual(v.mult(3)([12, 12, 12], 6), [72, 72, 72])

  t.deepEqual(v.multn([2, 2], [2, 2]), [4, 4])
  t.deepEqual(v.multn([6, 6, 6], [2, 2, 2]), [12, 12, 12])
  t.deepEqual(v.multn([12, 6, 4], [2, 2, 2], [2, 2, 2]), [48, 24, 16])
  t.deepEqual(v.multn([12, 12, 12], 6), [72, 72, 72])
})

test('normalize', function(t) {
  t.plan(6)
  t.deepEqual(v.normalize(2)([3, 0]), [1, 0])
  t.deepEqual(v.normalize(2)([4, 3]), [0.8, 0.6])
  t.deepEqual(v.normalize(3)([4, 5, 7]).map(function(n) { return n.toFixed(2) }), [0.42, 0.53, 0.74])

  t.deepEqual(v.normalizen([3, 0]), [1, 0])
  t.deepEqual(v.normalizen([4, 3]), [0.8, 0.6])
  t.deepEqual(v.normalizen([4, 5, 7]).map(function(n) { return n.toFixed(2) }), [0.42, 0.53, 0.74])
})

test('sub', function(t) {
  t.plan(8)

  t.deepEqual(v.sub(2)([1, 2], [2, 1]), [-1, 1])
  t.deepEqual(v.sub(3)([1, 2, 3], [3, 2, 1]), [-2, 0, 2])
  t.deepEqual(v.sub(3)([10, 12, 13], [3, 2, 1], [2, 1, 2], [1, 2, 1]), [4, 7, 9])
  t.deepEqual(v.sub(3)([12, 12, 12], 5), [7, 7, 7])

  t.deepEqual(v.subn([1, 2], [2, 1]), [-1, 1])
  t.deepEqual(v.subn([1, 2, 3], [3, 2, 1]), [-2, 0, 2])
  t.deepEqual(v.subn([10, 12, 13], [3, 2, 1], [2, 1, 2], [1, 2, 1]), [4, 7, 9])
  t.deepEqual(v.subn([12, 12, 12], 5), [7, 7, 7])
})
