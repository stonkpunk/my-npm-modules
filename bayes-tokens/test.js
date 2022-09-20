var wcc = require('./index.js');

var stuffBobSays = "my name is bob. i like pizza.";
var stuffJaneSays = "my name is jane. i like snowboarding.";

var wordCountAggregator = {};
wcc.countWordsAsCategory(stuffBobSays, "BOB", wordCountAggregator);
wcc.countWordsAsCategory(stuffJaneSays, "JANE", wordCountAggregator);

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

console.log(wcc.getTotalWordsOverall(wordCountAggregator)); //14
console.log(wcc.getTotalWordsForCategory(wordCountAggregator,"JANE")); //7


//with stemming disabled...
var wordCountAggregator_noStems = {};
var doStem = false; //doStem param is true by default
wcc.countWordsAsCategory(stuffBobSays, "BOB", wordCountAggregator_noStems, doStem);
wcc.countWordsAsCategory(stuffJaneSays, "JANE", wordCountAggregator_noStems, doStem);

console.log(wcc.getWordCountsOverall(wordCountAggregator_noStems));
// {
//     my: 2,
//     name: 2,
//     is: 2,
//     bob: 1,
//     i: 2,
//     like: 2,
//     pizza: 1,
//     jane: 1,
//     snowboarding: 1
// }

console.log(wcc.getWordFrequenciesOverall(wordCountAggregator_noStems));
// {
//     my: 0.14285714285714285,
//     name: 0.14285714285714285,
//     is: 0.14285714285714285,
//     bob: 0.07142857142857142,
//     i: 0.14285714285714285,
//     like: 0.14285714285714285,
//     pizza: 0.07142857142857142,
//     jane: 0.07142857142857142,
//     snowboarding: 0.07142857142857142
// }

console.log(wcc.getWordFrequenciesForAllCategories(wordCountAggregator_noStems));

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
//         snowboarding: 0.14285714285714285
//     }
// }


console.log(wcc.getWordFrequenciesForCategory(wordCountAggregator_noStems, "BOB"));
// {
//     my: 0.14285714285714285,
//     name: 0.14285714285714285,
//     is: 0.14285714285714285,
//     bob: 0.14285714285714285,
//     i: 0.14285714285714285,
//     like: 0.14285714285714285,
//     pizza: 0.14285714285714285
// }

console.log(wcc.getTotalWordsOverall(wordCountAggregator_noStems));
//14
console.log(wcc.getTotalWordsForCategory(wordCountAggregator_noStems,"JANE"));
//7

//bayes probability ...
var doStem = true;

console.log(wcc.getMostLikelyCategory("snowboarding is cool", wordCountAggregator, doStem));
//JANE

//get all category bayesian log-probabilities ...
console.log(wcc.getProbabilityForAllCategories("snowboarding is cool", wordCountAggregator, doStem));
//[ [ 'BOB', -8.0507033814703 ], [ 'JANE', -7.9171719888457766 ] ]

//for single category ...
console.log(wcc.getProbabilityForStringInCategory("snowboarding is fun", wordCountAggregator,"BOB", doStem));
//-8.0507033814703
//disable +1 laplace smoothing...
wcc.enableLaPlaceSmooth(false);
console.log(wcc.getProbabilityForStringInCategory("snowboarding is fun", wordCountAggregator,"BOB", doStem));
//-7.783640596221254

//words shared between categories...
console.log(wcc.getSharedWords(wordCountAggregator));

//filter words with wordcount below cutoff
wcc.filterForMinimumWordCount(wordCountAggregator,2)
