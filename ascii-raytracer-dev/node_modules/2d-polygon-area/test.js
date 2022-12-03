var test = require('tape');
var area = require('./2d-polygon-area');

test('square 1x1 (CCW)', function(t) {
  var square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
  ];

  t.equal(area(square), -1);
  t.end();
});

test('square 1x1 (CW)', function(t) {
  var square = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1]
  ].reverse();

  t.equal(area(square), 1);
  t.end();
});

test('square 10x10 (CW)', function(t) {
  var square = [
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10]
  ].reverse();

  t.equal(area(square), 100);
  t.end();
});
