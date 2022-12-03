module.exports.materalCmd = function(regl){
    const material = regl({
        vert: `
  precision mediump float;
  attribute vec3 position, normal;
  uniform mat4 pvMatrix, projection, model, view;
  varying vec3 vnormal;
  void main () {
    vnormal = normal;
    gl_Position = pvMatrix * model * vec4(position, 1.0);
  }
  `,

        frag: `
  precision mediump float;
  varying vec3 vnormal;
  void main () {
    gl_FragColor = vec4(abs(vnormal), 1.0);
  }
  `,
    })
    return material;
}

