var bbp = require('./bb-pts.js');
var bbb = require('./bb-bbs.js');

function bbTris(tris){
    var bbPerTri = tris.map(tri=>bbp(tri));
    return bbb(bbPerTri);
}

module.exports=bbTris;