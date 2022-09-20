const opentype = require('opentype.js');
var fontName = 'Tuffy_Bold.ttf';
const font = opentype.loadSync(`fonts/${fontName}`);

//https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}


var LZUTF8 = require('lzutf8');


var str = escape(ab2str(font.toArrayBuffer()));//LZUTF8.compress(ab2str(font.toArrayBuffer()),{outputEncoding:"Base64"});//escape();
var fs = require('fs');


var strRes = `

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

STR = unescape("${str}");

module.exports = str2ab(STR);`;

fs.writeFileSync(`./fonts/${fontName}.js`,strRes,'utf8');

console.log();