# ngt-tool

Unofficial tool for interacting with Yahoo Japan's [NGT Neighborhood Graph and Tree for Indexing High-dimensional Data](https://github.com/yahoojapan/NGT/blob/master/README.md) 

Allows for adding, removing, searching n-dimensional vectors.

Should work on Mac, Linux, possibly Windows via WSL. 

Requires `bash` to be installed on the OS because this tool uses [process substitution](https://en.wikipedia.org/wiki/Process_substitution) to interact with the native `ngt` cli.

Note: `ngt-tool` is not affiliated with Yahoo or Yahoo Japan.

## Installation

First [install ngt](https://github.com/yahoojapan/NGT/blob/master/README.md#Installation).

Then install with npm.
```sh
npm i ngt-tool
```

## Usage

```javascript
var ngtTool = require('ngt-tool');

var numberDimensions = 10;
var dbName = "my_test_ngt";
var overwriteExistingDb = false;
var rndVectorList = ngtTool.generateVectorList(numberDimensions, 1000); //array of vectors [each vector is array of floats]
var listOfQueries = ngtTool.generateVectorList(numberDimensions, 2); //array of queries [each query is array of floats]

//create a db
ngtTool.createDb_sync(dbName, numberDimensions, overwriteExistingDb);

//append vectors
var res = ngtTool.appendVectors_sync(dbName, rndVectorList);
console.log(res.parsedOutput); //raw output is in .rawOutput

//result:
//{
//    data_load_time_ms: 33.4,
//    number_of_objects: 1000,
//    index_creation_time_ms: 29.274
//}

//remove vectors [using list of id's]
var res = ngtTool.removeVectors_sync(dbName, [500,501]);
console.log(res.parsedOutput);

//result
//{
//    removed_ids: [ 500, 501 ],
//    number_of_objects: 1000,   //removed objects still counted here, evidently
//    data_removing_time: 0.187,
//    warnings: [] //warnings will appear if we try to remove nonexistant/already-removed id's
//}


//search vectors
var numberOfResults = 5;
var searchRadius = 1.0;
var res = ngtTool.searchVectors_sync(dbName, numberOfResults, searchRadius, listOfQueries);
console.log(res.parsedOutput);

// result
//{
//    queries: [
//        {
//            queryNo: 1,
//            results: [
//                {"rank":1,"id":2731,"distance":0.340819},
//                {"rank":2,"id":5153,"distance":0.344475},
//                ...
//            ]
//        },
//        { queryNo: 2, results: [...] }
//    ],
//    averageQueryTime_ms: 0.1065
//}


```

## Async functions

Remove `_sync` from the end of function names to get async versions with `callback(err, result)` as the final parameter.

## Where is the data stored?

If you named your database `"mytest"`, then ngt data goes to a folder named `./mytest`

## See Also

- [spatial-db-ngt](https://www.npmjs.com/package/spatial-db-ngt) - use ngt to store JSON documents

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

