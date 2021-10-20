var level = require('level');
var deasync = require('deasync');
var async = require('async');
var ngtTool = require('ngt-tool');

var NGT_ID_PREFIX = "NGT_ID_";

//TODO add "update" function -- use ngtTool.removeVectors

function parseIfNotError(key,err,res,cb){
    if(err){
        cb(err,null);
    }else{
        var obj = JSON.parse(res);
        obj.key = key;
        cb(err,obj);
    }
}

function SpatialDbNgt(dbName, numDimensions){
    var theLevelDbName = dbName+'_level_db';
    var theLevelDb = level(theLevelDbName);
    var theNgtIndexName = dbName+'_ngt_db';

    var overwriteExistingDb = false;
    ngtTool.createDb_sync(theNgtIndexName, numDimensions, overwriteExistingDb);

    this.addItemToDb = function(key, jsonStuff, vector, callback){
        var indexName = theNgtIndexName;

        ngtTool.appendVectors(indexName, [vector], function(err,res){
            /*res.parsedOutput = {
            data_load_time_ms: parseFloat(line0Numbers.slice(-1)[0]),
            number_of_objects: parseInt(line1Numbers[0]),
            index_creation_time_ms: parseFloat(lineEndNumbers.slice(-1)[0])
            };*/
            var mostRecentId = res.parsedOutput.number_of_objects;

            async.parallel([function(cb){ //put key for json object at given key
                    theLevelDb.put(key, JSON.stringify({key: key, vector:vector, json: jsonStuff, ngtId: mostRecentId}),  function(err, res){
                        //console.log(`item ${key} added`);
                        cb(err, res);
                    });
                },
                function(cb){ //add json object at NGT key
                    theLevelDb.put(NGT_ID_PREFIX+mostRecentId, JSON.stringify({key: key, vector:vector, json: jsonStuff, ngtId: mostRecentId}),  function(err, res){
                        //console.log(`item ${NGT_ID_PREFIX+mostRecentId} added`);
                        cb(err, res);
                    });
                }
            ], callback);
        });
    };

    function levelDbGetMulti(keys, callback){ //get multi rows from leveldb as object {key1: value1, key2: value2 ... }
        var resObj = {};
        var tasks = keys.map(function(key,i){
            return function(_callback){
                theLevelDb.get(key, function(err, res){
                    resObj[key]=JSON.parse(res);_callback(err,res);
                });
            };
        });
        async.parallelLimit(tasks,10, function(err,res){
            callback(resObj);
        });
    }

    function levelDbPutMulti_doubled(keys, jsonStuff_list, vectors_list, id_list, callback){ //puts 2 copys of the data in leveldb -- at the specified keys, and also at keys corresponding to the NGT ids

        if((keys.length !== id_list.length) || (keys.length !== vectors_list.length) || (keys.length !== jsonStuff_list.length)){
            throw 'levelDbPutMulti_doubled err - all input arrays be same length';
        }

        var vectors_list_doubled = [].concat(vectors_list).concat(vectors_list);
        var keys_doubled = [].concat(keys).concat(id_list.map(function(id){return NGT_ID_PREFIX+id;}));
        var jsonStuff_list_doubled = [].concat(jsonStuff_list).concat(jsonStuff_list);
        var id_list_doubled = [].concat(id_list).concat(id_list);

        var tasks = keys_doubled.map(function(key,i){
            return function(_callback){
                var theJson = {
                    vector:vectors_list_doubled[i],
                    json: jsonStuff_list_doubled[i],
                    ngtId: id_list_doubled[i]
                };
                theLevelDb.put(key, JSON.stringify(theJson),
                    function(err, res){
                    //console.log(`item ${key} added`);
                    _callback(err, res);
                });
            };
        });
        async.parallelLimit(tasks, 10, callback);
    }

    this.addItemsToDb = function(keys, jsonStuff_list, vectors, callback){
        var indexName = theNgtIndexName;

        ngtTool.appendVectors(indexName, vectors, function(err,res){
            /*res.parsedOutput = {
            data_load_time_ms: parseFloat(line0Numbers.slice(-1)[0]),
            number_of_objects: parseInt(line1Numbers[0]),
            index_creation_time_ms: parseFloat(lineEndNumbers.slice(-1)[0])
            };*/
            var mostRecentId = res.parsedOutput.number_of_objects;
            var id_list = keys.map(function(key,i){ //calculate ngt vector ids
                //last item = mostRecentId
                //first item = 1 + mostRecentId - keys.length
                //current item = 1 + mostRecentId - (keys.length-i)
                return 1 + mostRecentId - (keys.length-i);
            });

            levelDbPutMulti_doubled(keys, jsonStuff_list, vectors, id_list, function(_err,_res){
                //console.log("added ids", id_list);
                callback(_err,_res);
            });
        });
    };

    this.addItemsToDbUsingFile = function(keys, jsonStuff_list, vectors, callback){
        var indexName = theNgtIndexName;

        ngtTool.appendVectorsUsingFile(indexName, vectors, function(err,res){
            /*res.parsedOutput = {
            data_load_time_ms: parseFloat(line0Numbers.slice(-1)[0]),
            number_of_objects: parseInt(line1Numbers[0]),
            index_creation_time_ms: parseFloat(lineEndNumbers.slice(-1)[0])
            };*/
            var mostRecentId = res.parsedOutput.number_of_objects;
            var id_list = keys.map(function(key,i){ //calculate ngt vector ids
                //last item = mostRecentId
                //first item = 1 + mostRecentId - keys.length
                //current item = 1 + mostRecentId - (keys.length-i)
                return 1 + mostRecentId - (keys.length-i);
            });

            levelDbPutMulti_doubled(keys, jsonStuff_list, vectors, id_list, function(_err,_res){
                //console.log("added ids", id_list);
                callback(_err,_res);
            });
        });
    };

    this.updateItemJson = function(key, jsonStuff, callback){ //update the json for both keys in the leveldb
        var existingJson = null;
        async.series([
                function(cb){theLevelDb.get(key, function(err, res){existingJson=JSON.parse(res);cb();});},
                //TODO these 2 can be run in parallel
                function(cb){theLevelDb.put(key, JSON.stringify({vector:existingJson.vector, json: jsonStuff, ngtId: existingJson.ngtId}), cb);},
                function(cb){theLevelDb.put(NGT_ID_PREFIX+existingJson.ngtId, JSON.stringify({vector:existingJson.vector, json: jsonStuff, ngtId: existingJson.ngtId}), cb);}
            ], //add to leveldb
            function(err, res){
                //console.log(`item ${key} json updated`);
                callback(err, res);
            });
    };

    this.updateItemJson_sync = deasync(this.updateItemJson);

    this.addItemToDb_sync = deasync(this.addItemToDb);

    this.addItemsToDb_sync = deasync(this.addItemsToDb);

    this.addItemsToDbUsingFile_sync = deasync(this.addItemsToDbUsingFile);

    this.getItemFromDb = function(key, cb){
        // get item from level db [including vector data]
        theLevelDb.get(key,function(err,res){
            parseIfNotError(key,err,res,cb);
        });
    };

    this.getItemFromDb_sync = deasync(this.getItemFromDb);

    this.searchDb_nearestNeighbors = function(vector, numNeighbors, radius, callback){ //only 1 query at a time for now
        ngtTool.searchVectors(theNgtIndexName, numNeighbors, radius, [vector], function(err, res){
            // res.parsedOutput
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

            var distancePerNgtId = {};

            //build map of distances [ngt_id=>distance]
            res.parsedOutput.queries[0].results.forEach(function(ngtResultRow){
                distancePerNgtId[ngtResultRow.id+""]=ngtResultRow.distance;
            });

            var idList = res.parsedOutput.queries[0].results.map(item=>NGT_ID_PREFIX+item.id);

            levelDbGetMulti(idList, function(resObj){
                var resArr = Object.values(resObj).map(function(resultRow){
                    resultRow.distance = distancePerNgtId[resultRow.ngtId+""]; //add back distance
                    return resultRow;
                });

                callback(null, resArr);
            });
        });
    };

    //TODO remove items var res = ngtTool.removeVectors_sync(dbName, [500,501]);

    this.searchDb_nearestNeighbors_sync = deasync(this.searchDb_nearestNeighbors);

    this.ngt_index_name = theNgtIndexName;
    this.leveldb = theLevelDb;
    return this;
}

module.exports = SpatialDbNgt;