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
var urls = symbols.sort().map(s=>`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${s}?modules=assetProfile%2CsummaryProfile%2CsummaryDetail%2Cprice`)
console.log(urls)

//todo no longer works -- try this instead
// https://query1.finance.yahoo.com/v8/finance/chart/ACRE?modules=assetProfile%2CsummaryProfile%2CsummaryDetail%2Cprice

//more details w url like https://query1.finance.yahoo.com/v10/finance/quoteSummary/AAPL?modules=assetProfile%2CsummaryProfile%2CsummaryDetail%2CesgScores%2Cprice%2CincomeStatementHistory%2CincomeStatementHistoryQuarterly%2CbalanceSheetHistory%2CbalanceSheetHistoryQuarterly%2CcashflowStatementHistory%2CcashflowStatementHistoryQuarterly%2CdefaultKeyStatistics%2CfinancialData%2CcalendarEvents%2CsecFilings%2CrecommendationTrend%2CupgradeDowngradeHistory%2CinstitutionOwnership%2CfundOwnership%2CmajorDirectHolders%2CmajorHoldersBreakdown%2CinsiderTransactions%2CinsiderHolders%2CnetSharePurchaseActivity%2Cearnings%2CearningsHistory%2CearningsTrend%2CindustryTrend%2CindexTrend%2CsectorTrend

var onDownloadedEach = function(url, result){
    try{
        var sym = url.split('quoteSummary/')[1].split('?')[0];

        var obj = JSON.parse(result);
        var assetProfile = obj.quoteSummary.result[0].assetProfile;
        var price = obj.quoteSummary.result[0].price;
        var sd = obj.quoteSummary.result[0].summaryDetail;
        var res = {...price, ...assetProfile, ...sd};
        jf.writeFileSync(`./results-cache/${sym}.json`, res);

        console.log(sym);//, res);//`${url} -- ${result}`);
    }catch(e){

    }
}

var onComplete = function(listOfErrors, listOfResults){
    console.log('all done');
}

dl.downloadListOfUrls(urls, onComplete, onDownloadedEach, 1, 100) //download list of urls, process raw html with callback
