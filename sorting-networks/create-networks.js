//based on networks from https://bertdobbelaere.github.io/sorting_networks_extended.html
var netStrings = require('./sorting-network-strings.js'); //get this file from https://gist.github.com/stonkpunk/0e1423ff209f0ca4f7f87564380dc17c

var networks = {};

for(var i in netStrings){
    var origStr = netStrings[i].replace(/\(/g,"[").replace(/\)/g,"]").replace(/\n/g,",");
    origStr = `[${origStr}]`;
    var network = [].concat(...[].concat(...JSON.parse(origStr)))
    networks[i] = network;
}

//console.log(networks);

require('fs').writeFileSync('networks.js',`module.exports = ${JSON.stringify(networks)};`);
