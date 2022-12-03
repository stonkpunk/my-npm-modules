var test = require('tape');
var rsplit = require('./robust-split');

function rjoin(a) {
  return a[0] + a[1];
};

test('basic in/out', function(t) {
  for (var i = 0.1; i<1; i+=0.1) {
    var r = rsplit(i);
    t.equal(i, rjoin(r));
  }

  t.end();
});
