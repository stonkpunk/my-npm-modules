var jf = require('jsonfile');
var fs = require('fs');
var RES = jf.readFileSync(`COMPANY_LIST_FULL.json`);
var STR = `module.exports=${JSON.stringify(RES.slice(0,10000).map(i=>i[0]))};`;
fs.writeFileSync('index.js',STR);