var request = require('request');
var async = require('async');
var cheerio = require('cheerio');

function downloadListOfUrls(list,cbDone,cbEach,limitParallel=1, delayMs=100){
    async.parallelLimit(list.map(function(url){
        return function(callback){
            setTimeout(function(){
                request(url, (error, response, body) => {
                    if (!error && response.statusCode == 200) {
                        var result = body;
                        cbEach(url,body);
                        callback(null, result);
                    } else {
                        callback(error, null);
                    }
                });
            }, delayMs);

        }
    }),limitParallel,function(err,res){
        cbDone(err,res);
    });
}

function downloadListOfUrlsJquery(list, cbDone, cbEach, limitParallel=1, delayMs=100){
    function onDownloaded(url,res){
        var $ = cheerio.load(res);
        cbEach(url,res,$);
    }
    downloadListOfUrls(list, cbDone,onDownloaded, limitParallel, delayMs)
}

module.exports.downloadListOfUrls = downloadListOfUrls;
module.exports.downloadListOfUrlsJquery = downloadListOfUrlsJquery;