# rank-my-modules

get total download counts for a list of npm modules

## Installation

```sh
npm i rank-my-modules
```

## Usage

```javascript
var rmm = require('rank-my-modules');

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

//result
/*[
    [ 'rank', 'name', 'downloads' ],
    [ 1, 'ascii-data-image', 627 ],
    [ 2, 'ngt-tool', 449 ],
    [ 3, 'spatial-db', 289 ],
    [ 4, 'name-my-computer', 155 ],
    [ 5, 'json-shrink', 98 ],
    [ 6, 'jsonfile-compressed', 50 ],
    [ 7, 'spatial-db-ngt', 49 ]
]*/
```
