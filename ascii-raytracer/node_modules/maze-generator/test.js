'use strict';

var assert = require('assert')
  , generator = require('./index')

describe('maze-generator', function() {

  it('should generate a 20x20 grid', function() {
    var maze = generator([20, 20])
    assert.equal(maze.length, 20)
    assert.equal(maze[0].length, 20)
  })

  it('should\'n provoke a range error', function() {
    var maze = generator([1000, 1000])
    assert.equal(maze.length, 1000)
    assert.equal(maze[0].length, 1000)
  })

})
