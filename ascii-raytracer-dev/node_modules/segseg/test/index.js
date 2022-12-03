var t = require('assert');
var segseg = require('../');

/*
  Basic intersection

                (0, 5)
                   o
                   |
  (-10, 0) o--------+-------o  (10, 0)
                   |
                   o
                (0, -5)

*/
t.deepEqual(segseg(-10, 0, 10, 0, 0, 5, 0, -5), [0,0])
t.deepEqual(segseg([-10, 0], [10, 0], [0, 5], [0, -5]), [0,0])
t.deepEqual(segseg({ x: -10, y: 0 }, { x :10, y: 0 }, { x:0, y:5 }, { x: 0, y: -5 }), [0,0])

/*
  Basic intersection

                (5, 5)
                   o------o (10, 5)
                   |
                   |
                   o
                (5, 0)

*/
t.deepEqual(segseg(5, 5, 5, 0, 5, 5, 10, 5), [5,5])
t.deepEqual(segseg([5, 5], [5, 0], [5, 5], [10, 5]), [5,5])
t.deepEqual(segseg({ x:5, y:5 }, { x:5, y:0 }, { x:5, y:5 }, { x: 10, y:5 }), [5,5])

/*
  Colinear
             (-2, 0)    (2, 0)
  (-10, 0) o----o--------o-----o  (10, 0)

*/
t.equal(segseg(-10, 0, 10, 0, -2, 0, 2, 0), true)
t.equal(segseg([-10, 0], [10, 0], [-2, 0], [2, 0]), true)
t.equal(segseg({ x: -10, y: 0 }, { x:10, y:0 }, { x:-2, y:0 }, { x:2, y:0 }), true)

/*
  No intersection (parallel)

  (-10, 5) o-------------o (10, 5)

  (-10, 0) o-------------o (10, 0)

*/
t.equal(segseg(-10, 0, 10, 0, -10, 5, 10, 5), undefined)
t.equal(segseg([-10, 0], [10, 0], [-10, 5], [10, 5]), undefined)
t.equal(segseg({ x:-10, y:0 }, { x:10, y:0 }, { x:-10, y:5 }, { x:10, y:5 }), undefined)

/*
  No intersection

      (-2, 5)  o
                 \
  (-10, 0) o----o  o (2, 0)
              (0, 0)

*/
t.equal(segseg(-10, 0, 0, 0, -2, 5, 2, 0), undefined)
t.equal(segseg([-10, 0], [0, 0], [-2, 5], [2, 0]), undefined)
t.equal(segseg({ x:-10, y:0 }, { x:0, y:0 }, { x:-2, y:5 }, { x:2, y:0 }), undefined)

/*
  No intersection

      (-2, 5)  o
               |
               o (-2, 1)
  (-10, 0) o----o
              (0, 0)

*/
t.equal(segseg(-10, 0, 0, 0, -2, 5, -2, 1), undefined)
t.equal(segseg([-10, 0], [0, 0], [-2, 5], [-2, 1]), undefined)
t.equal(segseg({ x:-10, y:0 }, { x:0, y:0 }, { x:-2, y:5 }, { x:-2, y: 1 }), undefined)

/*
  No intersection

    (-5, 5) o
           /
          / (-10, 0)
         /o-----------o
        o            (0, 0)
    (-25, -5)

*/
t.equal(segseg(-10, 0, 0, 0, -5, 5, -25, -5), undefined)
t.equal(segseg([-10, 0], [0, 0], [-5, 5], [-25, -5]), undefined)
t.equal(segseg({ x:-10, y:0 }, { x: 0, y:0 }, { x:-5, y:5 }, { x:-25, y:-5 }), undefined)
