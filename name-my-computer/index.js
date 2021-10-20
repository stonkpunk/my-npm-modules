var getmac = require('getmac').default;

function myNameIs(salt){
    var Chance = require('chance');
    var chance = new Chance(getmac() + (salt||""));
    var myName = chance.first() +" "+ chance.last();
    return myName;
}

module.exports.getName = myNameIs;