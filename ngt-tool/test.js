var ngtTool = require('./index.js');

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
/* result:
{
    data_load_time_ms: 33.4,
    number_of_objects: 11057,
    index_creation_time_ms: 29.274
}
*/

//remove vectors [using list of id's]
var res = ngtTool.removeVectors_sync(dbName, [500,501]);
console.log(res.parsedOutput);
/* result
{
    removed_ids: [ 500, 501 ],
    number_of_objects: 11057,
    data_removing_time: 0.187,
    warnings: [] //warnings will appear if we try to remove nonexistant/already-removed id's
}
*/

//search vectors
var numberOfResults = 5;
var searchRadius = 1.0;
var res = ngtTool.searchVectors_sync(dbName, numberOfResults, searchRadius, listOfQueries);
console.log(res.parsedOutput);

/* result
{
    queries: [
        {
            queryNo: 1,
            results: [
                {"rank":1,"id":2731,"distance":0.340819},
                {"rank":2,"id":5153,"distance":0.344475},
                ...
            ]
        },
        { queryNo: 2, results: [...] }
    ],
    averageQueryTime_ms: 0.1065
}
 */
