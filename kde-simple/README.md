# kde-simple

simple 1D kernel density estimation (KDE) with gaussian and triangular kernels

## Installation

```sh
npm i kde-simple
```

## Usage 

```javascript
var {kernelDensityEstimate, getRange} = require('kde-simple');

var useTriangularKernel = true; //if false, uses gaussian kernel
var bandwidth = 1;

//weights affect the size of the samples relative to e/o, but
//the area under the KDE always sums to 1 regardless of weights
var samples = [
    {weight:2,x:0}, //default weight is 1.
    {weight:1,x:2},
    // {weight:2,x:-2}
];

//optional - get y min/max values [min, max] for this kde. 
// this can use this to normalize results by height instead of area
var range = getRange(samples, bandwidth, useTriangularKernel);

var pts =[];
for(var x=-3; x<5; x+=0.02){
    pts.push(
        {
            x: x,
            //get values normalized by area [total area = 1]
            y: kernelDensityEstimate(samples, x, bandwidth, useTriangularKernel) //returns values normalized by total area = 1
            //alt: returns values normalized by height[max height = 1]
            //y: kernelDensityEstimate(samples, x, bandwidth, useTriangularKernel, range) 
        }
    );
}

//save the result as a scatter chart...

//var scs = require('scatter-chart-simple');
//var title = `${samples.length} ${useTriangularKernel ? 'triangle' : 'gaussian'}s bw ${bandwidth}`;
//var resultFile = `./${title}.png`.replace(/ /g,'_');
//var width = 320;
//var height = 240;
//var bgColor = 'white';
//var fgColor = 'rgb(255, 99, 132)'
//scs.plotSingleDataChart(resultFile, pts, title, width, height, bgColor, fgColor)
```


<b>Notice how changing the bandwidth changes the height of the result. 
<br>The total area is always 1. </b>

![graphA](https://i.imgur.com/WW51TB8.png)

![graphA2](https://i.imgur.com/N7QhDGN.png)

![graphC](https://i.imgur.com/4XkgjhX.png)

![graphB](https://i.imgur.com/r1zMSbH.png)

<b>If you want values spanning 0...1 then make sure to include the `range` parameter to normalize results by height instead of area [see code above]</b>

![graphE](https://i.imgur.com/aucLdpi.png)

![graphF](https://i.imgur.com/iZ8ZxEh.png)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



