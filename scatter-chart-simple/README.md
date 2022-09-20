# scatter-chart-simple

very simple 2d scatter chart with colored dots for nodejs.

## Installation

```sh
npm i scatter-chart-simple
```

## Usage 

```javascript
var scs = require('./index.js');

//scs.plotSingleDataChart(
// filename?="chart.png",
// data=[{x,y}],
// title? = 'my dataset',
// width?=500
// height?=400
// backgroundColour='white'
// foregroundColor? = 'rgb(255, 99, 132)'
// )

//scs.plotMultiDataChart(
// filename?="chart.png",
// data=[{title, data, color}],
// width?=500
// height?=400
// backgroundColour?='white'
// )

var data1 = [];
var data2 = [];
for(var i=0;i<1000;i++){
    data1.push(
        {
            x: Math.random()*5,
            y: Math.random()*5
        }
    );

    data2.push(
        {
            x: Math.random()*5,
            y: Math.random()*5
        }
    );
}

scs.plotSingleDataChart("chart.png", data1, 'test1');

var datasets = [
    {
        title: 'green stuff',
        data: data1,
        color: 'green'
    },
    {
        title: 'red stuff',
        data: data2,
        color: 'red'
    }
]

scs.plotMultiDataChart("chart2.png", datasets);
```

![result](https://i.imgur.com/p2vYAnf.png)

![result2](https://i.imgur.com/hRyphzT.png)


## See Also

- [line-chart-simple](https://www.npmjs.com/package/line-chart-simple) 





[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

