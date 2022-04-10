var st = require('simplify-triangles');

function generateHeightmapMeshXZ(resolution=64, boundingBox_XZ=[[0,0,0],[resolution,resolution,resolution]], distanceFunction=dfHillsWorld2D, yCoordinate=0.0,df_scaleXZ=100.0,df_scaleY=4.0, simplifyFactor=1, doAddSkirt=true, skirtY=0){
    var res = resolution;
    var df = distanceFunction;
    var bb = boundingBox_XZ;
    var x0 = bb[0][0];
    var x1 = bb[1][0];
    var z0 = bb[0][2];
    var z1 = bb[1][2];

    var xStep = (x1-x0)/res;
    var zStep = (z1-z0)/res;

    var tris = [];
    var sy = yCoordinate;

    for(var x=x0;x<x1;x+=xStep){
        for(var z=z0;z<z1;z+=zStep){

            // x axis ==> , z axis ↓

            // p0----p1
            //  |\    |
            //  | \ 1 |
            //  |  \  |
            //  | 0 \ |
            // p2----p3

            var p0v = df(x,sy,z,df_scaleXZ)*df_scaleY;
            var p1v = df(x+xStep,sy,z,df_scaleXZ)*df_scaleY;
            var p2v = df(x,sy,z+zStep,df_scaleXZ)*df_scaleY;
            var p3v = df(x+xStep,sy,z+zStep,df_scaleXZ)*df_scaleY;

            if(doAddSkirt){
                if(x==x0 || z==z0 || x>x1-xStep || z>z1-zStep){
                    p0v=skirtY;
                }
                if(x+xStep==x0 || z==z0 || x+xStep>x1-xStep || z>z1-zStep){
                    p1v=skirtY;
                }
                if(x==x0 || z+zStep==z0 || x>x1-xStep || z+zStep>z1-zStep){
                    p2v=skirtY;
                }
                if(x+xStep==x0 || z+zStep==z0 || x+xStep>x1-xStep || z+zStep>z1-zStep){
                    p3v=skirtY;
                }
            }

            var p0 = [x,p0v,z];
            var p1 = [x+xStep,p1v,z];
            var p2 = [x,p2v,z+zStep];
            var p3 = [x+xStep,p3v,z+zStep];

            var tri0 = [p3,p0,p2];
            var tri1 = [p1,p0,p3]

            tris.push(tri0,tri1);
        }
    }

    if(doAddSkirt){
        //  bottom plate
        // a - - b
        // |  x  |
        // c - - d

        // var x0 = bb[0][0];
        // var x1 = bb[1][0];
        // var z0 = bb[0][2];
        // var z1 = bb[1][2];

        var a = [x0,skirtY,z1];
        var b = [x1,skirtY,z1];
        var c = [x0,skirtY,z0];
        var d = [x1,skirtY,z0];

        tris.push([b,a,d]);
        tris.push([c,d,a]);

        //console.log([b,a,d],[c,d,a]);
    }

    if(simplifyFactor<1){
        tris = st.simplify(tris,simplifyFactor);
    }

    return tris;
}

function generateHeightmapPtsXZ(resolution=64, boundingBox, distanceFunction, yCoordinate=0.0){
    var res = resolution;
    var df = distanceFunction;
    var bb = boundingBox;
    var x0 = bb[0][0];
    var x1 = bb[1][0];
    var z0 = bb[0][2];
    var z1 = bb[1][2];

    var xStep = (x1-x0)/res;
    var zStep = (z1-z0)/res;

    var pts = [];
    var sy = yCoordinate;

    for(var x=x0;x<x1;x+=xStep){
        for(var z=z0;z<z1;z+=zStep){
            var p0v = df(x,sy,z);
            var p0 = [x,p0v,z];
            pts.push(p0);
        }
    }

    return pts;
}

const {SimplexNoise} = require('simplex-noise');
const simplex = new SimplexNoise(1004);

var dfHillsWorld2D = function(x, y, z, _s=20.0){ //hillsworldoctaves2d
    var s = _s
    var hills =(
        simplex.noise2D(x/s*32,z/s*32)/32.0
        +simplex.noise2D(x/s*16,z/s*16)/16.0
        +simplex.noise2D(x/s*8,z/s*8)/8.0
        +simplex.noise2D(x/s*4,z/s*4)/4.0
        +simplex.noise2D(x/s*2,z/s*2)/2.0
        +simplex.noise2D(x/s,z/s)*1
        +simplex.noise2D(x/s/2,z/s/2))  ;
    var water = -0.10; //0
    return hills > water ? hills*2 : water+ (Math.random())*0.00001 ;//+ Math.random()*0.001;
}

var dfHillsWorld2D_smooth = function(x, y, z, _s=20.0){
    var s = _s
    var hills = simplex.noise2D(x/s*4,z/s*4)/2.0;
    return hills ;//> water ? hills*2 : water+ (Math.random())*0.00001 ;//+ Math.random()*0.001;
}

module.exports = {dfHillsWorld2D,dfHillsWorld2D_smooth,  generateHeightmapMeshXZ, generateHeightmapPtsXZ}