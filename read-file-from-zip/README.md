# read-file-from-zip

read utf8 data from a file inside a zip archive without unzipping.

based on a [stackoverflow post](https://stackoverflow.com/questions/39705209/node-js-read-a-file-in-a-zip-without-unzipping-it).

## Installation

```sh
npm i read-file-from-zip
```

## Usage 

```javascript
var rfz = require('read-file-from-zip');

//sync version
var fileContentsString = rfz.readFileFromZipSync("./myArchive.zip", "zippedFile.txt");

//callback version
//rfz.readFileFromZip(zipname, filename, callback); //callback(err,data)

//get zip file list
// pass an empty filename to either of the functions above
// to get a list of entries [filename, '${sizeInBytes} bytes' || 'directory']
```


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



