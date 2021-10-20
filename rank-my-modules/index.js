var request = require('request');
var async = require('async');

function downloadListOfUrls(list,cb){
    async.series(list.map(function(url){
        return function(callback){
            request(url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    var result = JSON.parse(body);
                    callback(null, result);
                } else {
                    callback(error, null);
                }
            });
        }
    }),function(err,res){
        cb(err,res.filter(i=>i));
    });
}

module.exports.rank = function(modulesList, cb){
    var urlList = modulesList.map(function(name){
        return `https://api.npmjs.org/downloads/point/1970-01-01:2038-01-19/${name}`;
    })

    downloadListOfUrls(urlList,function(err,res){
        res.sort(function(a,b){return b.downloads-a.downloads});
        var stats = res.map(function(row,i){return [i+1,row.package,row.downloads]})
        stats.unshift(['rank','name','downloads'])
        cb(stats);
    })
}



/*
  [ 1, 'ascii-data-image', 627 ],
  [ 2, 'ngt-tool', 449 ],
  [ 3, 'spatial-db', 289 ],
  [ 4, 'name-my-computer', 155 ],
  [ 5, 'json-shrink', 98 ],
  [ 6, 'jsonfile-compressed', 50 ],
  [ 7, 'spatial-db-ngt', 49 ]
 */