var networks = require('./networks.js')

var funcNames = [];
function sortStr(networkSize) {
    var network = networks[networkSize];
    var l = network.length;
    funcNames.push(`sort${networkSize}`);
    var rows=[`function sort${networkSize}(a){\n`];
    for (var i = 0; i < l; i+=2){
        //compareswap(entries, network[i], network[i+1])
        rows.push(compStrXOR(network[i], network[i+1]));
    }
    rows.push('return a;\n}')
    return (rows.join(''));
}

function compStr(p,q){ //this makes for a ASCENDING sort
    return `if(a[${p}]>a[${q}]){t=a[${q}];a[${q}]=a[${p}];a[${p}]=t;}\n`;
}

function compStrXOR(p,q){ //this makes for a ASCENDING sort
    return `if(a[${p}]>a[${q}]){a[${p}]^=a[${q}]^(a[${q}]=a[${p}]);}\n`;
}

var raw_funcs = '';

for(var i in networks){
    raw_funcs+=sortStr(i)+"\n\n";
}

var template = `var t; //temp
${raw_funcs}

var allSorts = [null,null,${funcNames.join(", ")}];

module.exports = {allSorts, ${funcNames.join(", ")}};
`
require('fs').writeFileSync("hardcoded-sorts.js", template,'utf8')

//see results here https://gist.github.com/stonkpunk/5a34f7dd1e0c64309b0c72b8f564c5c7


