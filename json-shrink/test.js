
var jsh = require('./index.js');
var shrink = jsh.shrink;
var unshrink = jsh.unshrink;

console.log("test with LZMA");

//compressing json into buffer or string:
//shrink(obj, outputAsString = false, doPack = true)
var original_obj = {ok:"here is some text"};
var compressed_into_buffer = shrink(original_obj); //output as buffer
var compressed_into_string = shrink(original_obj, true); // output as base64 string

console.log("uncompressed str", unshrink(compressed_into_string));
console.log("uncompressed buffer", unshrink(compressed_into_buffer));

//with jsonpack disabled:
var compressed_buffer_nopack = shrink(original_obj, false, false);
var compressed_string_nopack = shrink(original_obj, true, false);

console.log("uncompressed str - no jsonpack", unshrink(compressed_string_nopack, false));
console.log("uncompressed buffer - no jsonpack", unshrink(compressed_buffer_nopack, false));

console.log("test with BROTLI");


//compressing json into buffer or string:
//shrink(obj, outputAsString = false, doPack = true)
var original_obj2 = {ok2:"here is some text2"};
var compressed_into_buffer2 = shrink(original_obj2, false, false, true); //output as buffer
var compressed_into_string2 = shrink(original_obj2, true, true, true); // output as base64 string

console.log("br uncompressed str", unshrink(compressed_into_string2, true, true));
console.log("br uncompressed buffer", unshrink(compressed_into_buffer2, false, true));

//with jsonpack disabled:
var compressed_buffer_nopack2 = shrink(original_obj2, false, false, true);
var compressed_string_nopack2 = shrink(original_obj2, true, false, true);

console.log("br uncompressed str - no jsonpack", unshrink(compressed_string_nopack2, false, true));
console.log("br uncompressed buffer - no jsonpack", unshrink(compressed_buffer_nopack2, false, true));
