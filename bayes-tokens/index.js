var wcf = require('word-count-frequency');
var stemmer = require('stemmer');
var matchWords = require('match-words');

var ENABLE_LAPLACE_SMOOTH = true;

function cleanString(string){
    return matchWords(string).map(stemmer).join(" ");
}

function countWordsAsCategory(string, category, fullCountsHolder, doStem=true, doLowerCase=true){
    var _category = category || 'default';
    var _categoryCounts = fullCountsHolder || {};
    string = doLowerCase ? string.toLowerCase() : string;
    var counts = wcf(doStem ? cleanString(string) : string);

    for (const [word, wordCount] of Object.entries(counts)) {
        _categoryCounts[_category]=_categoryCounts[_category]||{};
        if (!_categoryCounts[_category][word]) {
            _categoryCounts[_category][word] = 0;
        }
        _categoryCounts[_category][word] += wordCount;
    }

    return _categoryCounts;
}

function countTokensAsCategory(tokens, category, categoryCounts){
    for(var i=0;i<tokens.length;i++){
        var token = tokens[i];
        categoryCounts[category]=categoryCounts[category]||{};
        if (!categoryCounts[category][token]) {
            categoryCounts[category][token] = 0;
        }
        categoryCounts[category][token] += 1;
    }
    return categoryCounts;
}

function getWordCountsOverall(wordCountsCategories){
    var countsPerCategory = Object.values(wordCountsCategories);
    const aggregate = countsPerCategory.reduce((_aggregate, category) => {
        for (const [wordName, wordCount] of Object.entries(category)) {
            if (!_aggregate[wordName]) {
                _aggregate[wordName] = 0;
            }

            _aggregate[wordName] += wordCount;
        }

        return _aggregate;
    }, {});

    return aggregate;
}

function getTotalWordsForCategory(wordCountsCategories, categoryName){
    var obj = wordCountsCategories[categoryName] || {};
    return Object.values(obj).reduce(function(accum, current){
        return accum+current;
    },0);
}

function getWordFrequenciesForCategory(wordCountsCategories, categoryName){
    var totalForCategory = getTotalWordsForCategory(wordCountsCategories, categoryName);
    if(totalForCategory==0){return {};}

    var res = {};
    var obj = wordCountsCategories[categoryName] || {};

    for (const [wordName, wordCount] of Object.entries(obj)) {
        res[wordName] = wordCount/totalForCategory;
    }

    return res;
}

function getTotalWordsOverall(wordCountsCategories){
    var total = Object.keys(wordCountsCategories).reduce(function(accum, current){
        return accum + getTotalWordsForCategory(wordCountsCategories, current);
    },0)
    return total;
}

function getWordFrequenciesForAllCategories(wordCountsCategories){
    var res = {};
    for(var category in wordCountsCategories){
        res[category] = getWordFrequenciesForCategory(wordCountsCategories, category);
    }
    return res;
}

function getWordFrequenciesOverall(wordCountsCategories){
    var total = getTotalWordsOverall(wordCountsCategories);
    if(total==0){return {};}

    var countsOverall = getWordCountsOverall(wordCountsCategories);
    var res = {};
    for (const [wordName, wordCount] of Object.entries(countsOverall)) {
        res[wordName] = wordCount/total;
    }
    return res;
}

function getSharedWords(wordCountAgg){ //get words present across all categories
    var cats = Object.keys(wordCountAgg);
    if(cats.length==0)return [];
    return Object.keys(wordCountAgg[cats[0]]).filter(word=>wordIsPresentInAllCategories(wordCountAgg,word));
}

function wordIsPresentInAllCategories(wordCountAgg, word){ //check if word exists across all categories
    var cats = Object.keys(wordCountAgg);
    for(var i=0; i<cats.length; i++){
        var cat = cats[i];
        if(!wordCountAgg[cat][word]){
            return false;
        }
    }
    return true;
}

function filterForMinimumWordCount(wordCountAgg, cutoff){ //remove words with wordcount below minimum
    var deletedWords = 0;
    var keptWords = 0;
    for(var cat in wordCountAgg){
        for(var word in wordCountAgg[cat]){
            if(wordCountAgg[cat][word]<cutoff){
                delete wordCountAgg[cat][word];
                deletedWords++;
            }else{
                keptWords++;
            }
        }
    }
    //console.log(`deleted ${deletedWords} words, kept ${keptWords}`);
    return wordCountAgg;
}

function getGlobalCategoryProbabilities(wordCountsCategories){
    var res = {};
    var totalWords = getTotalWordsOverall(wordCountsCategories);
    for(var cat in wordCountsCategories){
        var totalWordsForThisCat = getTotalWordsForCategory(wordCountsCategories, cat);
        res[cat] = totalWordsForThisCat/totalWords;
    }
    return res;
}

