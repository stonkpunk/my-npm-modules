var intersect = require('../');
var test = require('tape');

test('tri', function (t) {
    var tri = [[5,5,5],[10,15,4],[15,5,3]];
    var pt = [10,5,-20];
    var dir = [0,0,1];
    var out = [0,0,0];
    var res = intersect(out, pt, dir, tri);
    t.deepEqual(out, [10,5,4]);
    t.equal(out, res);
    t.deepEqual(pt, [10,5,-20], 'pt not modified');
    t.deepEqual(dir, [0,0,1], 'dir not modified');
    t.deepEqual(tri, [[5,5,5],[10,15,4],[15,5,3]], 'tri not modified');
    
    t.equal(intersect(out, pt, [0,0,-1], tri), null, 'miss z -1');
    t.equal(intersect(out, pt, [0,1,0], tri), null, 'miss y +1');
    t.equal(intersect(out, pt, [0,-1,0], tri), null, 'miss y -1');
    t.equal(intersect(out, pt, [0,1,1], tri), null, 'miss y+1 z+1');
    t.end();
});
