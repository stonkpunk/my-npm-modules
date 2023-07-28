
// Mock candlestick data
function generateFakeCandles(n) {
    let candles = [];
    let currentPrice = 100; // Start price

    for (let i = 0; i < n; i++) {
        let range = Math.random() * 10; // Random range for high/low values
        let range2 = Math.random() * 10;
        let range3 = Math.random() * 10;
        let high = currentPrice + range / 2;
        let low = currentPrice - range2 / 2;
        candles.push({ high: high, low: low })
        // Next candle starts at a random price within the range of the current candle
        currentPrice = low + (Math.random() * range3-range3/2.0);
        currentPrice = Math.max(0.01,currentPrice);
    }

    return candles;
}

let candles = generateFakeCandles(1000); //[{high, low}, ... ]

// Settings for finding pivot highs and lows
let pivotHighSettings = { leftLen: 2, rightLen: 1 };
let pivotLowSettings = { leftLen: 2, rightLen: 1 };

// Use the function
let zones = require('./index.js').supplyAndDemand(candles, pivotHighSettings, pivotLowSettings);

// Log the results
console.log("Demand Zones:", zones.demandZones);
console.log("Supply Zones:", zones.supplyZones);

// Demand Zones: [
//   {
//     left: 86, //units = candle index
//     top: 0.7282760110660691, //units = price
//     right: 101,
//     bottom: -0.326668655917951
//   },
//   {
//     left: 136,
//     top: 0.04575073534033857,
//     right: 151,
//     bottom: -0.3950954198293477
//   },
//   ...
// ]
// Supply Zones: [
//   {
//     left: 14,
//     top: 77.21751270416024,
//     right: 29,
//     bottom: 81.17430799649048
//   },
//   {
//     left: 410,
//     top: 1.792492492359312,
//     right: 425,
//     bottom: 2.7756838024305597
//   }
// ]

