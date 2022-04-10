function clearBuffer(buffer){
    var i=0;
    while(i<buffer.length){
        buffer[i]=0;
        buffer[++i]=0;
        buffer[++i]=0;
        buffer[++i]=255;
    }
}

module.exports = clearBuffer;