# stock-market-minutes

given a date object or an isostring, return the number of minutes into the market day for US markets 

it runs from 0 to 390 from 930am till 4pm 

returns negative values outside of market hours, indicating the [negative] number of minutes until the next market open

ignores holidays, weekends etc

use at your own risk

## Installation

```sh
npm i stock-market-minutes
```

## Usage 

```javascript
var {getMinutesIntoMarketDay} = require('stock-market-minutes');

var tenAmMondayEst = '2023-06-26T10:00:00-04:00'; //or '2023-06-26T14:00:00Z';
var dateVersion = new Date(tenAmMondayEst);

console.log(getMinutesIntoMarketDay(tenAmMondayEst)); //30
console.log(getMinutesIntoMarketDay(dateVersion)); //30
```

## See Also
- [stock-market-clock](https://www.npmjs.com/package/stock-market-clock) - my older, slower tool w/ some other features


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



