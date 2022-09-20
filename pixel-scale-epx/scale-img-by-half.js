module.exports.scaleHalf = function(bufferOut, bufferExpanded, wOut, hOut){
    //note - ignoring pixels touching border to avoid introducing more conditionals
    var be = bufferExpanded;
    var wOut1 = wOut-1;
    var hOut1 = hOut-1;
    var wOut2 = wOut<<1;
    var wOut2_4 = wOut2<<2;
    for(var y=1; y<hOut1; y++){
        var y2w2 = (y<<1)*wOut2;
        var o_r = (y*wOut)<<2; //index for output buff
        var x2 = 2;
        for(var x=1; x<wOut1; x++){
            var oe_00 = (y2w2+x2)<<2; //index for 2x expanded input buff
            var oe_01 = oe_00+4;
            var oe_10 = oe_00+wOut2_4;
            var oe_11 = oe_10+4;
            bufferOut[o_r] =   (  be[oe_00]+  be[oe_01]+  be[oe_10]+  be[oe_11])>>2;
            bufferOut[++o_r] = (be[++oe_00]+be[++oe_01]+be[++oe_10]+be[++oe_11])>>2;
            bufferOut[++o_r] = (be[++oe_00]+be[++oe_01]+be[++oe_10]+be[++oe_11])>>2;
            o_r+=2; //shifting up 2 more, to get to the next index
            x2+=2; //shift index for expanded buffer
        }
    }
    return bufferOut;
}

// module.exports.scaleHalfInPlace = function(data,dataWidth){
//     var arr = new Array(data.length)
//     return scaleHalf()
// }