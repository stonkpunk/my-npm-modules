function repeat(_tris,xr=3,zr=3, padding=0){

    function trianglesBounds(tris){
        var pts=[];
        for(var i=0;i<tris.length;i++){
            pts.push(tris[i][0]);
            pts.push(tris[i][1]);
            pts.push(tris[i][2]);
        }
        return boundingBlockOfPts(pts);
    }

    function boundingBlockOfPts(sop){
        //var eps = 0.001;
        //var L = 9999999;
        var bb = [sop[0],sop[0]];//[[L,L,L],[-L,-L,-L]];//[sop[0],sop[0]];

        for(var i=0; i<sop.length;i++){
            var p = sop[i];
            var xLo = Math.min(Math.min(p[0],bb[0][0]), Math.min(p[0],bb[0][0]));
            var xHi = Math.max(Math.max(p[0],bb[1][0]), Math.max(p[0],bb[1][0]));
            var yLo = Math.min(Math.min(p[1],bb[0][1]), Math.min(p[1],bb[0][1]));
            var yHi = Math.max(Math.max(p[1],bb[1][1]), Math.max(p[1],bb[1][1]));
            var zLo = Math.min(Math.min(p[2],bb[0][2]), Math.min(p[2],bb[0][2]));
            var zHi = Math.max(Math.max(p[2],bb[1][2]), Math.max(p[2],bb[1][2]));
            bb=[[xLo,yLo,zLo],[xHi,yHi,zHi]];
        }

        return bb;
    };

    function trianglesShiftedCopy(tris, shift){
        return tris.map(function(tri){
            return tri.map(function(pt){
                return [pt[0]+shift[0],
                    pt[1]+shift[1],
                    pt[2]+shift[2]];
            })
        });
    }

    function sectorDimensions(s){
        return [
            s[1][0] - s[0][0],
            s[1][1] - s[0][1],
            s[1][2] - s[0][2]
        ];
    }

    var bbTris = trianglesBounds(_tris);
    var bbDims = sectorDimensions(bbTris);

    bbDims[0]+=padding;
    bbDims[1]+=padding;
    bbDims[2]+=padding;

    var allTris = [];

    for(var x=0;x<xr;x++){
        for(var z=0;z<zr;z++){
            allTris.push(...trianglesShiftedCopy(_tris,[bbDims[0]*x,0,bbDims[2]*z]));
        }
    }

    return allTris;
}

module.exports = {repeat};