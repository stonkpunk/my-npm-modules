var jsh = require('json-shrink');
var fs = require('fs');
var path = require('path');

var write_format = 'binary';
var read_format = 'base64';

var doUseBrotli = true;

function getFileName(inputFileName, doUnPack){
    var parsed = path.parse(inputFileName);
    var fileNameClean = parsed.dir ? parsed.dir + "/" + parsed.name : parsed.name;

    return doUnPack ? `${fileNameClean}.jsonpack.br` : `${fileNameClean}.json.br`;
}

module.exports.readFile = function(fileName, doUnPack = false, callback){
    fs.readFile(getFileName(fileName, doUnPack),read_format , (err, data) => {
        var obj = jsh.unshrink(data, doUnPack, doUseBrotli);
        callback(err,obj);
    });
}

module.exports.writeFile = function(fileName, obj, doPack = false, callback){
    fs.writeFile(getFileName(fileName, doPack),jsh.shrink(obj, false, doPack, doUseBrotli) , write_format, (err) => {
        callback(err);
    });
}

module.exports.readFileSync = function(fileName, doUnPack = false){
    return jsh.unshrink(fs.readFileSync(getFileName(fileName, doUnPack),read_format), doUnPack, doUseBrotli);
}

module.exports.writeFileSync = function(fileName, obj, doPack = false){
    fs.writeFileSync(getFileName(fileName, doPack),jsh.shrink(obj, false, doPack, doUseBrotli), write_format);
}