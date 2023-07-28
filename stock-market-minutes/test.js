var {getMinutesIntoMarketDay} = require('./index.js');

var tenAmMondayEst = '2023-06-26T10:00:00-04:00'; //or '2023-06-26T14:00:00Z';
var dateVersion = new Date(tenAmMondayEst);

console.log(getMinutesIntoMarketDay(tenAmMondayEst)); //30
console.log(getMinutesIntoMarketDay(dateVersion)); //30