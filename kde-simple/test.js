var {getRange, kernelDensityEstimate} = require('./index.js');

var useTriangularKernel = false; //if false, uses gaussian kernel
var bandwidth = 0.5;

//weights affect the size of the samples relative to e/o, but
//the area under the KDE always sums to 1 regardless of weights
var samples = [
    {weight:2,x:0}, //default weight is 1.
    {weight:1,x:2},
    // {weight:2,x:-2}
];

//get y min/max values [min, max] for this kde. can use this to normalize results by height instead of by area
var range = getRange(samples, bandwidth, useTriangularKernel);

var pts =[];
for(var x=-3; x<5; x+=0.02){
    pts.push(
        {
            x: x,
            // y: kernelDensityEstimate(samples, x, bandwidth, useTriangularKernel) //returns values normalized by total area = 1
            y: kernelDensityEstimate(samples, x, bandwidth, useTriangularKernel, range) //alt: returns normalized values [max height = 1]
        }
    );
}

//plot and save the result as a scatter chart

var scs = require('scatter-chart-simple');
var title = `${samples.length} ${useTriangularKernel ? 'triangle' : 'gaussian'}s bw ${bandwidth} - normalized by height`;
var resultFile = `./${title}.png`.replace(/ /g,'_');
var width = 320;
var height = 240;
var bgColor = 'white';
var fgColor = 'rgb(255, 99, 132)'

scs.plotSingleDataChart(
    resultFile,
    pts,
    title,
    width,
    height,
    bgColor,
    fgColor
)