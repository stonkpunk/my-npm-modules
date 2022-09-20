var async = require('async');
var fg = require('fast-glob');
var rfz = require('read-file-from-zip');

function searchForTerms(terms, list){
    if(Array.isArray(terms)){

    }else{
        terms = [terms];
    }
    return list.filter(function(row){

        if(row[1]=='directory'){
            return false;
        }

        for(var i=0;i<terms.length;i++){
            if(!row[0].includes(terms[i])){
                return false;
            }
        }
        return true;
    });
}

function search(_folderPath, terms, callback){
    var folderPath = _folderPath.replace(/\/$/, ""); //remove trailing slash

    function onGotZips(zipFiles){

        var filesPerZip = {};

        var fileTasks = zipFiles.map(function(zipFile){
            return function(cb){
                rfz.readFileFromZip(zipFile, "", function(err, files){
                    filesPerZip[zipFile] = files;
                    cb();
                });
            }
        });

        var res = [];
        async.series(fileTasks, function(){
            for(var zipFile in filesPerZip){
                var fileList = filesPerZip[zipFile];
                res.push(...searchForTerms(terms, fileList).map(function(row){
                    return [zipFile,row[0],row[1]]
                }));
            }
            callback(null,res);
        })
    }

    if(_folderPath.endsWith(".zip")){
        var zipFiles=[folderPath];
        onGotZips(zipFiles);
    }else{
        fg(`${folderPath}/**/*.zip`).then(onGotZips);
    }
}

var searchSync = require('deasync')(search);

module.exports = {search, searchSync};
