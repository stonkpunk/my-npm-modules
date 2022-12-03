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
        marketCap: res.marketCap ? res.marketCap.raw : -1,
        price: res.regularMarketPrice.raw,
        fiftyDayAverage: res.fiftyDayAverage ? res.fiftyDayAverage.raw : -1,
        twoHundredDayAverage: res.twoHundredDayAverage ? res.twoHundredDayAverage.raw : -1,
        beta: res.beta ? res.beta.raw : null,
        pe: res.trailingPE ? res.trailingPE.raw : null,
        volume: res.volume ? res.volume.raw : -1,
        averageDailyVolume10Day: res.averageDailyVolume10Day ? res.averageDailyVolume10Day.raw : -1,
        bid: res.bid ? res.bid.raw : -1,
        ask: res.ask ? res.ask.raw : -1,
        bidSize: res.bidSize ? res.bidSize.raw : -1,
        askSize: res.askSize ? res.askSize.raw : -1,
        dividendYield: res.dividendYield ? res.dividendYield.raw : -1
    };
});

jfcb.writeFileSync("./COMPANY_PROFILES.json", result);