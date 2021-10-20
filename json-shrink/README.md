# json-shrink

shrink objects/json with LZMA (7-zip) compression + optional [jsonpack](https://www.npmjs.com/package/jsonpack)

```javascript
var shrunken = shrink(obj, outputAsString = false, doPack = true);
var unshrunk = unshrink(shrunken, doUnPack = true);
```

## Installation

```sh
npm i json-shrink
```

## Usage




```javascript
var jsh = require('json-shrink');
var shrink = jsh.shrink;
var unshrink = jsh.unshrink;

//compressing json into buffer or string:
//shrink(obj, outputAsString = false, doPack = true)
var original_obj = {ok:"here is some text"};
var compressed_into_buffer = shrink(original_obj); //output as buffer
var compressed_into_string = shrink(original_obj, true); // output as base64 string

//uncompressing
//unshrink(shrunken, doUnPack = true);
console.log("uncompressed str", unshrink(compressed_into_string));
console.log("uncompressed buffer", unshrink(compressed_into_buffer));

//result
//uncompressed str { ok: 'here is some text' }
//uncompressed buffer { ok: 'here is some text' }
```

## Usage - jsonpack disabled

```javascript
//with jsonpack disabled:
var compressed_buffer_nopack = shrink(original_obj, false, false);
var compressed_string_nopack = shrink(original_obj, true, false);

console.log("uncompressed str - no jsonpack", unshrink(compressed_string_nopack, false));
console.log("uncompressed buffer - no jsonpack", unshrink(compressed_buffer_nopack, false));

//result
//uncompressed str - no jsonpack { ok: 'here is some text' }
//uncompressed buffer - no jsonpack { ok: 'here is some text' }
```

## See Also

- [jsonfile-compressed](https://www.npmjs.com/package/jsonfile-compressed) - uses `json-shrink`


