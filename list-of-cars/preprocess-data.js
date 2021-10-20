//data from https://www.back4app.com/database/back4app/car-make-model-dataset -- CC0 public domain
var listraw = require('jsonfile').readFileSync('list-of-cars-orig.json');

listraw = listraw.results.map(function (item){
    delete item.objectId;
    delete item.createdAt;
    delete item.updatedAt;
    return item;
})

require('jsonfile-compressed').writeFileSync('list-of-cars', listraw, false);