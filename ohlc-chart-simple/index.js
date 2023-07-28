const vp = require("./volume-profile");
const dvp = require("./draw-profile");
const dc = require("./draw-candles");
const pd = require('pixel-draw');

var config = {
    w: 1024,
    h: 700,
    rects: [],
    lines: [],

    candlePaddingVerticalDollars: 0.01,
    profileBucketsTotal: 32,
    profileBucketsWidth: 64,
    kdePrices: null, //arr of prices to graph as histogram instead of defualt volume profile
    kdeBandwidth: 2, //bandwidth for option kde
    kdeIsGaussian: true, //false = kde is triangular
    volumeBarsHeight: 32,
    bgColor: [255,255,255],

    //alternative to volume profile: arbitrary kernel density histogram
    kdePrices: null,//candles.map(c=>[c.low, 1]),
    kdeBandwidthDollars: 0.00,
    kdeBandwidthPercent: 1.00,
    kdeIsGaussian: true, //false == kernel is triangular
    kdeColor: [0,0,0],

    skipDrawOhlcBars: false,
    skipDrawIndicators: false,
    skipDrawLegend: false,
    expandLegendText: true,
    expandTitle: true,
    expandPrice: true,
    skipDrawDate: false,
    skipDrawPrice: false,
    skipDrawPriceBars: false,
    title: "untitled",
    filename: "candlestick-chart.png",
    canvas: null
}

function drawChartForCandles(candles, _config = {}){
    _config = Object.assign(config,_config);

    var profileBucketsWidth = _config.profileBucketsWidth;
    var w = _config.w-profileBucketsWidth;
    var h = _config.h;

    var canvas = _config.canvas || pd(w+profileBucketsWidth,h, _config.bgColor);

    var profile = profileBucketsWidth>0 ? vp.addCandlesToProfile(candles) : null;
    var priceRange = profileBucketsWidth>0 ? vp.profilePriceRange(profile) : null;

    var profileBucketsTotal = _config.profileBucketsTotal;
    var profileBuckets = profileBucketsWidth>0 ? vp.getProfileBuckets(priceRange, profile, profileBucketsTotal) : null;

    var bottomPartSize = _config.volumeBarsHeight;//32; //__h var from draw-candles

    if(profileBucketsWidth>0){
        if(_config.kdePrices){
            var priceRange = [
                Math.min(...candles.map(c=>c.low)),
                Math.max(...candles.map(c=>c.high))
            ];
            //prices, priceRange, w=512,h=512, _canvas, renderWidth = 32
            canvas = dvp.drawKde(priceRange, _config, canvas);
        }else{
            canvas = dvp.drawProfileBuckets(
                profile,
                profileBuckets,
                w+profileBucketsWidth,
                h/*-bottomPartSize*/,
                canvas,
                _config);
        }
    }

    //blue line is poc, green line is vwap

    var skipDrawBars = _config.skipDrawBars;
    var skipDrawIndicators = _config.skipDrawIndicators;
    canvas = dc.drawCandles(candles,w,h, canvas, _config, skipDrawBars, skipDrawIndicators, bottomPartSize);

    return canvas;
}

function saveChartForCandles(candles, _config){
    var canvas = drawChartForCandles(candles, _config);
    canvas.image.saveAs(_config.filename);
    return canvas;
}

// function saveAnimation(candles, windowSize, config){
//     //todo use pixels-to-video, save gif/webm...
// }

module.exports = {drawChartForCandles, saveChartForCandles};