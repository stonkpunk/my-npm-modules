function convertToNMinuteIntervalsFromDate(candles, n, timeRoundingFunction = Math.floor) {
    let results = [];
    let tempCandle = null;
    let nSrcCandles = 0;
    let tempVolume = 0;

    for (let candle of candles) {
        let date = new Date(candle.date);
        let roundedDate = new Date(timeRoundingFunction(date.getTime() / (n * 60000)) * (n * 60000));

        if (tempCandle === null) {
            tempCandle = { ...candle, date: roundedDate.toISOString() };
            tempVolume = candle.volume;
            nSrcCandles = 1;
        } else {
            if (roundedDate.getTime() === new Date(tempCandle.date).getTime()) {
                // Same interval, update high, low and close if necessary, accumulate volume
                if (candle.high > tempCandle.high) tempCandle.high = candle.high;
                if (candle.low < tempCandle.low) tempCandle.low = candle.low;
                tempCandle.close = candle.close;  // last close of the interval
                tempVolume += candle.volume;
                nSrcCandles += 1;
            } else {
                // New interval, add the old tempCandle to results and start a new one
                tempCandle.volume = tempVolume;
                tempCandle.nSrcCandles = nSrcCandles;
                results.push(tempCandle);
                tempCandle = { ...candle, date: roundedDate.toISOString() };
                tempVolume = candle.volume;
                nSrcCandles = 1;
            }
        }
    }

    // Add the last tempCandle to results if it exists
    if (tempCandle !== null) {
        tempCandle.volume = tempVolume;
        tempCandle.nSrcCandles = nSrcCandles;
        results.push(tempCandle);
    }

    return results;
}

function convertToNMinuteIntervalsFromTime(candles, n, timeRoundingFunction = Math.floor) {
  let results = [];
  let tempCandle = null;
  let tempVolume = 0;
  let nSrcCandles = 0;

  for (let candle of candles) {
    let roundedTime = timeRoundingFunction(candle.time / (n * 60)) * (n * 60);

    if (tempCandle === null) {
      tempCandle = { ...candle, time: roundedTime };
      tempVolume = candle.volume;
      nSrcCandles = 1;
    } else {
      if (roundedTime === tempCandle.time) {
        // Same interval, update high, low, and close if necessary, accumulate volume
        if (candle.high > tempCandle.high) tempCandle.high = candle.high;
        if (candle.low < tempCandle.low) tempCandle.low = candle.low;
        tempCandle.close = candle.close; // last close of the interval
        tempVolume += candle.volume;
        nSrcCandles += 1;
      } else {
        // New interval, add the old tempCandle to results and start a new one
        tempCandle.volume = tempVolume;
        tempCandle.nSrcCandles = nSrcCandles;
        results.push(tempCandle);
        tempCandle = { ...candle, time: roundedTime };
        tempVolume = candle.volume;
        nSrcCandles = 1;
      }
    }
  }

  // Add the last tempCandle to results if it exists
  if (tempCandle !== null) {
    tempCandle.volume = tempVolume;
    tempCandle.nSrcCandles = nSrcCandles;
    results.push(tempCandle);
  }

  return results;
}


function convertToNPeriodIntervals(candles, n) {
  let results = [];
  let tempCandle = null;
  let nSrcCandles = 0;
  let tempVolume = 0;

  for (let candle of candles) {
    if (tempCandle === null) {
      tempCandle = { ...candle };
      tempVolume = candle.volume;
      nSrcCandles = 1;
    } else {
      if (nSrcCandles < n) {
        // Same interval, update high, low, and close if necessary, accumulate volume
        if (candle.high > tempCandle.high) tempCandle.high = candle.high;
        if (candle.low < tempCandle.low) tempCandle.low = candle.low;
        tempCandle.close = candle.close; // last close of the interval
        tempVolume += candle.volume;
        nSrcCandles += 1;
      } else {
        // New interval, add the old tempCandle to results and start a new one
        tempCandle.volume = tempVolume;
        tempCandle.nSrcCandles = nSrcCandles;
        results.push(tempCandle);
        tempCandle = { ...candle };
        tempVolume = candle.volume;
        nSrcCandles = 1;
      }
    }
  }

  // Add the last tempCandle to results if it exists
  if (tempCandle !== null) {
    tempCandle.volume = tempVolume;
    tempCandle.nSrcCandles = nSrcCandles;
    results.push(tempCandle);
  }

  return results;
}

module.exports = {convertToNMinuteIntervalsFromDate, convertToNMinuteIntervalsFromTime, convertToNPeriodIntervals}