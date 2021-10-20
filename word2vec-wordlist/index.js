var jfc = require('jsonfile-compressed');
var f2s = require('float-array-to-string')
var path = require('path');

var UNCOMPRESSED_RESULT = null;

function decompress(callback){
    jfc.readFile(path.resolve(__dirname, 'RESULT_COMPRESSED'),false, function(err,res){
        UNCOMPRESSED_RESULT = res;
        callback(err,res);
    });
}

module.exports.decompress = decompress;
module.exports.getWord = function(word){
    if(!UNCOMPRESSED_RESULT){
        throw 'must decompress data before fetching words'
    }

    if(!UNCOMPRESSED_RESULT[word.toUpperCase()]){
        return null;
    }

    return f2s.decodeFloatArr(UNCOMPRESSED_RESULT[word.toUpperCase()]);
}