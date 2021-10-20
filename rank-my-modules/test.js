
var rmm = require('./index.js');

var modulesList = [
    'ascii-data-image',
    'json-shrink',
    'jsonfile-compressed',
    'name-my-computer',
    'ngt-tool',
    'spatial-db',
    'spatial-db-ngt',
]

rmm.rank(modulesList, function(res){
    console.log(res);
});

