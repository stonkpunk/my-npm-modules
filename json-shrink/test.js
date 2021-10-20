
var jsh = require('./index.js');
var shrink = jsh.shrink;
var unshrink = jsh.unshrink;

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