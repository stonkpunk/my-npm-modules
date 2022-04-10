var NetworkSort = require('./index.js').sort;
var TimSort = require('timsort').sort;
var FastSort = require('fast-sort').sort;
var numberOfEntries = 999999;
var entriesList = [];

var generatedHardCodedFunction = require('./index.js').generateJsSortFunction;

for(var i=0;i<numberOfEntries;i++){
    var row = [];
    var lengthOfEntry = 16;//Math.floor(3+60*Math.random());
    for(var j=0;j<lengthOfEntry;j++) {
        row.push(Math.floor(Math.random()*1000));
    }
    entriesList.push(row);
}

var t0=Date.now();

function numberCompare(a,b) {return a-b;}

for(var i=0;i<numberOfEntries;i++){
    var row = entriesList[i];
    //sort16(row); //184ms for sets of 16 -- hardcoded xor-swap version
    NetworkSort(row) //1214ms for rnd sizes //383ms for 16
    //TimSort(row, numberCompare); //1354ms for rnd sizes //474ms for 16
    //row = FastSort(row).asc(); //2908ms for rnd sizes //1181ms for 16
    //row.sort(); //3413ms for rnd sizes //1328ms for 16
}

console.log('took',Date.now()-t0, entriesList[0]);

// var NetworkSort2 = require('./index.js').sort_byProxy;
//
// var listToBeSorted = [1,2,3,4,5]; //eg indices of some objects
// var listToSortWith = [9,8,7,6,5]; //eg values to compare to do sorting
//
// var res = NetworkSort2(listToBeSorted, listToSortWith)
//
// console.log(res); //[ 5, 4, 3, 2, 1 ]
//
// var networkSize = 4;
// var isAscending = true; //default true
// var functionString = require('./index.js').generateJsSortFunction(networkSize, isAscending);
// console.log(functionString);
//
// var NetworkSort = require('./index').sort;
// var row = [5,4,3,999,0];
// console.log(NetworkSort(row));
//
// var theNetwork = require('./index.js').networks[16]; //networks[x] = data for network with x inputs
//
// //https://ariya.io/2013/10/sorting-networks-using-higher-order-functions-of-javascript-array
// function compareswap(array, p, q) { //ascending
//     if (array[p] > array[q]) {
//         var temp = array[q];
//         array[q] = array[p];
//         array[p] = temp;
//     }
// }
//
// function sort(network, entries) {
//     var l = network.length;
//     for (var i = 0; i < l; i+=2){
//         compareswap(entries, network[i], network[i+1])
//     }
// }
//
// var listToSort = [4,3,2,1,5];
//
// sort(theNetwork, listToSort);
//
// console.log(listToSort);