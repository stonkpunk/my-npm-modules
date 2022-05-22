# jsonfile-compressed-brotli

similar to [jsonfile](https://www.npmjs.com/package/jsonfile), but with automatic jsonpack + brotli compression+decompression

different version of [jsonfile-compressed](https://www.npmjs.com/package/jsonfile-compressed) that uses brotli compression instead of LZMA (7-zip)

```javascript
readFile(fileName, jsonPackEnabled = false, callback) 
writeFile(fileName, obj, jsonPackEnabled = false, callback)
readFileSync(fileName, jsonPackEnabled? = false)
writeFileSync(fileName, obj, jsonPackEnabled? = false)
```

Note that this lib has `jsonPackEnabled` false by default, unlike `jsonfile-compressed`

## Installation

```sh
npm i jsonfile-compressed-brotli
```

## Usage

```javascript
var jfc = require('jsonfile-compressed-brotli');
var obj = {"ok":"here is some stuff"};

jfc.writeFileSync("test.json", obj); //note - file extension is ignored
//object is saved as test.jsonpack.br

var obj_decompressed = jfc.readFileSync("test.json"); //file extension optional
//^^^filename is automatically changed internally, from test.json to to test.jsonpack.br

console.log(obj_decompressed);
//result:
//{ ok: 'here is some stuff' }
```

## Usage - jsonpack disabled

sometimes the jsonpacked versions can be larger than the unpacked versions once compression is applied. make sure to check the compressed filesizes for your data to see if jsonpack is helping or not.

```javascript
var obj = {"ok":"here is some stuff"};
var jsonPackEnabled = false;

jfc.writeFileSync("test2.json", obj, jsonPackEnabled);
//saved as test2.json.br 

var obj_decompressed = jfc.readFileSync("test2.json", jsonPackEnabled);
console.log(obj_decompressed);
//result:
//{ ok: 'here is some stuff' }
```

## Usage - async

```javascript
var obj = {"ok2":"here is some stuff2"};
var jsonPackEnabled=true;

jfc.writeFile("test3.json", obj, jsonPackEnabled,function(err,res){
    jfc.readFile("test3.json", jsonPackEnabled, function(err2,res2){
        console.log("async",res2);
        //result
        //async { ok2: 'here is some stuff2' }
    });
});
```

## See Also
- [jsonfile-compressed](https://www.npmjs.com/package/jsonfile-compressed)
- [json-shrink](https://www.npmjs.com/package/json-shrink) 
- [jsonfile](https://www.npmjs.com/package/jsonfile)


[![stonks](https://i.imgur.com/UpDxbfe.png)](https://www.npmjs.com/~stonkpunk)



