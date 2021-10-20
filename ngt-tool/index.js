//https://github.com/yahoojapan/NGT
//https://github.com/yahoojapan/NGT/blob/master/bin/ngt/README.md#command

//we are using pseudofiles in memory like this https://unix.stackexchange.com/questions/63923/pseudo-files-for-temporary-data

//ngt cmd line cheatsheet:
    //create index
        //ngt create -d no_of_dimensions INDEX_NAME
    //append
        //ngt append INDEX_NAME FILENAME.tsv
    //search
        //ngt search [-n no_of_search_results] [-r search_radius] INDEX_NAME FILENAME_WITH_QUERIES.tsv
    //remove
        //ngt remove [-d object_id_specification_method f|d ] INDEX_NAME FILE_NAME_WITH_IDS|INDEX_NAME

var fs = require('fs');
var deasync = require('deasync');
var child_process = require('child_process');

function createDb(indexName, no_of_dimensions, overwriteExisting, callback){
    fs.access(`./${indexName}`, error => {
        if (!error) {
            if(overwriteExisting){
                console.warn("ngt-tool -- overwriting existing db");
                _createTheDb();
            }else{
                console.warn(`ngt-tool -- ngt db "${indexName}" already exists! skipping create.`);
                if(callback){
                    callback();
                }
            }
        } else {
            _createTheDb();
        }
    });

    function _createTheDb(){
        var createDbCmd = `ngt create -d ${no_of_dimensions} ${indexName}`; //deletes existing db!
        child_process.exec(createDbCmd,{ "shell": "/bin/bash" },function(error, stdout, stderr){
            var res = {
                err: error,
                stdout:stdout,
                stderr:stderr //for some reason ngt prints stuff to stderr?
            };
            if(callback){
                callback(null, res);
            }
        });
    }
}

function appendVectors(indexName, vectors, callback){
    var vectorsStr = vectors.map(function(vector){return vector.join('\t');}).join('\n');
    var appendCmdInline = `ngt append ${indexName} <(echo "${vectorsStr}")`; //1 2 3 4 5 6 7 8 9 10
    child_process.exec(appendCmdInline,{ "shell": "/bin/bash" },function(error, stdout, stderr){
        var res = {
            rawOutput:{
                err: error,
                stdout:stdout,
                stderr:stderr //for some reason ngt prints stuff to stderr?
            }
        };

        res = parseAppendCmdOutput(res);

        if(callback){
            callback(null, res);
        }
    });
}

function appendVectorsUsingFile(indexName, vectors, callback){
    var vectorsStr = vectors.map(function(vector){return vector.join('\t');}).join('\n');

    var fileName = `./TEMP__${Date.now()}.tsv`;

    var appendCmdInline = `ngt append ${indexName} ${fileName}`; //1 2 3 4 5 6 7 8 9 10

    fs.writeFile(fileName, vectorsStr, 'utf8', function(err,res){
        child_process.exec(appendCmdInline,{ "shell": "/bin/bash" },function(error, stdout, stderr){
            var res = {
                rawOutput:{
                    err: error,
                    stdout:stdout,
                    stderr:stderr //for some reason ngt prints stuff to stderr?
                }
            };

            res = parseAppendCmdOutput(res);

            fs.unlink(fileName,function(){});

            if(callback){
                callback(null, res);
            }
        });

    });

}

function removeVectors(indexName, id_list, callback){
    var id_list_str = id_list.join('\n');
    var removeCmdInline = `ngt remove -d f ${indexName} <(echo "${id_list_str}")`; //each one is an id

    child_process.exec(removeCmdInline,{ "shell": "/bin/bash" },function(error, stdout, stderr){
        var res = {
            rawOutput:{
                err: error,
                stdout:stdout,
                stderr:stderr //for some reason ngt prints stuff to stderr?
            }
        };

        res = parseRemoveCmdOutput(res);

        if(callback){
            callback(null, res);
        }
    });
}

function searchVectors(indexName, number_search_results, search_radius, query_list, callback){
    var query_list_str = query_list.map(function(vector){return vector.join('\t');}).join('\n');
    var searchCmdInline = `ngt search -n ${number_search_results || "0"} -i t -r ${search_radius || "0"} ${indexName} <(echo "${query_list_str}")`; //query per line with \n seperators
    child_process.exec(searchCmdInline,{ "shell": "/bin/bash" },function(error, stdout, stderr){
        var res = {
            rawOutput:{
                err: error,
                stdout:stdout,
                stderr:stderr //for some reason ngt prints stuff to stderr?
            }
        };
        res = parseQueryCmdOutput(res);
        if(callback){
            callback(null, res);
        }
    });
}

