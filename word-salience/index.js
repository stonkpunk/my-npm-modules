var nfs = require('norvig-frequencies-stemmed');
var wcf = require('word-count-frequency');
var stemmer = require('stemmer');
var matchWords = require('match-words');

function isNumeric(str) { //https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
    if (typeof str != "string") return false // we only process strings!
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
        !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function objSum(obj){
    var total=0;
    for(var f in obj){
        total+=obj[f];
    }
    return total;
}

function objNormalizeByTotal(obj){
    var total = objSum(obj);
    for(var f in obj){
        obj[f] = obj[f]/total;
    }
    return obj;
}

function obj2SortedArr(obj){ //sorted desc
    return Object.keys(obj).map(function(key){
        return [key,obj[key]];
    }).sort(function(a,b){
        return b[1]-a[1];
    })
}

function unstemWords(obj, unstemmingMap){
    var res = {};
    for(var f in obj){
        res[unstemmingMap[f]] = obj[f];
    }
    return res;
}

function buildUnStemmingMap(theWords){
    //var theWords = matchWords(text);
    var theWordsWithStems = theWords.map(w=>[w,stemmer(w)]);
    var unstemmingMap = {};
    theWordsWithStems.forEach(function(wordWithStem){
        unstemmingMap[wordWithStem[1]] = unstemmingMap[wordWithStem[1]] || wordWithStem[0];
    });
    return unstemmingMap;
}

function stemText(text){
    return matchWords(text).map(stemmer).join(' ');
}

function getSalientWordsObject(text, returnUnstemmed=true, doPostMultiply=true){
    var wcfres = wcf(stemText(text));
    //console.log("WCF",wcfres)
    return objNormalizeByTotal(getSalientWordsObjectFromWordCount(wcfres, returnUnstemmed, text, doPostMultiply));
}



function isStopWord(str){
    var stopWords = [
        "the","of","and","to","a","in",
        "for","is","on","that","by","this",
        "thi","with","i","you","it","not",
        "or","be","are","ar","from","at","as",
        "your","all","have","new","more","an",
        "we","wa","will","can","us","if","but","been",
        "our","do","no","their","he","she","what","were",
        "which","there","so","when","here","how","get"
    ];
    return stopWords.indexOf(str)!=-1;
}

function cleanObj(obj){
    //remove stop words fields
    for(var f in obj){
        if(isNumeric(f+"")){ //dont count numbers
            delete obj[f];
        }
        if(isStopWord(f+"")){ //dont count stop words
            delete obj[f];
        }
    }

    return obj;
}

function cloneObj(obj){
    return JSON.parse(JSON.stringify(obj));
}

function getSalientWordsObjectFromWordCount(wordCountsResult, returnUnstemmed=true, unstemmedText=null, doPostMultiply=true){
    var wcf_res = wordCountsResult;

    //for each word,
    //get stemmed word, divide freq by norvig-stemmed freq
    //return final obj as sorted arr desc

    var eps = 5e-7;
    if(returnUnstemmed){ // note that the results should always be the same, just with different field names, but same values

        var wordsToBuildUnstemMap = unstemmedText ? matchWords(unstemmedText) : Object.keys(wordCountsResult);
        var unstemmedWordCountsFromStemmed = unstemWords(wcf_res,buildUnStemmingMap(wordsToBuildUnstemMap))

        var wordFrequenciesFromUnstemmedText = cleanObj(unstemmedWordCountsFromStemmed);

        for(var unstemmedWord in wordFrequenciesFromUnstemmedText){
            wordFrequenciesFromUnstemmedText[unstemmedWord] /= (nfs[stemmer(unstemmedWord)] || eps);
            if(doPostMultiply){
                wordFrequenciesFromUnstemmedText[unstemmedWord] *= wcf_res[stemmer(unstemmedWord)];
            }
        }
        return objNormalizeByTotal(wordFrequenciesFromUnstemmedText);
    }else{
        var wordFrequenciesFromStemmedText = objNormalizeByTotal(cloneObj(cleanObj(wcf_res)));

        var wordFrequenciesFromStemmedText = cleanObj(wordFrequenciesFromStemmedText);

        for(var stemmedWord in wordFrequenciesFromStemmedText){
            wordFrequenciesFromStemmedText[stemmedWord] /= (nfs[stemmedWord] || eps);
            if(doPostMultiply){
                //console.log(stemmedWord,wcf_res[stemmedWord])
                wordFrequenciesFromStemmedText[stemmedWord] *= wcf_res[stemmedWord];
            }
        }
        return (wordFrequenciesFromStemmedText);
    }
}

function getSalientWords(text, returnUnstemmed=true, doPostMultiply=true){ //pull most salient words from text
   return obj2SortedArr(getSalientWordsObject(text,returnUnstemmed,doPostMultiply));
}

module.exports = {getSalientWords, getSalientWordsObject, getSalientWordsObjectFromWordCount};
