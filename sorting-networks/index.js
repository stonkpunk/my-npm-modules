const networks = require("./networks.js");
var TimSort = require('timsort').sort;

// function sort(network, entries) {
//     var l = network.length;
//     for (var i = 0; i < l; i+=2){
//         compareswap(entries, network[i], network[i+1])
//     }
// }

//optimized version of the above
function sort2(network, entries) {
    var l = network.length;
    var divBy2 = (network.length/2)%2==0;
    if(!divBy2){
        compareswap(entries, network[0], network[1]);
        for (var i = 2; i < l; i+=2){
            compareswap(entries, network[i], network[i+1])
            i+=2
            compareswap(entries, network[i], network[i+1])
        }
    }else{
        for (var i = 0; i < l; i+=2){
            compareswap(entries, network[i], network[i+1])
            i+=2
            compareswap(entries, network[i], network[i+1])
        }
    }
    return entries;
}

function sort2_proxy(network, entries, fieldArray) {
    var l = network.length;
    var divBy2 = (network.length/2)%2==0;
    if(!divBy2){
        compareswap_byProxy(entries, fieldArray, network[0], network[1]);
        for (var i = 2; i < l; i+=2){
            compareswap_byProxy(entries, fieldArray, network[i], network[i+1])
            i+=2
            compareswap_byProxy(entries, fieldArray, network[i], network[i+1])
        }
    }else{
        for (var i = 0; i < l; i+=2){
            compareswap_byProxy(entries, fieldArray, network[i], network[i+1])
            i+=2
            compareswap_byProxy(entries, fieldArray, network[i], network[i+1])
        }
    }
    return entries;
}

//https://ariya.io/2013/10/sorting-networks-using-higher-order-functions-of-javascript-array
function compareswap(array, p, q) { //ascending
    if (array[p] > array[q]) {
        var temp = array[q];
        array[q] = array[p];
        array[p] = temp;
    }
}


function compareswap_byProxy(array, fieldArray, p, q) { //ascending
    if (fieldArray[p] > fieldArray[q]) {
        var temp = array[q];
        array[q] = array[p];
        array[p] = temp;

        temp = fieldArray[q];
        fieldArray[q] = fieldArray[p];
        fieldArray[p] = temp;
    }
}

function mysort_byProxy(row, proxy){ //sort row -- but compare using values in proxy
    if(row.length<=64){
        sort2_proxy(networks[row.length],row, proxy);
    }else{
        throw 'sort_byProxy cannot sort more than 64 values'
    }
    return row;
}

//TODO merge sort from sets of 64 ?
function mysort(row){
    if(row.length<=64){
        sort2(networks[row.length],row);
    }else{
        TimSort(row);
    }
    return row;
}

function generateJsSortFunction(networkSize, isAscending=true, use_XOR_swaps=false) {
    var network = networks[networkSize];
    var l = network.length;
    //funcNames.push(`sort${networkSize}`);
    var rows=[`function sort${networkSize}(a){\n`];
    for (var i = 0; i < l; i+=2){
        rows.push(use_XOR_swaps ? compStrXOR(network[i], network[i+1], isAscending) : compStr(network[i], network[i+1], isAscending));
    }
    rows.push('return a;\n}')
    return (rows.join(''));
}

function compStr(p,q,isAsc=true){
    return isAsc ? `if(a[${p}]>a[${q}]){t=a[${q}];a[${q}]=a[${p}];a[${p}]=t;}\n` : isAsc`if(a[${p}]<a[${q}]){t=a[${q}];a[${q}]=a[${p}];a[${p}]=t;}\n`;
}

function compStrXOR(p,q){ //this makes for a ASCENDING sort
    return `if(a[${p}]>a[${q}]){a[${p}]^=a[${q}]^(a[${q}]=a[${p}]);}\n`;
}

module.exports.generateJsSortFunction = generateJsSortFunction;
module.exports.networks = networks;
module.exports.sort = mysort;
module.exports.sort_byProxy = mysort_byProxy;