var createDb_sync = deasync(createDb);
var appendVectors_sync = deasync(appendVectors);
var removeVectors_sync = deasync(removeVectors);
var searchVectors_sync = deasync(searchVectors);

function extractNumbers(str){
    //https://stackoverflow.com/questions/638565/parsing-scientific-notation-sensibly
    var regex = /[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?/g;
    var res = str.match(regex).map(str=>parseFloat(str));
    return res;
}

function parseAppendCmdOutput(outputObj){

    //append cmd output: [im not sure why things end up in stderr for some cmds...]
    /*
    {
      err: null,
      stdout: '',
      stderr: 'Data loading time=4.2e-05 (sec) 0.042 (msec)\n' +
        '# of objects=15\n' +
        'Index creation time=0.001733 (sec) 1.733 (msec)\n'
    }
    */

    var outputStr = outputObj.rawOutput.stderr;
    var outputIsExpectedFormat = outputStr.includes("Data loading time=") && outputStr.includes("Index creation time=");
    if(!outputIsExpectedFormat){
        console.warn("ngt-tool append -- unexpected output format, skipping parse.");
        return outputObj;
    }

    var lines = outputStr.split('\n');
    var line0Numbers = extractNumbers(lines[0]); //'Data loading time=4.2e-05 (sec) 0.042 (msec)\n'
    var line1Numbers = extractNumbers(lines[1]); //'# of objects=15\n' +
    var lineEndNumbers = extractNumbers(lines[2]); //'Index creation time=0.001733 (sec) 1.733 (msec)\n'

    outputObj.parsedOutput = {
        data_load_time_ms: parseFloat(line0Numbers.slice(-1)[0]),
        number_of_objects: parseInt(line1Numbers[0]),
        index_creation_time_ms: parseFloat(lineEndNumbers.slice(-1)[0])
    };

    return outputObj;
}

function parseRemoveCmdOutput(outputObj){

    //remove cmd output -- inline file
    /*
    {
      err: null,
      stdout: '',
      stderr: 'removed ID=1\n' +
        'removed ID=2\n' +
        'removed ID=3\n' +
        'removed ID=4\n' +
        'removed ID=5\n' +
        'removed ID=6\n' +
        'removed ID=7\n' +
        'removed ID=8\n' +
        'removed ID=9\n' +
        'removed ID=10\n' +
        'Warning: Cannot remove the node. ID=1 : /tmp/ngt-20210127-7290-1xtpniq/NGT-1.13.3/lib/NGT/Common.h:1769: get: Not in-memory or invalid offset of node. idx=1 size=10\n' +
        'Warning: Cannot remove the node. ID=5 : /tmp/ngt-20210127-7290-1xtpniq/NGT-1.13.3/lib/NGT/Common.h:1769: get: Not in-memory or invalid offset of node. idx=5 size=10\n' +
        'removeEdgesReliably : Warning! : No edges. ID=9\n' +
        'Warning: Cannot remove the node. ID=10 : /tmp/ngt-20210127-7290-1xtpniq/NGT-1.13.3/lib/NGT/Common.h:1769: get: Not in-memory or invalid offset of node. idx=10 size=10\n' +
        'Data removing time=0.000206 (sec) 0.206 (msec)\n' +
        '# of objects=9\n'
    }
     */

    var outputStr = outputObj.rawOutput.stderr;
    var outputIsExpectedFormat = outputStr.includes("Data removing time=") && outputStr.includes("# of objects=");
    if(!outputIsExpectedFormat){
        console.warn("ngt-tool removeItem -- unexpected output format, skipping parse.");
        return outputObj;
    }

    var lines = outputStr.split('\n');

    var lines_removedIds = lines.filter(line=>line.includes('removed ID='));
    var removed_ids = lines_removedIds.map(str=>parseInt(extractNumbers(str)[0]));

    var lines_warnings = lines.filter(line=>line.includes('Warning'));

    var line_numberObjects = lines.filter(line=>line.includes('# of objects='))[0];
    var numberOfObjects = extractNumbers(line_numberObjects)[0];

    var line_dataRemovingTime = lines.filter(line=>line.includes('Data removing time='))[0];
    var dataRemovingTime_ms = extractNumbers(line_dataRemovingTime).slice(-1)[0];

    outputObj.parsedOutput = {
        removed_ids: removed_ids,
        number_of_objects: parseInt(numberOfObjects),
        data_removing_time: parseFloat(dataRemovingTime_ms),
        warnings: lines_warnings
    };

    return outputObj;
}

function parseQueryCmdOutput(outputObj){

    //output for multi queries
    /*
    {
      err: null,
      stdout: 'Query No.1\n' +
        'Rank\tID\tDistance\n' +
        '1\t5208\t0.463714\n' +
        '2\t945\t0.567801\n' +
        '3\t1911\t0.587811\n' +
        '4\t879\t0.588824\n' +
        '5\t5992\t0.609278\n' +
        '6\t913\t0.619473\n' +
        '7\t4785\t0.621334\n' +
        '8\t918\t0.641612\n' +
        '9\t704\t0.650749\n' +
        '10\t2656\t0.655286\n' +
        'Query Time= 0.000161 (sec), 0.161 (msec)\n' +
        'Query No.2\n' +
        'Rank\tID\tDistance\n' +
        '1\t521\t0.370288\n' +
        '2\t5870\t0.379877\n' +
        '3\t3400\t0.456043\n' +
        '4\t4818\t0.505373\n' +
        '5\t4401\t0.509974\n' +
        '6\t4060\t0.515771\n' +
        '7\t53\t0.516991\n' +
        '8\t4702\t0.526313\n' +
        '9\t434\t0.531962\n' +
        '10\t4212\t0.551885\n' +
        'Query Time= 5.8e-05 (sec), 0.058 (msec)\n' +
        'Average Query Time= 0.0001095 (sec), 0.1095 (msec), (0.000219/2)\n',
          stderr: ''
        }
     */

    var outputStr = outputObj.rawOutput.stdout; //query result is in stdout, unlike the others
    var outputIsExpectedFormat = outputStr.includes("Average Query Time=") && outputStr.includes("Query No.");
    if(!outputIsExpectedFormat){
        console.warn("ngt-tool query -- unexpected output format, skipping parse.");
        return outputObj;
    }

    var lines = outputStr.split('\n');
    var currentQueryNumber = 0;
    var queriesSoFar = [];
    var queryMap = {};
    var averageQueryTime_ms = null;

    for(var i=0;i<lines.length;i++){
        var line = lines[i];
        var isQueryHeaderLine = line.includes('Query No.');
        var isRankHeaderLine = line.includes('Rank');
        var isAverageQueryTimeLine = line.includes('Average Query Time=');
        var isQueryTimeLine = line.includes('Query Time') && !line.includes("Average");
        var isResultItemLine = (line && !isQueryHeaderLine && !isRankHeaderLine && !isQueryTimeLine && !isAverageQueryTimeLine);
        if(isQueryHeaderLine){
            currentQueryNumber = parseInt(line.split('Query No.').slice(-1)[0]);
            queryMap[currentQueryNumber+""]={queryNo: currentQueryNumber, results: []};
        }
        if(isAverageQueryTimeLine){ //last line
            averageQueryTime_ms = extractNumbers(line)[1];
        }
        if(isQueryTimeLine){ //last line per query
            queriesSoFar.push(queryMap[currentQueryNumber+""]);
        }
        if(isResultItemLine){
            var parts = line.split('\t');
            var item_Rank_ID_Distance = {
                rank: parseInt(parts[0]),
                id: parseInt(parts[1]),
                distance: parseFloat(parts[2])
            };
            queryMap[currentQueryNumber+""].results.push(item_Rank_ID_Distance);
        }
    }

    outputObj.parsedOutput = {
        queries: queriesSoFar,
        averageQueryTime_ms: averageQueryTime_ms
    };

    return outputObj;
}

function generateVector(dims){
    return new Array(dims).fill(1).map(i=>Math.random());
}

function generateVectorList(dims,noVectors){
    return new Array(noVectors).fill(1).map(i=>generateVector(dims));
}

module.exports = {
    createDb_sync,
    appendVectors_sync,
    removeVectors_sync,
    searchVectors_sync,
    createDb,
    appendVectors,
    appendVectorsUsingFile,
    removeVectors,
    searchVectors,
    generateVector,
    generateVectorList
};