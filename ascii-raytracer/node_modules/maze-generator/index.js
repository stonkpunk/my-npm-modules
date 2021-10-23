module.exports = function(size, algorithm) {
  'use strict';

  var width  = size[0]
    , height = size[1]
    , generator = {}
  algorithm = algorithm || 'recursiveBacktracking'

  // Helper
  function shuffle(o) {
      for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
      return o
  }

  // Algorithm

  /**
   * Recursive Backtracking
   * http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
   */
  generator.recursiveBacktracking = function() {
    // initialize the grid
    var grid = []
      // duplicate to avoid overriding
      , h = height

    while (h--) {
      var cells = []
        , w = width
      while (w--) cells.push(0)
      grid.push(cells)
    }

    var N = 1
      , S = 2
      , E = 4
      , W = 8
      , dirs = ['N', 'E', 'S', 'W']
      , dirsValue = { N: N, E: E, S: S, W: W }
      , DX = { E: 1, W: -1, N: 0, S: 0 }
      , DY = { E: 0, W: 0, N: -1, S: 1 }
      , OPPOSITE = { E: W, W: E, N: S, S: N }

    function carve_passages_from(cx, cy, grid) {
      var directions = shuffle(dirs)

      setImmediate(function() {
        directions.forEach(function(direction) {
          var nx = cx + DX[direction]
            , ny = cy + DY[direction]

          if (ny >= 0 && ny <= (grid.length - 1) && nx >= 0
            && nx <= (grid.length - 1) && grid[ny][nx] === 0) {
            grid[cy][cx] += dirsValue[direction]
            grid[ny][nx] += OPPOSITE[direction]
            carve_passages_from(nx, ny, grid)
          }
        })
      })
    }

    carve_passages_from(0, 0, grid)

    return grid
  }

  // trigger the generator
  if (typeof generator[algorithm] !== 'undefined') {
    return generator[algorithm]()
  }
  else {
    throw new Error('maze-generator Error: Algorithm "'+algorithm+'" does not exist')
  }

}
