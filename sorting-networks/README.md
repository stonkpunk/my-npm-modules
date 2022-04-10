# sorting-networks

Near-optimal sorting networks for up to 64 inputs based on [work by bertdobbelaere](https://bertdobbelaere.github.io/sorting_networks_extended.html) and [Ariya Hidayat / 
Bei Zhang](https://ariya.io/2013/10/sorting-networks-using-higher-order-functions-of-javascript-array)

sort function falls back to [TimSort](https://www.npmjs.com/package/timsort) if list is longer than 64.

By default, performs an in-place, ascending sort, but you can [change how it works](#do-it-yourself-sorting).

also includes tool for creating superfast hard-coded sorting functions in js.

## Installation

```sh
npm i sorting-networks
```

## Usage 

```javascript
var NetworkSort = require('sorting-networks').sort;
var row = [5,4,3,999,0];
console.log(NetworkSort(row));
//[ 0, 3, 4, 5, 999 ]
```

## Benchmark 

benchmark test vs Array.sort, TimSort, FastSort for 1M random short lists

```javascript
var NetworkSort = require('sorting-networks').sort;
var TimSort = require('timsort').sort;
var FastSort = require('fast-sort').sort;

//generating random lists of numbers...
var numberOfEntries = 999999;
var entriesList = [];
for(var i=0;i<numberOfEntries;i++){
    var row = [];
    var lengthOfEntry = Math.floor(2+60*Math.random());
    for(var j=0;j<lengthOfEntry;j++) {
        row.push(Math.floor(Math.random()*1000));
    }
    entriesList.push(row);
}

var t0=Date.now();

function numberCompare(a,b) {return a-b;}

for(var i=0;i<numberOfEntries;i++){
    var row = entriesList[i];
    NetworkSort(row) //1214ms
    //TimSort(row, numberCompare); //1354ms
    //row = FastSort(row).asc(); //2908ms
    //row.sort(); //3413ms
}

console.log('took',Date.now()-t0);

```

## Sorting by proxy:

Sort one list using the values from another. 

```javascript
var NetworkSort = require('sorting-networks').sort_byProxy;

var listToBeSorted = [1,2,3,4,5]; //eg indices of some objects
var listToSortWith = [9,8,7,6,5] //eg values to compare to do sorting

var res = NetworkSort(listToBeSorted, listToSortWith)
//[ 5, 4, 3, 2, 1 ] 
```

Note: unlike the regular sort, proxy sort only sorts up to length 64, there is no fallback for longer lists.


## Create Hardcoded JS sorting functions

You can generate hardcoded sort functions which will run as much as 2x faster than the generic function included here, but take up a lot of space/code. 

If you are sorting integers, you can optionally employ [xor swaps](https://en.wikipedia.org/wiki/XOR_swap_algorithm). 

```javascript
var sn = require('sorting-networks');
var networkSize = 4; //number of inputs to sort [up to 64]
var isAscending = true; //default true
var useXorSwaps = true; //swap using XOR instead of intermediate variable 
var functionString = sn.generateJsSortFunction(networkSize, isAscending, useXorSwaps);

console.log(functionString);

//resulting string
`function sort4(a){
    if(a[0]>a[2]){a[0]^=a[2]^(a[2]=a[0]);}
    if(a[1]>a[3]){a[1]^=a[3]^(a[3]=a[1]);}
    if(a[0]>a[1]){a[0]^=a[1]^(a[1]=a[0]);}
    if(a[2]>a[3]){a[2]^=a[3]^(a[3]=a[2]);}
    if(a[1]>a[2]){a[1]^=a[2]^(a[2]=a[1]);}
    return a;
}`

//resulting string with xorSwaps = false
`function sort4(a){
    if(a[0]>a[2]){t=a[2];a[2]=a[0];a[0]=t;}
    if(a[1]>a[3]){t=a[3];a[3]=a[1];a[1]=t;}
    if(a[0]>a[1]){t=a[1];a[1]=a[0];a[0]=t;}
    if(a[2]>a[3]){t=a[3];a[3]=a[2];a[2]=t;}
    if(a[1]>a[2]){t=a[2];a[2]=a[1];a[1]=t;}
    return a;
}`

//benchmark -- sorting 1M length-16 lists using hardcoded XOR swaps...
//sort16(row); //184ms
//NetworkSort(row) //383ms
//TimSort(row, numberCompare); //474ms
//row = FastSort(row).asc(); //1181ms
//row.sort(); //1328ms
```

See a huge list of resulting [hardcoded sorting network functions here](https://gist.github.com/stonkpunk/5a34f7dd1e0c64309b0c72b8f564c5c7). 
If you are using integers, see the [versions with XOR swaps](https://gist.github.com/stonkpunk/75f3f9e3cbdd85ade03714f7957fbe33).

These are not included directly in this library in order to save space. 

Make sure to run your own benchmarks to see what runs fastest for you!

## Do-it-yourself sorting

Example of "manually" sorting 16 numbers using a 16-input network.

```javascript
//get the serialized network...
var theNetwork = require('sorting-networks').networks[16]; //networks[x] = data for network with x inputs (x in range 2...64)

//https://ariya.io/2013/10/sorting-networks-using-higher-order-functions-of-javascript-array
function compareswap(array, p, q) { //ascending
    if (array[p] > array[q]) {
        var temp = array[q];
        array[q] = array[p];
        array[p] = temp;
    }
}

function sort(network, entries) {
    var l = network.length;
    for (var i = 0; i < l; i+=2){
        compareswap(entries, network[i], network[i+1])
    }
}

var listToSort = [4,3,2,1,5];

sort(theNetwork, listToSort);

console.log(listToSort); //[1,2,3,4,5]
```

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

