
/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */

function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [r*255,g*255,b*255].map(Math.floor);
}

var shuffle = require('shuffle-array');
var NUM_COLORS = 32;
var colorList = [];
var colorOffset=Math.random();
for(var i=0;i<NUM_COLORS;i++){
    colorList.push(hslToRgb(i*1.0/NUM_COLORS+colorOffset, 0.80, 0.45));
}
colorList=shuffle(colorList);
var colorNo =0;

function randomBrightColor2(){
    colorNo++;
    return colorList[colorNo%colorList.length];
}

const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

function plotSingleDataChart(filename="chart.png", _data, title = 'my dataset', width=500, height=400, backgroundColour='white', foregroundColor = 'rgb(255, 99, 132)'){
    var datasets = [{
        label: title,
        data: _data,
        color: foregroundColor
    }]
    plotMultiDataChart(filename,datasets,width,height,backgroundColour);
}

function plotMultiDataChart(filename="chart.png", datasets, width=500, height=400, backgroundColour='white') {

    //const backgroundColour = 'black'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    const data = {
        datasets: datasets.map(function(ds, i){
            return {
                label: ds.label || ds.title || `data ${i}`,
                data: ds.data,
                backgroundColor: ds.color || randomBrightColor2()
            }
        })
    };

    const configuration = {
        type: 'scatter',
        data: data, //{x,y}
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    type: 'linear',
                    position: 'left'
                }
            },
            elements: {
                point: {
                    backgroundColor: 'black',
                    radius : 2,
                    display: true
                }
            }
        }
    };

    chartJSNodeCanvas.renderToDataURL(configuration).then(function(dataUrl){
        const base64Image = dataUrl

        var base64Data = base64Image.replace(/^data:image\/png;base64,/, "");

        fs.writeFile(filename, base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
    });
}

module.exports = {plotSingleDataChart, plotMultiDataChart};