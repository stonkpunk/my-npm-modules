var t0=Date.now();
console.log("loading species dataset...");
require('./index.js').loadSpeciesData(onGotData);

function onGotData(dataSet){
    console.log('done loading species dataset.',(Date.now()-t0)/1000.0,"sec", dataSet.length, "rows")

    //print random item from dataset
    console.log(dataSet[Math.floor(Math.random()*dataSet.length)]);

    // loading species dataset...
    //done loading species dataset. 6.385 sec 80149 rows

    //each row of dataset looks like this:
    /*
     {
       taxonomy: {
         id: '1650158',                           // this is the GBIF id
         kingdom: 'Animalia',
         phylum: 'Arthropoda',
         class_: 'Insecta',
         order: 'Diptera',
         family: 'Culicidae',
         genus: 'Anopheles',
         species: 'Anopheles funestus'
       },
       common_name: 'African malaria mosquito',  // common name or "_" if none known
       category_name: 'Insects',                 // human-readable category name
       icon: '🦟'                                // emoji icon for this species
     }

     */

}

