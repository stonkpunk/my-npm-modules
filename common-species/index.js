var jfc = require('jsonfile-compressed');
var path = require('path');

module.exports.loadSpeciesData = function(callback){
    jfc.readFile(path.resolve(__dirname, 'common_species_data.json'), false, function(err, dataset){
        callback(dataset);
    })
}