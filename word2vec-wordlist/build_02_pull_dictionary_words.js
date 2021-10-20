
//generate the compressed dataset...

var jf = require('jsonfile');
var jfc = require('jsonfile-compressed');
var allWords = jf.readFileSync('../../../../datasets/word2vec/dbs_googlenews/ALL_WORDS.json');

var words = require('norvig-frequencies');

console.log(allWords.length);

//console.log(words[0].toLowerCase());

var deasync = require('deasync');

var f2s = require('float-array-to-string');
var stemmer = require('stemmer');

var level = require('level');
var ldb = level('../../../../datasets/word2vec/dbs_googlenews/word2vec_mddf_level_db');

ldb.get('foo', function (err, value) {});
var getSync = deasync(function(word, callback){ldb.get(word, function (err, value) {
        try{
            var valObj = JSON.parse(value);
            var valList = Object.entries(valObj.vector).map(i=>i[1]);
            callback(err,f2s.encodeFloatArr(valList));
        }catch(e){
            callback(err,null);
        }
    })
});

var stemmedWords = {};
var RES = {};
words.slice(0,15000).forEach(function(wordInEnglish,i){
    try{
        var res = getSync(wordInEnglish.toLowerCase());
        if(res && !stemmedWords[stemmer(wordInEnglish.toLowerCase())]){
            if(i%1000==0){
                console.log(wordInEnglish,i);
            }
            stemmedWords[stemmer(wordInEnglish.toLowerCase())]=true; //prevent multiple words with the same stem
            RES[wordInEnglish] = res;
        }
    }catch(e){

    }
})

require('jsonfile-compressed').writeFileSync('RESULT_COMPRESSED', RES,false);
