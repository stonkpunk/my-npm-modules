# kd-tree-simple

simple experimental kd tree for sloppy json objects

we have not tested it very thoroughly so use at your own risk

## Installation

```sh
npm i kd-tree-simple
```

## Usage 

```javascript
// quick rundown:

// var {KDTree} = require('kd-tree-simple');
// const kdTree = new KDTree();
// kdTree.add(myObj); //obj can be arbitrary [see Distance Functions section below]
// kdTree.kNearestNeighbors(k, queryObj, distanceFunc=kdTree.distanceEuclidean, addDistanceField=true) //or kdTree.distanceMSE
// var neighboringObjs = kdTree.kNearestNeighbors(2, {x:0, y:0, z:0});

//bigger rundown:

//function to generate random pts {x,y,z} -- note the kdtree can take objects with arbitrary fields
function generatePts(nPts=1000){
    var res = [];
    var s = 5.0;
    for(var i=0; i<nPts; i++){
        res.push(
            {
                x: Math.random()*s-s/2,
                y: Math.random()*s-s/2,
                z: Math.random()*s-s/2
            }
        )
    }
    return res;
}

var {KDTree} = require('kd-tree-simple');
const kdTree = new KDTree();

var pts = generatePts();
pts.forEach(function(pt){
    kdTree.add(pt);
});

var k = 10; //number of nearest neighbors to get
var doAddDistanceField = true; //add .distance to results
var kNearestNeighbors = kdTree.kNearestNeighbors(k,{x: 0, y: 0, z:0}, kdTree.distanceEuclidean, doAddDistanceField);
console.log(kNearestNeighbors[0]);
// {
//     x: 0.012055808991457084,
//     y: 0.08365982534562777,
//     z: 0.12121469453873823,
//     distance: 0.14777452784366815
// }

//notice how if we leave out a field / dimension, it is ignored by the distance function
//we do not need to set a default value, it is as if the field is ignored
var kNearestNeighbors2 = kdTree.kNearestNeighbors(10,{x: 0, y: 0}, kdTree.distanceEuclidean, doAddDistanceField);
console.log(kNearestNeighbors2[0]);
// {
//     x: -0.13236073516600477,
//     y: 0.026111540644320197,
//     z: -0.6416465917338776,
//     distance: 0.13491173695607525 // <<< notice how this distance no longer includes the contribution of the z coordinate
// }

//we can also use kdTree.distanceMSE
```

### Distance functions:

You can specify your own distance function, here's the included ones. Notice how they are apathetic to missing fields and how we can specify a field to be ignored, default `index`.

```javascript
    distanceEuclidean(object1, object2,  indexField='index') { //indexField is field to be ignored
        let sum = 0;

        for (let key in object1) {
            if (key !== indexField && object2.hasOwnProperty(key)) {
                sum += Math.pow(object1[key] - object2[key], 2);
            }
        }

        return Math.sqrt(sum);
    }

    distanceMSE(a, b, indexField='index') {  //indexField is field to be ignored
        let totalError = 0;
        let n = 0;
        const errorPow = 2; //2 = normal mse

        for (let key in a) {
            if (key !== indexField && b.hasOwnProperty(key)) {
                let error = a[key] - b[key];
                totalError += Math.abs(Math.pow(error,errorPow));
                n++;
            }
        }

        var mse = n === 0 ? Infinity : totalError / n;
        return mse;
    }
```

[//]: # ()
[//]: # (## See Also)

[//]: # ()
[//]: # (- [triangle-triangle-intersection]&#40;https://www.npmjs.com/package/triangle-triangle-intersection&#41; - intersection between 2 triangles)

[//]: # (- [triangle-distance]&#40;https://www.npmjs.com/package/triangle-distance&#41; - distance to triangle)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



