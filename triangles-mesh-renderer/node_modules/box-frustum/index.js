module.exports = function(m, box) {
	var in_p = 0;
  for(var i=0; i<2; ++i) {
    var qx = box[i][0];
    for(var j=0; j<2; ++j) {
      var qy = box[j][1];
      for(var k=0; k<2; ++k) {
        var qz = box[k][2];
        var w = qx*m[3] + qy*m[7] + qz*m[11] + m[15];
        var x = qx*m[0] + qy*m[4] + qz*m[8] + m[12];
        if(x <= w) in_p |= 1;
        if(x >= -w) in_p |= 2;
        if(in_p === 63) {
          return true;
        }
        x = qx*m[1] + qy*m[5] + qz*m[9] + m[13];
        if(x <= w) in_p |= 4;
        if(x >= -w) in_p |= 8;
        if(in_p === 63) {
          return true;
        }
        x = qx*m[2] + qy*m[6] + qz*m[10] + m[14];
        if(x <= w) in_p |= 16;
        if(x >= 0) in_p |= 32;
        if(in_p === 63) {
          return true;
        }
      }
    }
	}
	return false;
}
