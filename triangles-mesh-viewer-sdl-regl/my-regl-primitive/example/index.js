'use strict'

/**
 * Module dependencies.
 */

const Primitive = require('../')
const Camera = require('regl-camera')
const teapot = require('teapot')
const bunny = require('bunny')
const clamp = require('clamp')
const regl = require('multi-regl')()

// primitives
const Icosphere = require('primitive-icosphere')
const Capsule = require('primitive-capsule')
const Sphere = require('primitive-sphere')
const Torus = require('primitive-torus')
const Cube = require('primitive-cube')

// vertex shader
const vert = `
precision mediump float;
attribute vec3 position, normal;
uniform mat4 projection, view;
varying vec3 vnormal;
void main () {
  vnormal = normal;
  gl_Position = projection * view * vec4(position, 1.0);
}
`

// fragment shader
const frag = `
precision mediump float;
varying vec3 vnormal;
void main () {
  gl_FragColor = vec4(abs(vnormal), 1.0);
}
`

// dom query helper
const dom = (s) => document.querySelector(s)

// regl contexts
const context = {
  icosphere: regl(dom('#icosphere')),
  capsule: regl(dom('#capsule')),
  sphere: regl(dom('#sphere')),
  teapot: regl(dom('#teapot')),
  torus: regl(dom('#torus')),
  bunny: regl(dom('#bunny')),
  cube: regl(dom('#cube')),
}

// one camera per context
const cameras = {
  icosphere: Camera(context.icosphere, {mouse: false}),
  capsule: Camera(context.capsule, {mouse: false}),
  sphere: Camera(context.sphere, {mouse: false}),
  teapot: Camera(context.teapot, {distance: 40, mouse: false}),
  bunny: Camera(context.bunny, {center: [0, 2.5, 0], distance: 20, mouse: false}),
  torus: Camera(context.torus, {mouse: false}),
  cube: Camera(context.cube, {mouse: false}),
}

// geometry
const geometry = {
  icosphere: Icosphere(),
  capsule: Capsule(),
  sphere: Sphere(1),
  teapot: teapot,
  torus: Torus(),
  bunny: bunny,
  cube: Cube(),
}

// regl primitives
const primitives = {
  icosphere: Primitive(context.icosphere, geometry.icosphere, {vert, frag}),
  capsule: Primitive(context.capsule, geometry.capsule, {vert, frag}),
  sphere: Primitive(context.sphere, geometry.sphere, {vert, frag}),
  teapot: Primitive(context.teapot, geometry.teapot, {vert, frag}),
  torus: Primitive(context.torus, geometry.torus, {vert, frag}),
  bunny: Primitive(context.bunny, geometry.bunny, {vert, frag}),
  cube: Primitive(context.cube, geometry.cube, {vert, frag}),
}

// export for console usage
Object.assign(window, {
  primitives,
  geometry,
  cameras,
  context,
  dom,
})

for (let key in context) {
  const primitive = primitives[key]
  const camera = cameras[key]
  const ctx = context[key]
  let theta = 0

  // render loop !
  ctx.frame(({time}) => {
    ctx.clear({ color: [0, 0, 0, 0], depth: true })
    camera.theta += 0.01
    camera({ ...camera }, () => { primitive() })
  })
}
