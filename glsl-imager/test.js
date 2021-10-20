//see headless-gl-licenses.txt for licenses from headless-gl

var width = 32.0
var height = 32.0

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


var renderer = require('./index.js');
renderer.renderToConsole(width,height,vertexSrc,fragmentSrc);

//save directly to file...
//renderer.renderToFile("test_ppm.ppm",width,height,vertexSrc,fragmentSrc);
//renderer.renderToFile("test_png.png",width,height,vertexSrc,fragmentSrc);
//renderer.renderToFile("test_jpg.jpg",width,height,vertexSrc,fragmentSrc);
//renderer.renderToFile("test_gif.gif",width,height,vertexSrc,fragmentSrc);

//alternatively, get+save raw pixel data...
//var pixelDataRaw = renderer.render(width,height,vertexSrc,fragmentSrc);
//renderer.savePixelsToFile("test_png2.png",pixelDataRaw,width,height);