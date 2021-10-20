//https://stackoverflow.com/questions/55533020/efficient-encoding-for-float-constants-in-javascript
function encodeFloatArr(f32arr){

    if (Object.prototype.toString.call(f32arr) != "[object Float32Array]") {
        f32arr =  new Float32Array(f32arr);
    }

    let encoded = '';
    for (let x of new Uint8Array(f32arr.buffer))
        encoded  += (x | 0x100).toString(16).slice(1);

    return encoded;
}

function decodeFloat32Str(str){
    let bytes = new Uint8Array(
        str
            .match(/../g)
            .map(x => parseInt(x, 16)));
    let decodedData = new Float32Array(bytes.buffer);
    return decodedData;
}

module.exports.encodeFloatArr=encodeFloatArr;
module.exports.decodeFloatArr=decodeFloat32Str;