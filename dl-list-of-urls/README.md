# dl-list-of-urls

download a list of urls, optionally load each result into jQuery object

## Installation

```sh
npm i dl-list-of-urls
```

## Usage 

```javascript
var dl = require('dl-list-of-urls');

var list = [ //list of urls to download
    'https://examine.com/supplements/cbd/',
    'https://examine.com/supplements/cannabis/',
    'https://examine.com/supplements/ashwagandha/'
];

var limitParallel = 2; //download up to 2 at a time [default 1]

var onDownloadedEach_noJquery = function(url, result){
    //print raw html from the page...
    console.log(`html from ${url} -- ${result}`); 
}

var onDownloadedEach_withJquery = function(url, result, $){
    //search through the html with jquery
    $('div').each(function(){ //print text from each div
        console.log($(this).text());
    })
}

var onComplete = function(listOfErrors, listOfResults){
    console.log('all done');
}

//downloadListOfUrls(list, onComplete, onDownloadedEach_noJquery, limitParallel?=1, delayMs?=100)
dl.downloadListOfUrls(list, onComplete, onDownloadedEach_noJquery, limitParallel) //download list of urls, process raw html with callback 
dl.downloadListOfUrlsJquery(list, onComplete, onDownloadedEach_withJquery, limitParallel) //same, but load html result into jquery object
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)

