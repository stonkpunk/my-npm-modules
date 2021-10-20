var SpatialDbNgt = require('./index.js');
var ngtt = require('ngt-tool');

//create new spatial-db-ngt
var numDimensions = 5;
var sdb = new SpatialDbNgt('mytest',numDimensions);

//add 100 random items with json - one by one
for(var i=0;i<100;i++){
    var itemKey = "my_item"+i;
    var itemJSON = {"something":"stuff"+i};
    var randomVector = ngtt.generateVector(numDimensions); //array of random floats
    sdb.addItemToDb_sync(itemKey, itemJSON, randomVector);

    //note - adding multiple items with the same key will produce
    //multiple vectors associated with the same json object.
    //eg the json data is overwritten but vectors are permanent.
}

//add items, bulk
var keys = ["key1","key2"];
var jsonItems = [{"some1": "json1"},{"some2":"json2"}];
var vectors = ngtt.generateVectorList(numDimensions,jsonItems.length);
sdb.addItemsToDb_sync(keys, jsonItems, vectors);

//update item json
sdb.updateItemJson_sync("my_item32", {"newstuff":"is here now"});

//get item from db
console.log(sdb.getItemFromDb_sync("my_item32"));

//result
/*
{
  vector: [
    0.5486296150852892,
    0.5829361650362115,
    0.5297864223424096,
    0.49587874692720013,
    0.8087344422687666
  ],
  json: { newstuff: 'is here now' },
  ngtId: 35,
  key: 'my_item32'
}
 */


//search for nearest neighbors

var randomSearchVector = ngtt.generateVector(numDimensions); //array of random floats
var numberOfResults = 2;
var radius = 10.0;

console.log(sdb.searchDb_nearestNeighbors_sync(randomSearchVector, numberOfResults, radius));

//result:
/*
[
    {
        vector: [
            0.18625948240313495,
            0.7975673245218937,
            0.3348365678471359,
            0.16693183181406512,
            0.29184773086562577
        ],
        json: { some1: 'json1' },
        ngtId: 1,
        distance: 0.819544
    },
    {
        vector: [
            0.055458120172628966,
            0.9540835249844943,
            0.2664088896698613,
            0.16366906181043261,
            0.7774182161406313
        ],
        json: { some2: 'json2' },
        ngtId: 2,
        distance: 0.82182
    }
]*/

