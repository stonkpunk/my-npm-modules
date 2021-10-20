//based on the headless-gl mandelbrot example
//https://github.com/stackgl/headless-gl/blob/master/example/fractals/mandelbrot.js
//see headless-gl-licenses.txt for licenses from headless-gl

var createContext = require('gl')
var utils = require('./headless-gl-files/utils.js')
var adi = require('ascii-data-image');

function main (width, height, vertexSrc, fragmentSrc) {
    // Create context

    var gl = createContext(width, height)

    // setup a GLSL program
    var program = utils.createProgramFromSources(gl, [vertexSrc, fragmentSrc])

    if (!program) {
        return
    }
    gl.useProgram(program)

    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, 'a_position')

    // Create a buffer and put a single clipspace rectangle in
    // it (2 triangles)
    var buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0]),
        gl.STATIC_DRAW)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // draw
    gl.drawArrays(gl.TRIANGLES, 0, 6)

    var pixels = new Uint8Array(width * height * 4)
    gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels)

    gl.destroy()

    return pixels;
}

function savePixelsToFile(filename,pixels,width,height){
    var path = require('path')
    var ext = path.extname(filename).toLowerCase();

    switch (ext){
        case '.ppm':
            utils.pixelsToFile_ppm(pixels, width,height, filename);
            break;
        case '.jpg':
            utils.pixelsToFile_jpg(pixels, width,height, filename);
            break;
        case '.gif':
            utils.pixelsToFile_gif(pixels, width,height, filename);
            break;
        case '.png':
            utils.pixelsToFile_png(pixels, width,height, filename);
            break;
    }
}

function transformPixels(pixels, width, height){

    var img = adi.generateRandomImgData_rgb({x: width, y: height});

    for(var i = 0; i < pixels.length; i += 4) {

        var pxNo = Math.floor(i/4);
        var x = pxNo%width;
        var y = Math.floor(pxNo/width);

        img[y][x][0]=pixels[i + 0]/255.0;
        img[y][x][1]=pixels[i + 1]/255.0;
        img[y][x][2]=pixels[i + 2]/255.0;
    }
    return img;
}

function renderToConsole(width, height,vertexSrc,fragmentSrc){
    var pixelDataRaw = main(width,height,vertexSrc,fragmentSrc);
    console.log(adi.data2Img_rgb(transformPixels(pixelDataRaw,width,height)))
}

function renderToFile(fileName, width, height, vertexSrc, fragmentSrc){
    var pixelDataRaw = main(width,height,vertexSrc,fragmentSrc);
    savePixelsToFile(fileName,pixelDataRaw, width, height);
}

module.exports.renderToConsole = renderToConsole;
module.exports.renderToFile = renderToFile;
module.exports.savePixelsToFile = savePixelsToFile;
module.exports.render = main;
module.exports.transformPixels = transformPixels;
