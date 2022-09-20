var fs = require('fs');

//csv's downloaded from https://www.nasdaq.com/market-activity/stocks/screener
var nyseList = fs.readFileSync('./nasdaq_screener_nyse.csv','utf8').split('\n').map(r=>r.split(',')[0]).slice(1).map(s=>`${s}`); nyseList.pop();
var nasdaqList = fs.readFileSync('./nasdaq_screener_nasdaq.csv','utf8').split('\n').map(r=>r.split(',')[0]).slice(1).map(s=>`${s}`); nasdaqList.pop();

var jsonList = {
    NYSE: nyseList.map(s=>s.trim()),
    NASDAQ: nasdaqList.map(s=>s.trim())
}

var indexCode =
    `var obj =  ${JSON.stringify(jsonList)};
module.exports = {...obj, fullList: obj.NYSE.concat(obj.NASDAQ)};`

require('fs').writeFileSync('index.js',indexCode,'utf8');


