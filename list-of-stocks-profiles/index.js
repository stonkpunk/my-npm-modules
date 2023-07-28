var jfcb = require('jsonfile-compressed-brotli');
var path = require("path");
var emojisBySector1 = require('./emojis1.js');
var emojisBySector2 = require('./emojis2.js');

var PROFILES = null;

function getMarketCapAtPrice(sym, lastPrice){
    if(!PROFILES){
        throw 'must call loadProfiles() before getSymbolsBySectorObj()';
    }
    var prof = PROFILES[sym];
    if(prof && prof.marketCap){
        var relPrice = lastPrice / prof.price;
        return prof.marketCap * relPrice;
    }
    return -1;
}

function getSymbolsBySectorObj(){
    if(!PROFILES){
        throw 'must call loadProfiles() before getSymbolsBySectorObj()';
    }
    var sectorsObj = {};//"ALL":[]};
    var subsectorsObj = {};
    for(var sym in PROFILES){
        var prof = PROFILES[sym];
        if(prof){
            //sectorsObj["ALL"].push(sym);
            sectorsObj[prof.sector] = sectorsObj[prof.sector] || [];
            sectorsObj[prof.sector].push(sym);
            subsectorsObj[prof.industry] = subsectorsObj[prof.industry] || [];
            subsectorsObj[prof.industry].push(sym);
        }
    }
    return {
        sectors: sectorsObj,
        industries: subsectorsObj
    }
}

function getSectorsObj(){
    if(!PROFILES){
        throw 'must call loadProfiles() before getSymbolsBySectorObj()';
    }
    var sectorsObj = {};//"ALL":[]};
    for(var sym in PROFILES){
        var prof = PROFILES[sym];
        if(prof){
            //sectorsObj["ALL"].push(sym);
            sectorsObj[prof.sector] = sectorsObj[prof.sector] || {};
            sectorsObj[prof.sector][prof.industry] = true;
        }
    }
    return sectorsObj
}

function listOfSymbolsSortedByMarketCap(){
    if(!PROFILES){
        throw 'must call loadProfiles() before listOfSymbolsSortedByMarketCap()';
    }

    var list = [];

    for(SYM in PROFILES){
        var prof = PROFILES[SYM];
        if(prof && prof.marketCap){
            list.push([SYM, prof.marketCap])
        }
    }

    return list.sort(function(a,b){return b[1]-a[1]}).map(r=>r[0]);
}

function listOfProfilesSortedByMarketCap(){
    if(!PROFILES){
        throw 'must call loadProfiles() before listOfProfilesSortedByMarketCap()';
    }
    return listOfSymbolsSortedByMarketCap().map(function(sym){
        return PROFILES[sym];
    })
}

module.exports = {
    loadProfiles: function(){
        PROFILES = jfcb.readFileSync(path.resolve(__dirname, "./COMPANY_PROFILES.json"));

        for(var key in PROFILES){
            var prof = PROFILES[key];
            // console.log(prof, prof.sector, prof.industry, emojisBySector[prof.sector][prof.industry])
            prof.emojiSimple = emojisBySector1[prof.sector][prof.industry];
            prof.emojiComplex = emojisBySector2[prof.sector][prof.industry];
            prof.symbol = key;
        }

        return PROFILES;
    },
    getSymbolsBySectorObj: getSymbolsBySectorObj,
    getMarketCapAtPrice: getMarketCapAtPrice,
    emojisSimple: emojisBySector1,
    emojisComplex: emojisBySector2,
    getSectorsObj,
    listOfSymbolsSortedByMarketCap,
    listOfProfilesSortedByMarketCap
}