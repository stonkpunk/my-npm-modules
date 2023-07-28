# indicator-fvg

tool to tag fair value gaps (FVG's) in OHLCV candles

experimental, use at your own risk

## Installation

```sh
npm i indicator-fvg
```

## Usage 

```javascript
//candles format [{open, high, low, close, volume}]
var candles = require('candles-sample-aapl').loadNMinuteCandles(15).slice(0,1000);

var {getCandlesGaps, allRectsForGaps} = require('indicator-fvg');

//getCandlesGaps(candles, stdSizeThresh=0, stdWindowSize=100, minGapSizeBeforeClose=0.0,)
//minGapSizeBeforeClose = minimum gap size before gap is considered 'closed'
//stdSizeThresh = how many standard deviations above average does a candle need to be to start a gap
//stdWindowSize = window size to calculate std value per-candle [eg rolling window using PRIOR candles only]

candles = getCandlesGaps(candles);

//each candle now has the field .gaps if there is at least 1 gap above or below.
//gaps = object with fields corresponding to the start index of each gap
//eg candle.gaps[gapStartIndex+""] = theGap
//where
//theGap = {startIndex: i, lowPrice: bottomOfGapHere , highPrice: topOfGapHere, color: "red" or "green"}
//
//also on candles that initiate gaps:
//candle.gapStart = theGap;


//now lets plot the gaps for the last 200 candles
var {drawChartForCandles,saveChartForCandles} = require('ohlc-chart-simple');
candles = candles.slice(-200)
var config = {
    w: Math.floor(1024/2),
    h: Math.floor(700/2),
    profileBucketsTotal: 64,
    profileBucketsWidth: 16,
    volumeBarsHeight: 64,
    bgColor: [0,0,0],

    rectsBelow: allRectsForGaps(candles, [150,0,0],[0,64,0]),

    kdePrices: candles.map(c=>[c.low, 1]), //[value, weight]
    kdeBandwidthPercent: 1.00,
    kdeIsGaussian: true, //false == kernel is triangular
    kdeColor: [0,0,255],

    skipDrawOhlcBars: false,
    skipDrawIndicators: false,
    skipDrawLegend: false,
    expandLegendText: false,
    expandTitle: false,
    expandPrice: false,
    skipDrawDate: false,
    skipDrawPrice: false,
    skipDrawPriceBars: false,
    title: "AAPL",
    filename: "./candlestick-chart.png",
}

saveChartForCandles(candles, config);
```

![gaps](https://i.imgur.com/myV3ghU.png)




[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



