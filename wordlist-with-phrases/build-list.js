//http://lingucomponent.openoffice.org/MyThes-1.zip

var thesaurus = require("thesaurus");
var THES = thesaurus.get();

var fullWordObj = {};

function addWord(w){
    fullWordObj[w]=w;
}

for(var word in THES){
    addWord(word);
    THES[word].forEach(function(_word){
        addWord(_word);
    })
}

var wordList = Object.keys(fullWordObj);

console.log("NUMBER OF WORDS/PHRASES", wordList.length);
//require('jsonfile').writeFileSync("WORDS_LIST.json",wordList);

require('fs').writeFileSync('index.js',`module.exports=${JSON.stringify(wordList)};`)