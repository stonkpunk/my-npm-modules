//simplified js version of the [MZ RVSI indicator by MightyZinger], js port by stonkpunk
//original copyright
// This source code is subject to the terms of the Mozilla Public License 2.0 at https://mozilla.org/MPL/2.0/
// © MightyZinger
// see original pinescript code at original.txt

function toHeikinAshi(candles) {
  const heikinAshiCandles = [];

  for (let i = 0; i < candles.length; i++) {
    const currentCandle = candles[i];
    const previousCandle = i > 0 ? heikinAshiCandles[i - 1] : null;

    const haCandle = {};

    haCandle.close = (currentCandle.open + currentCandle.high + currentCandle.low + currentCandle.close) / 4;

    if (previousCandle) {
      haCandle.open = (previousCandle.open + previousCandle.close) / 2;
      haCandle.high = Math.max(currentCandle.high, haCandle.open, haCandle.close);
      haCandle.low = Math.min(currentCandle.low, haCandle.open, haCandle.close);
    } else {
      haCandle.open = (currentCandle.open + currentCandle.close) / 2;
      haCandle.high = Math.max(currentCandle.high, haCandle.open, haCandle.close);
      haCandle.low = Math.min(currentCandle.low, haCandle.open, haCandle.close);
    }

    haCandle.volume = currentCandle.volume; // Include volume

    heikinAshiCandles.push(haCandle);
  }

  return heikinAshiCandles;
}

function obv(candles) {
  const obvValues = [];
  let obv = 0;

  for (let i = 0; i < candles.length; i++) {
    const currentCandle = candles[i];
    const previousCandle = i > 0 ? candles[i - 1] : null;

    if (previousCandle) {
      const closeChange = currentCandle.close - previousCandle.close;
      const sign = Math.sign(closeChange);
      obv += sign * currentCandle.volume;
    }

    obvValues.push(obv);
  }

  return obvValues;
}

//see https://www.fidelity.com/learning-center/trading-investing/technical-analysis/technical-indicator-guide/hull-moving-average
function hma(values, period) {
  const halfLength = Math.floor(period / 2);
  const sqrtLength = Math.floor(Math.sqrt(period));
  const wmaHalfPeriod = multiplyArrayByConstant(wma(values, halfLength),2);
  const wmaPeriod = wma(values, period);
  const diffArr = subtractArrays2(wmaHalfPeriod, wmaPeriod);
  const hma = wma(diffArr, sqrtLength);
  return hma;
}

function multiplyArrayByConstant(array, constant) {
  return array.map(value => value * constant);
}

function wma(values, period) {
  const weights = Array.from({ length: period }, (_, i) => i + 1);
  const sumOfWeights = weights.reduce((a, b) => a + b, 0);

  const wma = [];

  for (let i = period - 1; i < values.length; i++) {
    const subset = values.slice(i - period + 1, i + 1);
    const weightedSum = subset.reduce((a, b, j) => a + b * weights[j], 0);
    const weightedAverage = weightedSum / sumOfWeights;
    wma.push(weightedAverage);
  }

  return wma;
}

function subtractArrays(array1, array2) {
  const result = [];
  for (let i = 0; i < array1.length; i++) {
    result.push(array1[i] - array2[i]);
  }
  return result;
}

function subtractArrays2(array1, array2) {
  //assuming array2 is shorter, "shift" array2 to the end of array1, discard the extra from array1
  return subtractArrays(array1.slice(-array2.length),array2);
}

function rsi(values, period) {
  let gains = [];
  let losses = [];

  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    gains[i] = Math.max(0, diff);
    losses[i] = Math.max(0, -diff);
  }

  let avgGain = sma(gains.slice(1, period + 1), period)[0];
  let avgLoss = sma(losses.slice(1, period + 1), period)[0];

  let rs = avgGain / avgLoss;
  let rsi = [100 - (100 / (1 + rs))];

  for (let i = period + 1; i < values.length; i++) {
    avgGain = ((avgGain * (period - 1)) + gains[i]) / period;
    avgLoss = ((avgLoss * (period - 1)) + losses[i]) / period;

    rs = avgGain / avgLoss;
    rsi.push(100 - (100 / (1 + rs)));
  }

  return rsi;
}

function sma(values, period) {
  const sma = [];

  for (let i = 0; i < values.length; i++) {
    const startIdx = i - period + 1 >= 0 ? i - period + 1 : 0;
    const sum = values.slice(startIdx, i + 1).reduce((a, b) => a + b, 0);
    const avg = sum / Math.min(i + 1, period);
    sma.push(avg);
  }

  return sma;
}

function zeroPadArray(array, N) {
  while (array.length < N) {
    array.unshift(0);
  }
  return array;
}

function calculateRVSI(candles, rvsiLen=14, doZeroPad = true) {
  // Convert candles to Heikin Ashi
  var heikinAshiCandles = toHeikinAshi(candles);

  // hull moving average of on-balance volume
  var volMA = hma(obv(heikinAshiCandles), rvsiLen);

  // RSI of Volume Oscillator Data
  var rsiVol = rsi(volMA, rvsiLen);

  // Calculate RVSI
  var rvsi = hma(rsiVol, rvsiLen);

  var padding = {volMA:0, rsivol:0, rvsi:0};

  if(doZeroPad){
      if(volMA.length<candles.length){
        padding.volMA = candles.length - volMA.length;
        volMA = zeroPadArray(volMA,candles.length);
      }
      if(rsiVol.length<candles.length){
        padding.rsivol = candles.length - rsiVol.length;
        rsiVol = zeroPadArray(rsiVol,candles.length);
      }
      if(rvsi.length<candles.length){
        padding.rvsi = candles.length - rvsi.length;
        rvsi = zeroPadArray(rvsi,candles.length);
      }
  }

  return {rsiVol,rvsi,volMA,heikinAshiCandles, zeroPaddingAmount:padding};
}

module.exports = {calculateRVSI}
