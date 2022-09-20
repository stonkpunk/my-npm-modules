var fg = require('fast-glob');
var jf = require('jsonfile');
var jfcb = require('jsonfile-compressed-brotli');
var listOfFiles = fg.sync('./results-cache/*.json');

var result = {};

listOfFiles.forEach(function(fileName){
    var sym = fileName.split('results-cache/')[1].replace('.json','');
    console.log(sym);
    var res =  jf.readFileSync(fileName);
    result[sym] = {
        shortName: res.shortName,
        longName: res.longName,
        website: res.website,
        industry: res.industry,
        sector: res.sector,
        longBusinessSummary: res.longBusinessSummary,
        marketCap: res.marketCap ? res.marketCap.raw : -1
    };
});

jfcb.writeFileSync("./COMPANY_PROFILES.json", result);