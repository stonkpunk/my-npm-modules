var SpatialDb = require('./index.js');

//create new spatial-db
var sdb = new SpatialDb('mytest',5);

//add 100 random items with json
for(var i=0;i<100;i++){
    var itemKey = "my_item"+i;
    var itemJSON = {"something":"stuff"+i};
    var randomVector = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];
    sdb.addItemToDb_sync(itemKey, itemJSON, randomVector);

    //adding multiple items with the same key will produce
    //multiple vectors associated with the same json object.
    //eg the json data is overwritten but vectors are permanent.
}

//update item json -- only json can be updated, vectors are write-only!
sdb.updateItemJson_sync("my_item32", {"newstuff":"is here now"});

//get item from db
console.log(sdb.getItemFromDb_sync("my_item32"));

//result:
/*
{
  vector: [
    0.6251483933741744,
    0.681912733394596,
    0.30262664141011064,
    0.5285516253906946,
    0.5946103716557887
  ],
  json: {"newstuff":"is here now"},
  key: 'my_item32'
}
 */

var randomSearchVector = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];

console.log(sdb.searchDb_nearestK_sync(randomSearchVector,2));

//result
/*
[
  {
    vector: [
      0.5802687831117439,
      0.22959325622783533,
      0.9932587519515621,
      0.21296941583182583,
      0.7509834806024658
    ],
    json: { something: 'stuff8' },
    key: 'my_item8',
    distance: 0.5542779655969285
  },
  {
    vector: [
      0.2293377729832502,
      0.3466758935294385,
      0.8654923139164865,
      0.4912195172799616,
      0.746225014024521
    ],
    json: { something: 'stuff86' },
    key: 'my_item86',
    distance: 0.5787423341359789
  }
]
 */

console.log(sdb.searchDb_radius_sync(randomSearchVector,1));

//result:
/*
[
  {
    vector: [
      0.5802687831117439,
      0.22959325622783533,
      0.9932587519515621,
      0.21296941583182583,
      0.7509834806024658
    ],
    json: { something: 'stuff8' },
    key: 'my_item8',
    distance: 0.5542779655969285
  }
]
 */

//delete the database
sdb.deleteDb_sync();
sdb.addItemToDb_sync("okok", {}, [1,2,3,4,5]);