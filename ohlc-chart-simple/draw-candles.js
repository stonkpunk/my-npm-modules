var pd = require("pixel-draw");
var pu = require('./pt-utils.js');
//var moment = require('moment');

function candlesLowHighRange(candles, padding=0.01){
    //var padding = 0.01; //padding vertical, dollars
    var candlesLowHiVol = candles.map(function(c) {
        var row = [c.low, c.high, c.volume]
        return row;
    });
    var lowHiVolBounds = pu.boundingBlockOfPts_nd(candlesLowHiVol);
    var lowHiRange = [lowHiVolBounds[0][0]-padding, lowHiVolBounds[1][1]+padding]; //lowest low, highest high
    var volRange = [lowHiVolBounds[0][2], lowHiVolBounds[1][2]];
    return {
        price: lowHiRange,
        volume: volRange
    }
}

function drawCandles(candles, w=512,h=512, _canvas=null, config = {}, skipDrawBars = false, skipDrawIndicators, bottomPartSize=32){
    // var candlesLowHiVol = candles.map(function(c) {
    //     var row = [c.low, c.high, c.volume]
    //     return row;
    // });

    var caption = config.title;

    var ranges = candlesLowHighRange(candles, config.candlePaddingVerticalDollars);
    //var lowHiVolBounds = pu.boundingBlockOfPts_nd(candlesLowHiVol);
    //var lowHiRange = [lowHiVolBounds[0][0], lowHiVolBounds[1][1]]; //lowest low, highest high
    var volRange = ranges.volume;//[lowHiVolBounds[0][2], lowHiVolBounds[1][2]];
    var lowHiRange = ranges.price;
    var lowHiDiff = ranges.price[1]-ranges.price[0];
    //console.log('lowHiVolBounds', lowHiVolBounds);
    var cw = Math.max(3,w/candles.length - 2);
    var canvas = _canvas || pd(w,h);

    canvas.priceRange = lowHiRange;

    //canvas.drawRectangle(0,0,w,h,[255,255,255])

    var __h = bottomPartSize; //vol render height

    var gray = [255-64,255-64,255-64];
    var gray2 = [255-16,255-16,255-16];
    function drawPriceBars(dollarsPerBar=10.0){
        //canvas.drawText(`\$${p.toFixed(2)}`,[0,y],gray);
        var _h=h-__h;
        var lo = Math.floor(lowHiRange[0]/dollarsPerBar) * dollarsPerBar;
        var hi = Math.floor(lowHiRange[1]/dollarsPerBar) * dollarsPerBar;
        for(var p=lo;p<=hi;p+=dollarsPerBar){
            var t= (p-lowHiRange[0])/(lowHiDiff);
            if(t>=0 && t<=1.0){
                var y = Math.floor(_h*(1.0-t));
                canvas.drawRectangle(0,y,w,1,gray2);
                canvas.drawText(`${p.toFixed(2)}`,[2,y+3],gray, false);
            }
        }
    }

    function drawPriceAndDate(){
        var lastCandle = candles.slice(-1)[0];
        var timeStr = lastCandle.date || lastCandle.day || lastCandle.time;// || moment.unix(lastCandle.time).format("YYYY-MM-DD HH:mm")
        var lastPrice = lastCandle.close;
        var priceStr = ""+lastPrice.toFixed(2);
        var priceStrPixelWidth = priceStr.length * (config.expandPrice ? 20 : 10);
        var timeStrPixelWidth = timeStr.length * 10;
        var priceStrPixelHeight = config.expandPrice ? 16 : 8;
        var strX = w-priceStrPixelWidth;//-profileRenderWidth;
        var strX2 = w-timeStrPixelWidth;//-profileRenderWidth;
        var strY = 2;
        //var bgColor = [255,255,255];
        var rectPad = 2;
        //canvas.drawRectangle(strX-rectPad,strY-rectPad,priceStrPixelWidth+rectPad,priceStrPixelHeight+rectPad+1,bgColor)
        //canvas.drawRectangle(strX2-rectPad,strY-rectPad+20,priceStrPixelWidth+rectPad,priceStrPixelHeight/2+rectPad+1,bgColor)
        if(!config.skipDrawPrice){
            canvas.drawText(priceStr,[strX+1,strY+1],gray, config.expandPrice);
        }

        if(!config.skipDrawDate){
            canvas.drawText(timeStr,[strX2+1,strY+1+20],gray, false);
        }
    }

    //draw price bars in background

    function getOrderOfMagnitude(){
        var res = 0.01;
        var tries=0;
        var scaleUp = 5.0;
        while(lowHiDiff>res*scaleUp){
            res*=(tries%2==0?5:2);
            tries++;
        }

        return res;
    }

    if(!config.skipDrawPriceBars){
        var priceBarDist = getOrderOfMagnitude();//Math.max(lowHiDiff/5.0,0.01);
        drawPriceBars(priceBarDist);
    }

    //draw price and date info
    drawPriceAndDate();

    //canvas.drawRectangle(0,h-__h,w,__h,[200,200,200]); //vol bars bg color

    var indicatorLegend = {};

    //draw the candles
    candles.forEach(function(candle,i){
        var _h=h-__h;
        var rx = i/candles.length*w;
        var ropen = _h-(candle.open - lowHiRange[0])/lowHiDiff *_h;
        var rclose = _h-(candle.close - lowHiRange[0])/lowHiDiff *_h;
        var rhi = _h-(candle.high - lowHiRange[0])/lowHiDiff *_h;
        var rlow = _h-(candle.low - lowHiRange[0])/lowHiDiff *_h;
        var rvol = candle.volume / volRange[1] *__h;
        var color = candle.open > candle.close ? [255,0,0] : [0,255,0]

        var prevCandle = null;
        var prevRx = null;
        if(i>0){
            prevCandle = candles[i-1];
            prevRx = (i-1)/candles.length*w;
        }

        if(candle.label){
            //Math.min(rhi, rlow)
            var y = Math.floor(Math.min(rhi, rlow)-32);
            canvas.drawText(candle.label, [Math.floor(rx),y],  candle.labelColor || [255,0,0], false);
        }

        canvas.drawRectangle(rx,h-rvol,cw,rvol,color);
        if(!skipDrawBars){
            canvas.drawRectangle(rx,Math.min(ropen, rclose),cw,Math.abs(ropen-rclose),color, true); //open-close thick rect
            canvas.drawRectangle(rx+cw/2-0.5,Math.min(rhi, rlow),1,Math.abs(rhi-rlow),color, true); //hi-low thin rect
        }

        var skipDrawLegend = config.skipDrawLegend;
        var expandLegendText = config.expandLegendText;

        if(!skipDrawIndicators && prevCandle && prevCandle.indicators && candle.indicators){
            for(var indicator in candle.indicators){
                if(!indicator.includes("_color") && !indicator.includes("_thickness")){
                    if(prevCandle.indicators[indicator]){//console.log('indic',indicator);
                        var yIndicator = _h-(candle.indicators[indicator] - lowHiRange[0])/lowHiDiff *_h;
                        var prevYIndicator = _h-(prevCandle.indicators[indicator] - lowHiRange[0])/lowHiDiff *_h;
                        var theLine = [[prevRx+cw/2.0,prevYIndicator],[rx+cw/2.0,yIndicator]];
                        var thickness = 1.0;
                        var icolor = candle.indicators[indicator+"_color"] || [255,0,0];
                        canvas.drawLine(theLine, icolor, candle.indicators[indicator+"_thickness"]==null ? thickness : candle.indicators[indicator+"_thickness"]);
                        if(!skipDrawLegend && !indicatorLegend[indicator]){
                            var tSize = expandLegendText ? 16 : 8;
                            var ox=5;
                            var oy=Object.keys(indicatorLegend).length*tSize+5;
                            indicatorLegend[indicator]=true;
                            canvas.drawText(indicator+"",[ox,oy], icolor, expandLegendText);
                        }
                    }
                }
            }
        }
    });

    //title field in final candle overrides title for graph
    var candleCaption = candles.length>0 ? candles[candles.length-1].title || "" : "";
    caption = candleCaption || caption;

    var expandTitle = config.expandTitle;

    var tWidth = expandTitle ? 20 : 10;

    var captionWidthPixels = caption.length * tWidth;
    canvas.drawText(caption, [w/2-captionWidthPixels/2,2], [0,0,0], expandTitle);

    return canvas;
}

module.exports = {drawCandles, candlesLowHighRange};

// var dc = require('./draw-candles.js');
// var canvas = dc.drawCandles(first10,w,h);
// canvas.image.saveAs('./candles.png');