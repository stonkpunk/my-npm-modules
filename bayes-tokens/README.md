# bayes-tokens

this is a fork of [word-counts-categorical](https://www.npmjs.com/package/word-counts-categorical)  with functions for using raw tokens

___________

Get word counts / frequencies on a per-speaker or per-category basis, or as an aggregate.

Predict category using Bayes' rules. 

Optionally stems words using [stemmer](https://www.npmjs.com/package/stemmer)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Usage - no stemming](#usage---no-stemming)
- [Usage - Bayesian prediction](#usage---bayesian-prediction)
- [Usage - disable LaPlace smoothing](#usage---disable-laplace-smoothing)
- [About](#about)
- [See Also](#see-also)

## Installation

```sh
npm i bayes-tokens
```

## Usage

```javascript
var wcc = require('bayes-tokens');

var stuffBobSays = "my name is bob. i like pizza.";
var stuffJaneSays = "my name is jane. i like snowboarding.";

var wordCountAggregator = {};
wcc.countWordsAsCategory(stuffBobSays, "BOB", wordCountAggregator);
wcc.countWordsAsCategory(stuffJaneSays, "JANE", wordCountAggregator);

//token version countTokensAsCategory - takes list of tokens instead of string, no stemming applied 


//you can continue adding words per-category...
//wcc.countWordsAsCategory(moreStuffBobSays, "BOB", wordCountAggregator);
//wcc.countWordsAsCategory(moreStuffJaneSays, "JANE", wordCountAggregator);

console.log(wcc.getWordCountsOverall(wordCountAggregator));
// {
//     my: 2,
//     name: 2,
//     is: 2,
//     bob: 1,
//     i: 2,
//     like: 2,
//     pizza: 1,
//     jane: 1,
//     snowboard: 1
// }


console.log(wcc.getWordFrequenciesOverall(wordCountAggregator));
// {
//     my: 0.14285714285714285,
//     name: 0.14285714285714285,
//     is: 0.14285714285714285,
//     bob: 0.07142857142857142,
//     i: 0.14285714285714285,
//     like: 0.14285714285714285,
//     pizza: 0.07142857142857142,
//     jane: 0.07142857142857142,
//     snowboard: 0.07142857142857142
// }


console.log(wcc.getWordFrequenciesForAllCategories(wordCountAggregator));
// {
//     BOB: {
//         my: 0.14285714285714285,
//         name: 0.14285714285714285,
//         is: 0.14285714285714285,
//         bob: 0.14285714285714285,
//         i: 0.14285714285714285,
//         like: 0.14285714285714285,
//         pizza: 0.14285714285714285
//     },
//     JANE: {
//         my: 0.14285714285714285,
//         name: 0.14285714285714285,
//         is: 0.14285714285714285,
//         jane: 0.14285714285714285,
//         i: 0.14285714285714285,
//         like: 0.14285714285714285,
//         snowboard: 0.14285714285714285
//     }
// }


console.log(wcc.getWordFrequenciesForCategory(wordCountAggregator, "BOB"));
//{
//     my: 0.14285714285714285,
//     name: 0.14285714285714285,
//     is: 0.14285714285714285,
//     bob: 0.14285714285714285,
//     i: 0.14285714285714285,
//     like: 0.14285714285714285,
//     pizza: 0.14285714285714285
// }

console.log(wcc.getTotalWordsOverall(wordCountAggregator));
//14
console.log(wcc.getTotalWordsForCategory(wordCountAggregator,"JANE"));
//7


//words shared between categories...
console.log(wcc.getSharedWords(wordCountAggregator));
//[ 'my', 'name', 'is', 'i', 'like' ]

//filter [delete] words with wordcount below cutoff
wcc.filterForMinimumWordCount(wordCountAggregator,2)

//added utils:

//get probability of the categories themselves relative to global wordcounts
//var catsProbsObj = wcc.getGlobalCategoryProbabilities(wordCountAggregator)

//sum 2 word count objects
//var summed = wcc.mergeWordcountsPair(wordCountAggregatorA,wordCountAggregatorB);

//sum together list of word count objects
//var summed = wcc.mergeWorcountsList([wordCountAggregator])

//multiple all wordcounts by fraction 
//var scaled = wcc.scaleWordCounts(wordCountAggregator, frac, doRoundDown=false)

//multiple all wordcounts by 1.0-1.0/days 
//var scaled = wcc.decayWordcounts(wordCountAggregator, days, doRoundDown=false)

```

## Usage - no stemming

```javascript
//with stemming disabled...
var wordCountAggregator_noStems = {};
var doStem = false; //doStem param is true by default
wcc.countWordsAsCategory(stuffBobSays, "BOB", wordCountAggregator_noStems, doStem);
wcc.countWordsAsCategory(stuffJaneSays, "JANE", wordCountAggregator_noStems, doStem);

//results now include "snowboarding" not "snowboard"
```

## Usage - Bayesian prediction

```javascript
//bayes probability ...
var doStem = true;
console.log(wcc.getMostLikelyCategory("snowboarding is cool", wordCountAggregator, doStem)); //doStem is optional, defaults to true
//JANE

//version for tokens:
//wcc.getMostLikelyCategoryForTokens - takes array of tokens [words] instead of string [no stemming performed]

//get all category bayesian log-probabilities ...
console.log(wcc.getProbabilityForAllCategories("snowboarding is cool", wordCountAggregator, doStem));
//[ [ 'BOB', -8.0507033814703 ], [ 'JANE', -7.9171719888457766 ] ]

//version for tokens:
//wcc.getProbabilityForAllCategoriesForTokens - takes array of tokens [words] instead of string [no stemming performed]

//for single category ...
console.log(wcc.getProbabilityForStringInCategory("snowboarding is cool", wordCountAggregator,"BOB", doStem));
//-8.0507033814703

//version for tokens:
//wcc.getProbabilityForTokensInCategory - takes array of tokens instead of string [no stemming performed]
```

## Usage - disable LaPlace smoothing

```javascript
//disable +1 laplace smoothing...
wcc.enableLaPlaceSmooth(false);
console.log(wcc.getProbabilityForStringInCategory("snowboarding is fun", wordCountAggregator,"BOB", doStem));
//result is now -7.783640596221254 [result was -8.0507033814703 with smoothing enabled]
```

## About

Originally by [MarketerRank](https://marketerrank.com/).

## See Also

- [dclassify](https://www.npmjs.com/package/dclassify) - similar idea
- [bayes](https://www.npmjs.com/package/bayes) - similar tool; source of laplace-smoothed bayes algorithm
- [word-counts-categorical](https://www.npmjs.com/package/word-counts-categorical) 

