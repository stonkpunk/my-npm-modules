var list = require('./index.js');

//print out 10 random words/phrases
for(var i=0;i<10;i++){
    console.log(list[Math.floor(Math.random()*list.length)]);
}