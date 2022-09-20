var symbols = require('list-of-stocks').fullList;
var dl = require('dl-list-of-urls');
var fs = require('fs');
var jf = require('jsonfile');

symbols = symbols.filter(function(s){
    var doSkip = fs.existsSync(`./results-cache/${s}.json`);
    if(doSkip){
        console.log('skip',s)
    }
    return !doSkip;
});
var urls = symbols.sort().map(s=>`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${s}?modules=assetProfile%2Cprice`)

var onDownloadedEach = function(url, result){
    try{
        var sym = url.split('quoteSummary/')[1].split('?')[0];

        var obj = JSON.parse(result);
        var assetProfile = obj.quoteSummary.result[0].assetProfile;
        var price = obj.quoteSummary.result[0].price;
        var res = {...price, ...assetProfile};
        jf.writeFileSync(`./results-cache/${sym}.json`, res);

        console.log(sym);//`${url} -- ${result}`);
    }catch(e){

    }
}

var onComplete = function(listOfErrors, listOfResults){
    console.log('all done');
}

dl.downloadListOfUrls(urls, onComplete, onDownloadedEach, 1, 100) //download list of urls, process raw html with callback
