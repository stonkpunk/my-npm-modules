
// function that takes an array of OHLCV candles [{open, high, low,...}].
// each candle is represented as a vertical line segment that goes all the way from high to low.
// we then find the horizontal line (price) which intersects the most candles.
// this line is added an array.
// the intersected candles are flagged to be ignored and the procedure is repeated
// with the remaining candles. this is repeated until all candles have been flagged.

//returns format like
// [
//   { price: 145.46, ints: 59 }, //price, intersections
//   { price: 146.18, ints: 48 },
//   { price: 144.99, ints: 39 },
//   { price: 146.82, ints: 34 },
//   { price: 145.86, ints: 33 }
// ]

function maxIntersectionLines(candles, isVolumeWeighted=false, priceStep=0.01, priceDigits=2) {
  const ignoredCandles = [];
  const intersectingLines = [];

  while (ignoredCandles.length < candles.length) {
    let maxIntersections = 0;
    let maxIntersectingPrice = null;
    const intersections = {};

    // Count intersections for each price
    for (const candle of candles) {
      if (ignoredCandles.includes(candle)) continue;

      const { high, low } = candle;
      var nStepsHere = 1.0+(high-low)/priceStep;
      var amt = isVolumeWeighted ? candle.volume/nStepsHere : 1;

      for (let price = low; price <= high; price+=priceStep) {
        var _price = price.toFixed(priceDigits);//console.log(price,_price)

        if (!intersections[_price]) {
          intersections[_price] = amt;
        } else {
          intersections[_price]+=amt;
        }

        if (intersections[_price] > maxIntersections) {
          maxIntersections = intersections[_price];
          maxIntersectingPrice = price;
        }
      }
    }

    // Add max intersecting price to the result array
    intersectingLines.push({price:parseFloat(maxIntersectingPrice.toFixed(2)), ints:intersections[maxIntersectingPrice.toFixed(2)]});

    // Mark intersected candles as ignored
    for (const candle of candles) {
      if (
        !ignoredCandles.includes(candle) &&
        (candle.low <= maxIntersectingPrice && maxIntersectingPrice <= candle.high)
      ) {
        ignoredCandles.push(candle);
      }
    }
  }

  return intersectingLines;
}

module.exports = {maxIntersectionLines}


