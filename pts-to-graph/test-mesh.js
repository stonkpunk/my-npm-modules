var p2g = require('./index.js');

var mesh = require('bunny');

var result = p2g.meshToPtsAndNGraph(mesh);

console.log(result);