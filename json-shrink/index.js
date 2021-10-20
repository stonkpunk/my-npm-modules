var jsonpack = require('jsonpack/main');
var lzma = require('lzma');

function shrink(obj, outputAsString = false, doPack = true){
    var theObj = doPack ? jsonpack.pack(obj) : obj;
    var input_str = doPack ? theObj : JSON.stringify(theObj);
    var buf = Buffer.from(lzma.compress(input_str, 9));
    return outputAsString ? buf.toString('base64') : buf;
}

function unshrink(compressed_obj, doUnPack = true){
    compressed_obj = Buffer.isBuffer(compressed_obj) ?  compressed_obj : Buffer.from(compressed_obj, 'base64'); //convert to buffer if it starts off as a string
    var res = doUnPack ? jsonpack.unpack(lzma.decompress(compressed_obj)) : JSON.parse(lzma.decompress(compressed_obj)); //json unpack apparently parses...
    return res;
}

module.exports.shrink = shrink;
module.exports.unshrink = unshrink;
