var ic = require('./index.js');

var numbers = [0,1,2,3,4,5,10,100,1000,9999,12345];

var remapped = numbers.map(n=>ic.remapUnsigned(n));
var unremapped = remapped.map(n=>ic.unremapUnsigned(n));

console.log({numbers, remapped, unremapped});

// {
//     numbers: [ 0, 1000, -9999, 12345 ],
//     remapped: [ 0.5, 0.9999995000005, 5.001000114024379e-9, 0.9999999967191391 ],
//     unremapped: [ 0, 999.9999999750612, -9998.999985979826, 12344.999900226494 ]
// }


