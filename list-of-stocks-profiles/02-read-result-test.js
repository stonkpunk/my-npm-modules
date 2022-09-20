var jfcb = require('jsonfile-compressed-brotli');
var t0=Date.now();
var res = jfcb.readFileSync("./COMPANY_PROFILES.json");
console.log(res["AAPL"]);
console.log('took', Date.now()-t0);