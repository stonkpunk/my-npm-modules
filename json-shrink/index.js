var jsonpack = require('jsonpack/main');
var lzma = require('lzma');

var emptySpaces = "                                "; //32 spaces -- brotli lib has min size for inputs
var {compress, decompress} = require('brotli');

// const compressedData = compressBr(Buffer.from('some input'));
// const decompressedData = decompressBr(compressedData);

function shrink(obj, outputAsString = false, doPack = true, useBrotli= false){
    var theObj = doPack ? jsonpack.pack(obj) : obj;
    var input_str = doPack ? theObj : JSON.stringify(theObj);

    if(useBrotli){
        var buf = Buffer.from(input_str+emptySpaces);
        var bufc = Buffer.from(compress(buf));
        return outputAsString ? bufc.toString('base64') : bufc;
    }else{
        var buf = Buffer.from(lzma.compress(input_str, 9));
        return outputAsString ? buf.toString('base64') : buf;
    }
}

function unshrink(compressed_obj, doUnPack = true, useBrotli= false){
    if(useBrotli){
        compressed_obj = Buffer.isBuffer(compressed_obj) ?  compressed_obj : Buffer.from(compressed_obj, 'base64'); //convert to buffer if it starts off as a string
        var STR = Buffer.from(decompress(compressed_obj)).toString('utf8').trim();
        var res = doUnPack ? jsonpack.unpack(STR) : JSON.parse(STR); //json unpack apparently parses...
        return res;
    }else{
        compressed_obj = Buffer.isBuffer(compressed_obj) ?  compressed_obj : Buffer.from(compressed_obj, 'base64'); //convert to buffer if it starts off as a string
        var res = doUnPack ? jsonpack.unpack(lzma.decompress(compressed_obj)) : JSON.parse(lzma.decompress(compressed_obj)); //json unpack apparently parses...
        return res;
    }
}

// const * as brotli = require('brotli-wasm');
//
// const compressedData = brotli.compress(Buffer.from('some input'));
// const depressedData = brotli.decompress(compressedData);
//
// console.log(Buffer.from(decompressedData).toString('utf8')); // Prints 'some input'

module.exports.shrink = shrink;
module.exports.unshrink = unshrink;