function getProbabilityForTokensInCategory(tokens, wordCountsCategories, categoryName){
    var words = tokens;

    var countsOverall = getWordCountsOverall(wordCountsCategories);
    var totalUniqueWords = Object.keys(countsOverall).length;
    //var thisCatFreqs = getWordFrequenciesForCategory(wordCountsCategories,categoryName);
    var thisCatCounts =  wordCountsCategories[categoryName];//getWordFrequenciesForCategory(wordCountsCategories,categoryName);

    var totalWordsForThisCat = getTotalWordsForCategory(wordCountsCategories, categoryName);
    var totalWords = getTotalWordsOverall(wordCountsCategories);

    //algorithm based on https://github.com/ttezel/bayes/blob/master/lib/naive_bayes.js

    /*
    (The MIT License)

    Copyright (c) by Tolga Tezel tolgatezel11@gmail.com

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
    */

    var categoryProb = Math.log(totalWordsForThisCat/totalWords);

    function tokenProbability(token){  //with laplace smoothing
        var wordFrequencyCount = thisCatCounts[token] || 0
        return ( wordFrequencyCount + 1 ) / ( totalWordsForThisCat + totalUniqueWords )
    }

    /*function tokenProbability_alternate(token){  //with laplace smoothing

        //prob(token given category) = prob(category given token) * prob(token) / prob (category)

        var pCgT = thisCatCounts[token]/countsOverall[token]; //prob(category given token)
        var pT = countsOverall[token] / totalWords; // prob(token)
        var pC = totalWordsForThisCat / totalWords; // prob (category)

        return pCgT*pT/pC;

        //var wordFrequencyCount = thisCatCounts[token] || 0
        //return ( wordFrequencyCount + 1 ) / ( totalWordsForThisCat + totalUniqueWords )
    }*/

    function tokenProbabilityNoSmooth(token){  //without laplace smoothing
        var wordFrequencyCount = thisCatCounts[token] || 0
        if(wordFrequencyCount<0.00001){
            return 1; //returning 1 because log(1) = 0, so this contribution is ignored
        }
        return ( wordFrequencyCount ) / ( totalWordsForThisCat )
    }

    return words.reduce(function(accum, currentWord){
        var frequencyInText = countsOverall[currentWord] || 0;
        //determine the log of the P( w | c ) for this word
        return accum + frequencyInText * Math.log(ENABLE_LAPLACE_SMOOTH ? tokenProbability(currentWord) : tokenProbabilityNoSmooth(currentWord))
    },categoryProb);
}


function getProbabilityForStringInCategory(string, wordCountsCategories, categoryName, doStem= true){
    var words = doStem ? matchWords(string).map(stemmer) :  matchWords(string);
    return getProbabilityForTokensInCategory(words, wordCountsCategories, categoryName);
}

function getProbabilityForAllCategories(string, wordCountsCategories, doStem=true){
    return Object.entries(wordCountsCategories).map(k=>[k[0],getProbabilityForStringInCategory(string, wordCountsCategories, k[0], doStem)]);
}

function getProbabilityForAllCategoriesForTokens(tokens, wordCountsCategories){
    return Object.entries(wordCountsCategories).map(k=>[k[0],getProbabilityForTokensInCategory(tokens, wordCountsCategories, k[0])]);
}

function getMostLikelyCategory(string, wordCountsCategories, doStem=true){
    var res = getProbabilityForAllCategories(string, wordCountsCategories, doStem);
    res.sort(function(a,b){return b[1]-a[1]}); //prob descending
    return res[0][0];
}

function getMostLikelyCategoryForTokens(tokens, wordCountsCategories){
    var res = getProbabilityForAllCategoriesForTokens(tokens, wordCountsCategories);
    res.sort(function(a,b){return b[1]-a[1]}); //prob descending
    return res[0][0];
}

function enableLaPlaceSmooth(bool){
    ENABLE_LAPLACE_SMOOTH = bool;
}

function mergeWordcountsPair(wccGlobal, wccToAdd){
    for(var cat in wccToAdd){
        wccGlobal[cat] = wccGlobal[cat] || {};
        var obj = wccToAdd[cat];
        for(var word in obj){
            wccGlobal[cat][word] = wccGlobal[cat][word] || 0;
            wccGlobal[cat][word]+=wccToAdd[cat][word];
        }
    }
    return wccGlobal;
}

function mergeWorcountsList(wccList){
    var mergedWcc = {};
    for(var i=0;i<wccList.length;i++){
        mergedWcc = mergeWordcountsPair(mergedWcc, wccList[i]);
    }
    return mergedWcc;
}

function scaleWordcounts(wcc, frac, roundDown=false){
    for(var cat in wcc){
        for(var word in wcc[cat]){
            wcc[cat][word] *= frac;
            if(roundDown){
                wcc[cat][word] = Math.floor(wcc[cat][word]);
            }
        }
    }
    return wcc;
}

function decayWordcounts(wcc, days=100, roundDown=false){
    return scaleWordcounts(wcc, 1.0-1.0/days, roundDown);
}

module.exports = {
    mergeWordcountsPair,
    mergeWorcountsList,
    scaleWordcounts,
    decayWordcounts,

    countWordsAsCategory,
    countTokensAsCategory,
    getTotalWordsForCategory,
    getTotalWordsOverall,
    getWordCountsOverall,
    getWordFrequenciesForCategory,
    getWordFrequenciesForAllCategories,
    getWordFrequenciesOverall,
    getProbabilityForStringInCategory,
    getProbabilityForAllCategories,
    getProbabilityForAllCategoriesForTokens,
    getProbabilityForTokensInCategory,
    getMostLikelyCategory,
    getMostLikelyCategoryForTokens,
    enableLaPlaceSmooth,
    filterForMinimumWordCount,
    getSharedWords,
    getGlobalCategoryProbabilities
};