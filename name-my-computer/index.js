var getmac = require('getmac').default;
var Chance = require('chance');

function myNameIs(salt, mac_override = null){
    var chance = new Chance((mac_override || getmac()) + (salt||""));
    var myName = chance.first() +" "+ chance.last();
    return myName;
}

module.exports.getName = myNameIs;