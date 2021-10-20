var fs = require('fs');
var rimraf = require("rimraf");
var mddf = require('mddf');
var fdstore = require('fd-chunk-store');
var sparse = require('sparse-chunk-store');
var level = require('level');
var deasync = require('deasync');
var async = require('async');
var vectorDistance = require('euclidean-distance');
var ptsPerBlockApprox=1024;

function addDistancesToResults(resultsObjs, srcVector){
    return resultsObjs.map(function(obj){
        obj.distance = vectorDistance(obj.vector, srcVector);
        return obj;
    });
}

function parseIfNotError(key,err,res,cb){
    if(err){
        cb(err,null);
    }else{
        var obj = JSON.parse(res);
        obj.key = key;
        cb(err,obj);
    }
}

function getLevelItemFunction(_theLevelDb,item){
    return function(cb){
        item.data = item.data.toString();
        _theLevelDb.get(item.data,function(err,res){
            parseIfNotError(item.data,err,res,cb);
        });
    };
}

function SpatialDb(dbName, numDimensions){
    var dbIsDeleted = false;
    var dbFileName = dbName + ".mddf";
    var theLevelDbName = dbName+'_level_db';
    var theLevelDb = level(theLevelDbName);
    var theMddf = mddf({
        size: numDimensions*ptsPerBlockApprox*2,
        dim: numDimensions,
        store: sparse(fdstore(numDimensions*ptsPerBlockApprox*2, dbFileName || 'mddf_db.mddf'))
    });

    this.addItemToDb = function(key, jsonStuff, vector, callback){
        if(dbIsDeleted){throw 'cannot add items to deleted database.';}
        var buf = Buffer.from(key, 'utf8');
        async.parallel([
                function(cb){theMddf.put(vector, buf, cb);}, //add to mddf
                function(cb){theLevelDb.put(key, JSON.stringify({vector:vector, json: jsonStuff}), cb);}], //add to leveldb
            function(err, res){
                //console.log(`item ${key} added`);
                callback(err, res);
            });
    };

    this.updateItemJson = function(key, jsonStuff, callback){
        if(dbIsDeleted){throw 'cannot update item in deleted database.';}
        var existingJson = null;
        async.series([
                function(cb){theLevelDb.get(key, function(err, res){existingJson=JSON.parse(res);cb();});}, //add to mddf
                function(cb){theLevelDb.put(key, JSON.stringify({vector:existingJson.vector, json: jsonStuff}), cb);}], //add to leveldb
            function(err, res){
                //console.log(`item ${key} json updated`);
                callback(err, res);
            });
    };

    this.updateItemJson_sync = deasync(this.updateItemJson);

    this.addItemToDb_sync = deasync(this.addItemToDb);

    this.getItemFromDb = function(key, cb){
        if(dbIsDeleted){throw 'cannot get item from deleted database.';}

        // get item from level db [including vector data]
        theLevelDb.get(key,function(err,res){
            parseIfNotError(key,err,res,cb);
        });
    };

    this.getItemFromDb_sync = deasync(this.getItemFromDb);

    this.searchDb_nearestK = function(vector,numNeighbors,callback){
        if(dbIsDeleted){throw 'cannot search deleted database.';}

        theMddf.knn(numNeighbors, vector, function(err, res){
            // get all leveldb records here in parallel
            var levelRequests = res.map(item=>getLevelItemFunction(theLevelDb,item));
            async.parallel(levelRequests,
                function(err, res){
                    callback(err, addDistancesToResults(res,vector));
                });
        });
    };

    this.searchDb_nearestK_sync = deasync(this.searchDb_nearestK);

    this.searchDb_radius = function(vector,radius,callback){
        if(dbIsDeleted){throw 'cannot search deleted database.';}

        theMddf.rnn(radius, vector, function(err, res){
            // get all leveldb records here in parallel
            var levelRequests = res.map(item=>getLevelItemFunction(theLevelDb,item));
            async.parallel(levelRequests,
                function(err, res){
                    callback(err, addDistancesToResults(res,vector));
                });
        });
    };

    this.searchDb_radius_sync = deasync(this.searchDb_nearestK);

    this.deleteDb = function(callback){
        rimraf(`./${theLevelDbName}`, function () {
            fs.unlink(dbFileName, function(_err, _res){
                dbIsDeleted=true;
                if(callback){
                    callback(_err, _res);
                }
            });
        });
    };

    this.deleteDb_sync = deasync(this.deleteDb);

    this.mddf = theMddf;
    this.leveldb = theLevelDb;
    return this;
}

module.exports = SpatialDb;