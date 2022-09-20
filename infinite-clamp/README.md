# infinite-clamp

- remap any number between +/-infinity into the range 0...1

- can also do the inverse, map any number 0...1 into -infinity...infinity

- easily normalize arbitrary numbers for use in training neural nets etc
- this is a lossy operation [see `Usage` example below]

based on [this post](https://math.stackexchange.com/questions/3116137/convert-numbers-between-0-and-infinity-to-numbers-between-0-0-and-1-0)

## Installation

```sh
npm i infinite-clamp
```

## Usage 

```javascript
var ic = require('infinite-clamp');

var numbers = [0,1000,-9999,12345];

//remap(number,scaleDown=1,POW=2,unsigned=false); //scaleDown inversely scales number, POW increases power in formula
//unremap(number,scaleDown=1,POW=2,unsigned=false); 

//remapUnsigned(number,scaleDown=1,POW=2);
//unremapUnsigned(number,scaleDown=1,POW=2); 

var remapped = numbers.map(n=>ic.remap(n));
var unremapped = remapped.map(n=>ic.unremap(n));

console.log({numbers, remapped, unremapped});

// {
//     numbers: [ 0, 1000, -9999, 12345 ],
//     remapped: [ 0.5, 0.9999995000005, 5.001000114024379e-9, 0.9999999967191391 ],
//     unremapped: [ 0, 999.9999999750612, -9998.999985979826, 12344.999900226494 ]
// }
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



