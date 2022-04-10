# norvig-frequencies-stemmed

dataset of frequencies of stemmed words based on [norvig dataset](https://norvig.com/ngrams/). contains data for top 40,000 words [after which the words are very uncommon/strange...]

words were stemmed with [stemmer](https://www.npmjs.com/package/stemmer) and their frequencies combined from the unstemmed versions in the norvig dataset.

## Installation

```sh
npm i norvig-frequencies-stemmed
```

## Usage

```javascript
var nvs = require('norvig-frequencies-stemmed')

//nvs[word] = frequency [0...1]

console.log(Object.entries(nvs));

```

Result:
```javascript
[
  [ 'the', 0.0393389 ],    [ 'of', 0.0223634 ],     [ 'and', 0.0221026 ],
  [ 'to', 0.0206424 ],     [ 'a', 0.0154434 ],      [ 'in', 0.0144294 ],
  [ 'for', 0.0100889 ],    [ 'is', 0.0080034 ],     [ 'on', 0.0081438 ],
  [ 'that', 0.0057982 ],   [ 'by', 0.0056964 ],     [ 'thi', 0.0054923 ],
  [ 'with', 0.0054126 ],   [ 'i', 0.0052483 ],      [ 'you', 0.0050949 ],
  [ 'it', 0.0056792 ],     [ 'not', 0.0044793 ],    [ 'or', 0.0044155 ],
  [ 'be', 0.0045027 ],     [ 'ar', 0.0041427 ],     [ 'from', 0.0038692 ],
  [ 'at', 0.0038795 ],     [ 'as', 0.0038238 ],     [ 'your', 0.0035437 ],
  [ 'all', 0.0034482 ],    [ 'have', 0.0028471 ],   [ 'new', 0.0039227 ],
  [ 'more', 0.0026275 ],   [ 'an', 0.0025873 ],     [ 'wa', 0.0025816 ],
  [ 'we', 0.0023689 ],     [ 'will', 0.0023474 ],   [ 'home', 0.002286 ],
  [ 'can', 0.0021247 ],    [ 'us', 0.0046865 ],     [ 'about', 0.002086 ],
  [ 'if', 0.0019335 ],     [ 'page', 0.0022421 ],   [ 'my', 0.0018023 ],
  [ 'ha', 0.0018158 ],     [ 'search', 0.0018935 ], [ 'free', 0.0017275 ],
  [ 'but', 0.0017009 ],    [ 'our', 0.0017071 ],    [ 'other', 0.0018533 ],
  [ 'do', 0.0017726 ],     [ 'no', 0.0016009 ],     [ 'inform', 0.0017304 ],
  [ 'time', 0.0019318 ],   [ 'thei', 0.0015023 ],   [ 'site', 0.0017826 ],
  [ 'he', 0.0014359 ],     [ 'up', 0.0014659 ],     [ 'mai', 0.0014223 ],
  [ 'what', 0.0013923 ],   [ 'which', 0.0013783 ],  [ 'their', 0.0013347 ],
  [ 'out', 0.0012738 ],    [ 'ani', 0.0012115 ],    [ 'there', 0.0011956 ],
  [ 'see', 0.0012209 ],    [ 'onli', 0.0011258 ],   [ 'so', 0.0011297 ],
  [ 'hi', 0.0012374 ],     [ 'when', 0.0011064 ],   [ 'contact', 0.0011794 ],
  [ 'here', 0.0010896 ],   [ 'busi', 0.0011964 ],   [ 'who', 0.0010741 ],
  [ 'web', 0.0010612 ],    [ 'also', 0.0010488 ],   [ 'now', 0.00104 ],
  [ 'help', 0.0012461 ],   [ 'get', 0.0012724 ],    [ 'pm', 0.0010315 ],
  [ 'view', 0.0012651 ],   [ 'onlin', 0.0010231 ],  [ 'c', 0.0010145 ],
  [ 'e', 0.0010089 ],      [ 'first', 0.0009841 ],  [ 'am', 0.000992 ],
  [ 'been', 0.0009784 ],   [ 'would', 0.0009737 ],  [ 'how', 0.000978 ],
  [ 'were', 0.0009704 ],   [ 'me', 0.0009663 ],     [ 's', 0.0009609 ],
  [ 'servic', 0.0018543 ], [ 'some', 0.0009334 ],   [ 'these', 0.0009229 ],
  [ 'click', 0.0009629 ],  [ 'like', 0.0010202 ],   [ 'x', 0.0008648 ],
  [ 'than', 0.0008546 ],   [ 'find', 0.0009801 ],   [ 'price', 0.001368 ],
  [ 'date', 0.0010108 ],   [ 'back', 0.0008607 ],   [ 'top', 0.0008504 ],
  [ 'peopl', 0.0008333 ],
  ... 39900 more items
]

```



## See Also

- [norvig-frequencies](https://www.npmjs.com/package/norvig-frequencies) - list of top 100K words [words only, no frequencies]
- [word-salience](https://www.npmjs.com/package/word-salience) - uses norvig-frequencies-stemmed

[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

