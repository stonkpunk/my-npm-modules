var jfc = require('jsonfile-compressed');
var path = require('path');

var theList = null;

module.exports.getList = function(callback){
    if(theList){
        callback(theList);
        return;
    }
    jfc.readFile(path.resolve(__dirname, 'list-of-cars.json'), false, function(err, data){
        theList=data;
        callback(data);
        return;
    })
}

module.exports.getListSync = function(){
    if(theList){
        return theList;
    }
    theList = jfc.readFileSync(path.resolve(__dirname, 'list-of-cars.json'), false);
    return theList;
}

function checkListExists(){
    if(!theList){
        throw 'must load dataset first with getList or getListSync'
    }
}

function getCarsByMakeObj(){
    checkListExists();
    var res = {};
    theList.forEach(function(car){
        var brand = car.Make;
        res[brand] = res[brand] || [];
        res[brand].push(car);
    });
    return res;
}

function getCarsByCategoryObj(){
    checkListExists();
    var res = {};
    theList.forEach(function(car){
        var cat = car.Category;
        res[cat] = res[cat] || [];
        res[cat].push(car);
    });
    return res;
}

function getCarMakes(){
    return Object.keys(getCarsByMakeObj());
}

function getCarCategories(){
    return Object.keys(getCarsByCategoryObj());
}

module.exports.getCarsByMakeObj = getCarsByMakeObj;
module.exports.getCarMakes = getCarMakes;
module.exports.getCarCategories = getCarCategories;
module.exports.getCarsByCategoryObj = getCarsByCategoryObj;
