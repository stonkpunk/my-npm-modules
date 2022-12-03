var test = require('tape')
var createSDF = require('./sdf-polygon-2d');
var polygon = require('polygon');

test('square', function(t) {

  var points = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var sdf = createSDF([points]);

  t.equal(sdf(0, 0), -10)
  t.equal(sdf(10, 0), 0)
  t.equal(sdf(20, 0), 10)
  t.end();
});

test('accepts an array of polygons (cube)', function(t) {

  var p = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var sdf = createSDF([p]);

  t.equal(sdf(0, 0), -10)
  t.equal(sdf(10, 0), 0)
  t.equal(sdf(20, 0), 10)
  t.end();
});

test('cube - sample() accepts array', function(t) {

  var p = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var sdf = createSDF([p]);

  t.equal(sdf([0,  0]), -10)
  t.equal(sdf([10, 0]), 0)
  t.equal(sdf([20, 0]), 10)
  t.end();
});

test('cube - sample() accepts object', function(t) {

  var p = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var sdf = createSDF([p]);

  t.equal(sdf({ x: 0,  y: 0 }), -10)
  t.equal(sdf({ x: 10, y: 0 }), 0)
  t.equal(sdf({ x: 20, y: 0 }), 10)
  t.end();
});


test('square with hole', function(t) {

  var hull = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var hole = [
    [-5, -5],
    [-5,  5],
    [ 5,  5],
    [ 5, -5]
  ];

  var sdf = createSDF([hull, hole]);

  t.equal(sdf(0, 0), 5)
  t.equal(sdf(-7.5, 0), -2.5)
  t.equal(sdf(-5, 0), 0)
  t.equal(sdf(20, 0), 10)
  t.end();
});

test('square with island in hole', function(t) {

  var hull = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var hole = [
    [-5, -5],
    [-5,  5],
    [ 5,  5],
    [ 5, -5]
  ];

  var island = [
    [-2, -2],
    [-2,  2],
    [ 2,  2],
    [ 2, -2]
  ];

  var sdf = createSDF([hull, hole, island]);

  t.equal(sdf(0, 0), -2)
  t.equal(sdf(2.5, 0), .5)
  t.equal(sdf(-7.5, 0), -2.5)
  t.equal(sdf(-5, 0), 0)
  t.equal(sdf(20, 0), 10)
  t.end();
});


test('proper containment', function(t) {

  var hull1 = [
    [-10, -10],
    [-10,  10],
    [ 10,  10],
    [ 10, -10]
  ];

  var hull2 = [
    [ 10,  10],
    [ 10,  30],
    [ 30,  30],
    [ 30,  10]
  ];

  var hole1 = [
    [-5, -5],
    [-5,  5],
    [ 5,  5],
    [ 5, -5]
  ];

  var hole2 = [
    [ 15, 15],
    [ 15, 25],
    [ 25, 25],
    [ 25, 15]
  ];


  var sdf = createSDF([hull1, hull2, hole1, hole2]);

  t.equal(sdf(0, 0), 5)
  t.equal(sdf(-7.5, 0), -2.5)
  t.equal(sdf(-5, 0), 0)
  t.equal(sdf(-20, 0), 10)

  t.equal(sdf(20, 20), 5)
  t.equal(sdf(12.5, 20), -2.5)
  t.equal(sdf(15, 25), 0)
  t.equal(sdf(20, 0), 10)

  t.end();
});

test('degeneracy (triangle)', function(t) {

  var p = [
    [-10,-10],
    [-10,10],
    [-25,-14]
  ];

  var sdf = createSDF([p]);
  t.ok(sdf([17,  0]) > 0)
  t.end();
});
