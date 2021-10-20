var SpatialDb = require('./index.js');

//create new spatial-db
var sdp = new SpatialDb('benchmark',5);

var t0=Date.now();
for(var i=0;i<100000;i++){
    var itemKey = "my_item"+i;
    var itemJSON = {"something":"stuff"+i};
    var randomVector = [Math.random(),Math.random(),Math.random(),Math.random(),Math.random()];
    sdp.addItemToDb_sync(itemKey,itemJSON, randomVector);
    if(i%100==0){
        console.log(i);
    }
}
var sec = (Date.now()-t0)/1000.0;
console.log("sync took",sec,"sec", 10000/(sec),"per sec");