var jf = require('jsonfile');
var fs = require('fs');
var RES = jf.readFileSync(`ALL_BRANDS_BY_COUNT.json`);

var companiesSoFarMap = {};

var reformattedList = RES.map(function(r){
    var parts = r[0].split("~");
    var brand = parts[1].replace("by\n    \n    ",""); //correction for video game company names
    var cat = parts[0];
    return [brand,cat,r[1]];
}).filter(function(r){

    if(companiesSoFarMap[r[0]] && r[2] < companiesSoFarMap[r[0]] ){ //each company gets 1 category only -- pick category with greatest # products
        return false;
    }else{
        companiesSoFarMap[r[0]] = r[2];
    }

    return r[0] && r[1] &&
        !r[0].toLowerCase().includes("various") &&
        !r[0].toLowerCase().includes("amazon") &&
        !r[0].toLowerCase().includes("generic") &&
        !r[0].toLowerCase().includes("unknown")
});

var STR = `module.exports=${JSON.stringify(reformattedList.slice(0,40000))};`;
fs.writeFileSync('index.js',STR);