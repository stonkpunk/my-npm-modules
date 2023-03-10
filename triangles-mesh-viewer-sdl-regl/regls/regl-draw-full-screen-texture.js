var drawFullScreenTextureCommand = function(regl, DO_USE_FBO, fbo, typedArrayTexture){
    return regl({
        context: {texxxture1: function (context, props) {return DO_USE_FBO ? fbo.color[0] : typedArrayTexture}},
        frag: `
  precision mediump float;
  uniform sampler2D texxxture;
  varying vec2 uv;
  void main () {
    gl_FragColor = texture2D(texxxture, 1.0-uv);
  }`,

        vert: `
  precision mediump float;
  attribute vec2 position;
  varying vec2 uv;
  void main () {
    uv = position;
    gl_Position = vec4(1.0 - 2.0 * position, 0, 1);
  }`,

        attributes: {
            position: [
                -2, 0,
                0, -2,
                2, 2]
        },

        uniforms: {
            texxxture: regl.context('texxxture1')//note that we can NOT use the field name "texture"
        },

        count: 3
    });
};

module.exports = {drawFullScreenTextureCommand};