# jsonfile-compressed

similar to [jsonfile](https://www.npmjs.com/package/jsonfile), but with automatic jsonpack + lzma (7zip) compression+decompression

```javascript
readFile(fileName, jsonPackEnabled = true, callback) 
writeFile(fileName, obj, jsonPackEnabled = true, callback)
readFileSync(fileName, jsonPackEnabled? = true)
writeFileSync(fileName, obj, jsonPackEnabled? = true)
```

## Installation

```sh
npm i jsonfile-compressed
```

## Usage

```javascript
var jfc = require('jsonfile-compressed');
var obj = {"ok":"here is some stuff"};

jfc.writeFileSync("test.json", obj); //note - file extension is ignored
//object is saved as test.jsonpack.7z

var obj_decompressed = jfc.readFileSync("test.json"); //file extension optional
//^^^filename is automatically changed internally, from test.json to to test.jsonpack.7z

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
//saved as test2.json.7z 

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

- [json-shrink](https://www.npmjs.com/package/json-shrink) 
- [jsonfile](https://www.npmjs.com/package/jsonfile)



