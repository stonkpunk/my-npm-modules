// Calculate Exponential Moving Average (EMA)
function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  const ema = [data[0]]; // EMA value for the first data point is the same as the data point itself

  for (let i = 1; i < data.length; i++) {
    ema[i] = (data[i] - ema[i - 1]) * k + ema[i - 1];
  }

  return ema;
}

// Calculate Positive Volume Index (PVI)
function calculatePVI(candles) {
  const pvi = [1000]; // PVI value for the first data point is set to 1000
  for (let i = 1; i < candles.length; i++) {
    const currentVolume = candles[i].volume;
    const previousVolume = candles[i - 1].volume;
    const currentClose = candles[i].close;
    const previousClose = candles[i - 1].close;

    if (currentVolume > previousVolume) {
      const pviValue = pvi[i - 1] + (currentClose - previousClose) / previousClose * pvi[i - 1];
      pvi.push(pviValue);
    } else {
      pvi.push(pvi[i - 1]);
    }
  }
  return pvi;
}

// Calculate Negative Volume Index (NVI)
function calculateNVI(candles) {
  const nvi = [1000]; // NVI value for the first data point is set to 1000
  for (let i = 1; i < candles.length; i++) {
    const currentVolume = candles[i].volume;
    const previousVolume = candles[i - 1].volume;
    const currentClose = candles[i].close;
    const previousClose = candles[i - 1].close;

    if (currentVolume < previousVolume) {
      const nviValue = nvi[i - 1] + (currentClose - previousClose) / previousClose * nvi[i - 1];
      nvi.push(nviValue);
    } else {
      nvi.push(nvi[i - 1]);
    }
  }
  return nvi;
}

function getRange(arr) {
  if (arr.length === 0) {
    return [undefined, undefined];
  }

  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return [min, max];
}

// Calculate Smart/Dumb Money Indicator
function calculateSmartDumbMoneyIndicator(candles, period= 255) {
  const pvi = calculatePVI(candles);
  const nvi = calculateNVI(candles);

  const pviEMA = calculateEMA(pvi, period);
  const nviEMA = calculateEMA(nvi, period);

  const smartMoneyIndicator = nvi.map((nviValue, index) => nviValue - nviEMA[index]);
  const dumbMoneyIndicator = pvi.map((pviValue, index) => pviValue - pviEMA[index]);

  const smartRange = getRange(smartMoneyIndicator);
  const dumbRange = getRange(dumbMoneyIndicator);

  return { smart: smartMoneyIndicator, dumb: dumbMoneyIndicator, pvi, nvi, pviEMA, nviEMA, smartRange, dumbRange };
}

module.exports = {
  indicator: calculateSmartDumbMoneyIndicator
}