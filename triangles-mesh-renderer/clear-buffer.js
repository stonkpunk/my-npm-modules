// function clearBuffer(buffer){
//     var i=0;
//     while(i<buffer.length){
//         buffer[i]=0;
//         buffer[++i]=0;
//         buffer[++i]=0;
//         buffer[++i]=255;
//     }
// }
//
// module.exports = clearBuffer;

function clearBuffer(buffer){
    var i=0;
    while(i<buffer.length){
        buffer[i]=0;
        buffer[i+1]=0;
        buffer[i+2]=0;
        buffer[i+3]=255;
        i+=4;
    }
    return buffer;
}

module.exports = clearBuffer;