var art = require('./index.js');
var fs = require("fs")
var readimage = require("readimage")
var filedata = fs.readFileSync("./cat.png")

readimage(filedata, function (err, image) {
    if (err) {
        console.log("failed to parse the image")
        console.log(err)
    }

    var w = image.width;
    var h = image.height;
    var d = image.frames[0].data;

    var myTextureFunction = function(u,v){
        var xc = Math.floor(u*w);
        var yc = Math.floor(v*h);
        var o = (yc*h+xc)*4;
        return [d[o]/255, d[o+1]/255, d[o+2]/255] //return [r,g,b] in range 0...1
    }

    var myUvFunction = function(x,y,z){
        return [Math.abs(x/1.0)%1.0,Math.abs(z/1.0)%1.0]; //return u,v coords
    }

    var config = {
        distanceFunction: art.distanceFunctions.dfMaze,
        raytraceFunction: art.distanceFunctions.dfMazeTrace,
        uvFunction: myUvFunction,
        textureFunction: myTextureFunction,
        resolution: 64,
        aspectRatio: 1.0,
        mouseControl:true,
    }

    art.runScene(config);
})




