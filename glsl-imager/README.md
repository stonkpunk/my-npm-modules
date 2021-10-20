# glsl-imager

Enjoy GLSL shaders from the comfort of your terminal!

Or, save output as a JPG, GIF, PNG, or PPM file.

```javascript
renderToConsole(width,height,vertexSrc,fragmentSrc);
renderToFile("filename.jpg",width,height,vertexSrc,fragmentSrc);
```

![result](https://i.imgur.com/HpHADzx.png)

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [See Also](#see-also)

## Installation

```sh
npm i glsl-imager
```

## Usage

Mandelbrot shader example. Shaders originally from [headless-gl](https://github.com/stackgl/headless-gl/blob/master/example/fractals/mandelbrot.js)

Warning - `renderToConsole` should be used for low resolutions only -- if you want to render regular size images, use `renderToFile`

```javascript
var width = 64.0
var height = 64.0

var vertexSrc = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position,0,1);
  }
  `
var fragmentSrc = `
  precision mediump float;
  const int max_iterations = 255;
  const float width = ${width.toFixed(1)};
  const float height = ${height.toFixed(1)};

  vec2 complex_square( vec2 v ) {
    return vec2(
      v.x * v.x - v.y * v.y,
      v.x * v.y * 2.0
    );
  }

  void main()
  {
    vec2 uv = gl_FragCoord.xy - vec2(width,height) * 0.5;
    uv *= 2.5 / min( width, height );

#if 0 // Mandelbrot
    vec2 c = uv;
    vec2 v = vec2( 0.0 );
    float scale = 0.06;
#else // Julia
    vec2 c = vec2( 0.285, 0.01 );
    vec2 v = uv;
    float scale = 0.01;
#endif

    int count = max_iterations;

    for ( int i = 0 ; i < max_iterations; i++ ) {
      v = c + complex_square( v );
      if ( dot( v, v ) > 4.0 ) {
        count = i;
        break;
      }
    }

    gl_FragColor = vec4( float( count ) * scale );
  }
  `


var renderer = require('glsl-imager');
renderer.renderToConsole(width,height,vertexSrc,fragmentSrc);

//or, save directly to file...
//renderer.renderToFile("test_ppm.ppm",width,height,vertexSrc,fragmentSrc);
//renderer.renderToFile("test_png.png",width,height,vertexSrc,fragmentSrc);
//renderer.renderToFile("test_jpg.jpg",width,height,vertexSrc,fragmentSrc);
//renderer.renderToFile("test_gif.gif",width,height,vertexSrc,fragmentSrc);

//alternatively, get+save raw pixel data...
//var pixelDataRaw = renderer.render(width,height,vertexSrc,fragmentSrc);
//renderer.savePixelsToFile("test_png2.png",pixelDataRaw,width,height);
```

**Result**

![result](https://i.imgur.com/HpHADzx.png)

## See Also

- [ascii-data-image](https://www.npmjs.com/package/ascii-data-image)
- [glsl2img](https://www.npmjs.com/package/glsl2img)


