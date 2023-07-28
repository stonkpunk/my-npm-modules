# icosphere-fast

similar to [icosphere](https://www.npmjs.com/package/icosphere) but much faster for larger division counts

removes the bottleneck that occurs for larger inputs using an efficient mergeVertices function 

## Installation

```sh
npm i icosphere-fast
```

## Usage 

Basic usage

```javascript
var {generateIcosphere, mergeVertices} = require('icosphere-fast');

var icoDetail = 5;
var sphereMesh = generateIcosphere(1.0,icoDetail);
sphereMesh = mergeVertices(sphereMesh /*, precision = 6 */);

//sphereMesh has {cells, positions}
```

Comparison to original icosphere 

```javascript
var {generateIcosphere, mergeVertices} = require('icosphere-fast');
var icosphere = require('icosphere');

var radius = 1.0;

for(var i=1; i<10; i++){
    if(i<7){ //takes too long / fails if more than 6
        var timeOrig = Date.now();
        var mesh0 = icosphere(i);
        timeOrig = Date.now() - timeOrig;
    }

    var timeFast = Date.now();
    var mesh1 = generateIcosphere(radius,i);
    mesh1 = mergeVertices(mesh1);
    timeFast = Date.now() - timeFast;

    if(i<7){console.log("orig",{timeMs: timeOrig, "divisions": i, "positionsLen": mesh0.positions.length})}
    console.log("fast",{timeMs: timeFast, "divisions": i, "positionsLen": mesh1.positions.length})
}

// orig { timeMs: 0, divisions: 1, positionsLen: 42 }
// fast { timeMs: 1, divisions: 1, positionsLen: 42 }
// orig { timeMs: 1, divisions: 2, positionsLen: 162 }
// fast { timeMs: 1, divisions: 2, positionsLen: 162 }
// orig { timeMs: 3, divisions: 3, positionsLen: 642 }
// fast { timeMs: 3, divisions: 3, positionsLen: 642 }
// orig { timeMs: 17, divisions: 4, positionsLen: 2562 }
// fast { timeMs: 15, divisions: 4, positionsLen: 2562 }
// orig { timeMs: 102, divisions: 5, positionsLen: 10242 }
// fast { timeMs: 50, divisions: 5, positionsLen: 10242 }
// orig { timeMs: 1292, divisions: 6, positionsLen: 40962 }
// fast { timeMs: 138, divisions: 6, positionsLen: 40962 }

//for values higher than 6, the original icosphere takes too long / fails
// fast { timeMs: 556, divisions: 7, positionsLen: 163842 }
// fast { timeMs: 2011, divisions: 8, positionsLen: 655362 }
// fast { timeMs: 8520, divisions: 9, positionsLen: 2621442 }
```

## See Also

- [icosphere](https://www.npmjs.com/package/icosphere) - original icosphere lib

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



