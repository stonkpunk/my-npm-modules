# zip-file-search

search for files by name inside .zip files within a folder

## Installation

```sh
npm i zip-file-search
```

## Usage 

```javascript
var searchSync = require('zip-file-search').searchSync; //sync version
//var search = require('zip-file-search').search; //async version (folder,terms,callback(err,res))

// suppose we have a folder with 2 zip files that each contain 1 file in a folder like this:
// test-zip-folder/
//      test-zip.zip
//          test-zip/
//              test.txt
//      test-zip-copy.zip
//          test-zip-copy/
//              test.txt

//var folderPath = './test-zip-folder/test-zip.zip' //search a single zip file...
var folderPath = './test-zip-folder/' //search a folder with zip files in it [using npm fast-glob]...
var searchResults = searchSync(folderPath, ["test"]);

//returns [ [zipPath, filePathWithinZip, sizeInBytesString] ... ]

//results are files containing all the query terms in their names/paths
console.log(searchResults);

// [
//     [
//         './test-zip-folder/test-zip-copy.zip',
//         'test-zip-copy/test.txt',
//         '4 bytes'
//     ],
//     [ './test-zip-folder/test-zip.zip', 'test-zip/test.txt', '4 bytes' ],
// ]
```

## See Also

- [read-file-from-zip](https://www.npmjs.com/package/read-file-from-zip) - read-file-from-zip


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



