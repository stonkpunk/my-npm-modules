var jf = require('jsonfile');
var jfc = require('jsonfile-compressed');

var t0=Date.now();
console.log("loading species dataset...");
require('all-the-species').loadSpeciesData(onGotData);


function onGotData(dataSet){
    console.log('done loading species dataset.',(Date.now()-t0)/1000.0,"sec", dataSet.length, "rows")
    var speciesWithCommonNames = dataSet.filter(row=>row.common_name!='_');
    console.log(speciesWithCommonNames.length, "species have common names");

    jf.writeFileSync('common_species_data.json',speciesWithCommonNames);

    var t2=Date.now();
    jfc.writeFileSync('common_species_data',speciesWithCommonNames,false);
    console.log("compressed save took",(Date.now()-t2)/1000.0,"Sec"); //compressed save took 92.26 Sec
}

