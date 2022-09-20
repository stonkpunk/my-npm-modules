var psc = require('./index.js');

//plotSimpleChart(
// filename?="chart.png",
// dataTitle0?="data0",
// dataSeriesLabelsX?=genYears(),
// dataSeriesValuesY?=[dataSeriesLabelsX.map(Math.random)]
// dots={}//example use {'rgb(255, 0, 0)': [1,2,3]} to put red dots at index 1,2,3
// width=1400
// height=400
// backgroundColour='white')

var xvalues = ["2000","2001","20002","2003","2004","2005","2006","2007","2008","2009","2010"]; //list of x / time coordinates, date strings etc
var yvalues = xvalues.map(function(x){return Math.random()+100;}); //y values
var yvalues2 = xvalues.map(function(x){return Math.random()+100;}); //y values2

var yObj = {
    stuff: yvalues,
    "other stuff": yvalues2
}

//optional - hack to specific colors for the lines [otherwise random colors are chosen]
// yObj.stuff.color = 'rgb(128, 0, 0)';
// yObj["other stuff"].color = 'rgb(0, 0, 128)';

var dots = { //put colored dots at specified indices
    'rgb(255, 0, 0)': [1,2,3],
    'rgb(0, 255, 0)': [4,5,6],
    'rgb(0, 0, 255)': [7,8,9],
};
var width = 500;
var height = 400;
var bgColor = 'white';
psc.plotSimpleChart("chart.png", xvalues, yObj, dots, width, height, bgColor);