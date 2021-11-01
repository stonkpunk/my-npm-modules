# common-species

List of ~80K common species. 

- information about 80,149 species with common names
- human-readable categories per-species
- emoji icons for each species. 🦀🌲🦊🐟🌺☘️

includes animals, plants, bugs, bacteria, etc, all of it! 

based on permissibly-licensed datasets from [GBIF](https://www.gbif.org/).

this is a smaller alternative to [all-the-species](https://www.npmjs.com/package/all-the-species).

created for [ecofactbook](http://ecofactbook.com).

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Licenses and Citation](#licenses-and-citation)
- [See Also](#see-also)

## Installation

```sh
npm i common-species
```

## Usage

```javascript
var t0=Date.now();

require('common-species').loadSpeciesData(onGotData);

function onGotData(dataSet){

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
```

## Licenses and Citation

Raw list derived from Species occurance data [CC0 filtered]
- GBIF.org (5 July 2018) GBIF Occurrence Download https://doi.org/10.15468/dl.ljofvp

Species common names partially derived from
UnitProt Controlled vocabulary of species
under license CC by 4.0

## See Also

- [all-the-species](https://www.npmjs.com/package/all-the-species) - information about 1M species

