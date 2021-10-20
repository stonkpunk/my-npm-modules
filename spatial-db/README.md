# spatial-db

JSON db with n-dimensional nearest neighbors search, combining `mddf` vectors with JSON stored in `leveldb`.

Basically mddf with unlimited JSON payloads.

Designed to be simple and portable; not as fast as `milvus` etc but easier to install.

- This tool is experimental

## Installation

```sh
npm i spatial-db
```

## Usage

```javascript
var SpatialDb = require('spatial-db');

//create new spatial-db with 5 dimensions
var sdb = new SpatialDb('mytest',5);

//add 100 random items with json + vector data
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

/*result:
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

//search for nearest K neighbors 

console.log(sdb.searchDb_nearestK_sync(randomSearchVector,2));

/* result:
[
  {
    vector: [...],
    json: { something: 'stuff8' },
    key: 'my_item8',
    distance: 0.5542779655969285
  },
  {
    vector: [...],
    json: { something: 'stuff21' },
    key: 'my_item21',
    distance: 0.234234223425216
  },
  ...
]
 */

//search for neighbors within radius

console.log(sdb.searchDb_radius_sync(randomSearchVector,1));

/* result:
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

//once deleted the database can no longer be used.
```

Note:

- Multiple vectors can point to the same JSON payload -- The object returned by `getItemFromDb` will only show the most recent vector associated with the JSON, but the search functions will still "catch" the old vectors and link them to the new JSON


- Vectors cannot be removed


- Use `sdb.mddf` and `sdb.leveldb` to access the original mddf and leveldb objects.

## Async functions

Remove `_sync` from the end of function names to get async versions with `callback(err, result)` as the final parameter.

## Where is the data stored?

If you named your database `"mytest"`, then mddf data is stored in a file called `mytest.mddf` and leveldb data goes to a folder named `./mytest`. You can delete both by calling `sdb.deleteDb_sync();`

## See Also

- **[spatial-db-ngt](https://www.npmjs.com/package/spatial-db-ngt)** - uses [NGT]((https://github.com/yahoojapan/NGT/blob/master/README.md)) instead of mddf
- [ngt-tool](https://www.npmjs.com/package/ngt-tool) 


