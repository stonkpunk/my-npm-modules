var jfcb = require('jsonfile-compressed-brotli');
var t0=Date.now();
var res = jfcb.readFileSync("./COMPANY_PROFILES.json");
console.log(res["AAPL"]);
console.log('took', Date.now()-t0);

var allCats = {};
for(var sym in res){
    var r = res[sym];
    var f = `${r.sector}|${r.industry}`;
    allCats[f]=allCats[f]||0;
    allCats[f]++;
}
console.log(Object.entries(allCats).sort(function(a,b){return b[1]-a[1];}));