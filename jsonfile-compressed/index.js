var jsh = require('json-shrink');
var fs = require('fs');
var path = require('path');

var write_format = 'binary';
var read_format = 'base64';

function getFileName(inputFileName, doUnPack){
    var parsed = path.parse(inputFileName);
    var fileNameClean = parsed.dir ? parsed.dir + "/" + parsed.name : parsed.name;

    return doUnPack ? `${fileNameClean}.jsonpack.7z` : `${fileNameClean}.json.7z`;
}

module.exports.readFile = function(fileName, doUnPack = true, callback){
    fs.readFile(getFileName(fileName, doUnPack),read_format , (err, data) => {
        var obj = jsh.unshrink(data, doUnPack);
        callback(err,obj);
    });
}

module.exports.writeFile = function(fileName, obj, doPack = true, callback){
    fs.writeFile(getFileName(fileName, doPack),jsh.shrink(obj, false, doPack) , write_format, (err) => {
        callback(err);
    });
}

module.exports.readFileSync = function(fileName, doUnPack = true){
    return jsh.unshrink(fs.readFileSync(getFileName(fileName, doUnPack),read_format), doUnPack);
}

module.exports.writeFileSync = function(fileName, obj, doPack = true){
    fs.writeFileSync(getFileName(fileName, doPack),jsh.shrink(obj, false, doPack), write_format);
}