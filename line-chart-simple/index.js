
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

function genYears(){
    var res = [];
    for(var i=0;i<100;i++){
        res.push(i+2000);
    }
    return res;
}

// var datasets = {
//     sample1: {
//         labelsX: [n],
//         valuesY: [n]
//     }
// }
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

function plotSimpleChart(filename="chart.png", dataSeriesLabelsX=genYears(), dataSeriesValuesYObj={stuff:dataSeriesLabelsX.map(Math.random)}, _colorsMap={}, width=1400, height=400, backgroundColour='white'){

    var colorsMap = {};

    for(var color in _colorsMap){
        colorsMap[color] = new Set(_colorsMap[color]);
    }

    //we now do highlights by color like so
    // colorsMap = {
    //     'rgb(255, 102, 255)': [1,2,3]
    //      ...
    // }

    //https://stackoverflow.com/questions/15477008/how-to-create-charts-using-nodejs
    // Install libs with: npm i chartjs-node-canvas chart.js
    // Docs https://www.npmjs.com/package/chartjs-node-canvas
    // Config documentation https://www.chartjs.org/docs/latest/axes/

    //const backgroundColour = 'black'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

    var yMin = 999999999999999;

    const configuration = {
        type: 'line',   // for line chart
        data: {
            labels: dataSeriesLabelsX,//[2018, 2019, 2020, 2021],
            datasets: Object.entries(dataSeriesValuesYObj).map(function(keyValue,i){
                var c = randomBrightColor2();
                yMin = Math.min(yMin, ...dataSeriesValuesYObj[keyValue[0]]);
                return {
                        label: keyValue[0],
                        data: keyValue[1],
                        fill: false,
                        borderColor: [dataSeriesValuesYObj[keyValue[0]].color || `rgb(${c[0]}, ${c[1]}, ${c[2]})`],
                        borderWidth: 0.5,
                        xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
                    }
            })
            // datasets: [{
            //     label: dataTitle0,
            //     data: dataSeriesValuesY,
            //     fill: false,
            //     borderColor: ['rgb(51, 204, 204)'],
            //     borderWidth: 1,
            //     xAxisID: 'xAxis1' //define top or bottom axis ,modifies on scale
            // },
                // {
                //     label: "Sample 2",
                //     data: dataSeriesValuesY.map(Math.random),
                //     fill: false,
                //     borderColor: ['rgb(255, 102, 255)'],
                //     borderWidth: 1,
                //     xAxisID: 'xAxis1'
                // },
           // ],

        },
        options: {
            scales: {
                y: {
                    suggestedMin: yMin,
                },
            },
            elements: {
                point: {
                    backgroundColor: customColor,
                    radius : customRadius,
                    display: true
                }
            }
        }
    }

    function customColor( context )
    {
        let index = context.dataIndex;
        let value = context.dataset.data[ index ];

        for(var color in colorsMap){
            if(colorsMap[color] && colorsMap[color].has(index)){
                return color; //'rgb(255, 0, 0)';
            }
        }

        return 'rgb(128, 128, 128)';
    }

    function customRadius( context )
    {
        //console.log(context)
        let index = context.dataIndex;

        for(var color in colorsMap){
            if(colorsMap[color] && colorsMap[color].has(index)){
                return 6; //'rgb(255, 0, 0)';
            }
        }

        return 1;
    }

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

module.exports = {plotSimpleChart};