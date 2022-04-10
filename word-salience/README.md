# word-salience

- return the most salient / important words from a piece of text
- or directly from a wordcounts object similar to what is returned by [word-count-frequency](https://www.npmjs.com/package/word-count-frequency)
- salience = `word frequency / frequency in english * # word appearances` - similar to tf-idf
- based on frequencies from [norvig-frequencies-stemmed](https://www.npmjs.com/package/norvig-frequencies-stemmed)

## Installation

```sh
npm i word-salience
```

## Usage

```javascript

var ws = require('word-salience');

//excerpt from "The Complete Book of Cheese, by Robert Carlton Brown"
// https://www.gutenberg.org/cache/epub/14293/pg14293.txt

var theText = "Cheese market day in a town in the north of Holland. All the\n" +
    "cheese-fanciers are out, thumping the cannon-ball Edams and the\n" +
    "millstone Goudas with their bare red knuckles, plugging in with a\n" +
    "hollow steel tool for samples. In Holland the business of judging a\n" +
    "crumb of cheese has been taken with great seriousness for centuries.\n" +
    "The abracadabra is comparable to that of the wine-taster or\n" +
    "tea-taster. These Edamers have the trained ear of music-masters and,\n" +
    "merely by knuckle-rapping, can tell down to an air pocket left by a\n" +
    "gas bubble just how mature the interior is.\n" +
    "\n" +
    "The connoisseurs use gingerbread as a mouth-freshener; and I, too,\n" +
    "that sunny day among the Edams, kept my gingerbread handy and made my\n" +
    "way from one fine cheese to another, trying out generous plugs from\n" +
    "the heaped cannon balls that looked like the ammunition dump at\n" +
    "Antietam.\n" +
    "\n" +
    "I remember another market day, this time in Lucerne. All morning I\n" +
    "stocked up on good Schweizerkäse and better Gruyère. For lunch I had\n" +
    "cheese salad. All around me the farmers were rolling two-hundred-pound\n" +
    "Emmentalers, bigger than oxcart wheels. I sat in a little café,\n" +
    "absorbing cheese and cheese lore in equal quantities. I learned that a\n" +
    "prize cheese must be chock-full of equal-sized eyes, the gas holes\n" +
    "produced during fermentation. They must glisten like polished bar\n" +
    "glass. The cheese itself must be of a light, lemonish yellow. Its\n" +
    "flavor must be nutlike. (Nuts and Swiss cheese complement each other\n" +
    "as subtly as Gorgonzola and a ripe banana.) There are, I learned,\n" +
    "\"blind\" Swiss cheeses as well, but the million-eyed ones are better."



//full params:
var returnUnstemmedWords = true; //default true - return the words in their unstemmed format [the first unstemmed version encountered is the one returned]. note this is a "superficial" parameter -- all scoring is identical, only the labels are changed.
var doPostMultiply = true; //default true - multiple word scores by number of word appearances

console.log(ws.getSalientWords(theText, returnUnstemmedWords, doPostMultiply).slice(0,5));

/*
//returns list of words sorted by salience 

//unstemmed
[
  [ 'Edams', 0.27351362035510285 ],
  [ 'taster', 0.07597600565419523 ],
  [ 'Cheese', 0.06048089923787909 ],
  [ 'gingerbread', 0.0467544650179663 ],
  [ 'fanciers', 0.03039040226167809 ]
]


//stemmed [note that scores are identical]
[
  [ 'edam', 0.27357297182063456 ],
  [ 'taster', 0.07599249217239848 ],
  [ 'chees', 0.06049402337408037 ],
  [ 'gingerbread', 0.04676461056762983 ],
  [ 'fancier', 0.030396996868959397 ]
]


//with post-multiply = false [post-multiply multiples score by number of word appearances, similar to TF-IDF]
[
  [ 'edam', 0.13407875855107848 ],
  [ 'taster', 0.0558661493962827 ],
  [ 'fancier', 0.04469291951702616 ],
  [ 'millston', 0.04469291951702616 ],
  [ 'gouda', 0.04469291951702616 ]
]

 */


//get the data as an object instead of array:
console.log(ws.getSalientWordsObject(theText));

/*
{
  Cheese: 0.06048089923787909,
  market: 0.00011119795924507169,
  day: 0.0001068245666126788,
  town: 0.00008512717720358008,
  north: 0.00004101268861225114,
  Holland: 0.0027134287733641153,
  ...
}
 */

//get salience from result of [npm word-count-frequency]
//you must give it the unstemmed text if you want it to return unstemmed words. otherwise it returns the stemmed words.
getSalientWordsObjectFromWordCount(wordCountResult, doReturnUnstemmed, unstemmedText, doPostMultiply);

```


## See Also

- [norvig-frequencies-stemmed](https://www.npmjs.com/package/norvig-frequencies-stemmed)

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

