// const {compress, decompress} = require('brotli-wasm');
//
// const compressedData = compress(Buffer.from('some input'));
// const decompressedData = decompress(compressedData);
//
// console.log(Buffer.from(decompressedData).toString('utf8')); // Prints 'some input'
//^ memory errors after multiple uses?

var brotli = require('brotli');

var emptySpaces = "                                "; //32 spaces
const compressedData = brotli.compress(Buffer.from('some input'+emptySpaces)); //buffer must be at least 28 chars?

console.log('compressed result',compressedData);
const decompressedData = brotli.decompress(compressedData);

console.log(Buffer.from(decompressedData).toString('utf8').trim()); // Prints 'some input'
