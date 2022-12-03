regl-primitive
==============

Create a [regl](https://github.com/regl-project/regl) draw command from a
[simplicial complex](https://github.com/mikolalysenko/simplicial-complex).

## Example

```js
const primitive = require('regl-primitive')
const bunny = require('bunny')
const regl = require('regl')()

const camera = require('regl-camera')(regl, {
  center: [0, 2.5, 0],
  distance: 20
})

const drawBunny = primitive(regl, bunny, {
  vert: `
  precision mediump float;
  attribute vec3 position, normal;
  uniform mat4 projection, view;
  varying vec3 vnormal;
  void main () {
    vnormal = normal;
    gl_Position = projection * view * vec4(position, 1.0);
  }
  `,

  frag:`
  precision mediump float;
  varying vec3 vnormal;
  void main () {
    gl_FragColor = vec4(abs(vnormal), 1.0);
  }
  `
})

regl.frame(() => camera(() => drawBunny()))

```
## Installation

```sh
$ npm install regl-primitive --save
```

See [demo here](https://jwerle.github.io/regl-primitive/example/)

## API

### Constructor

#### `const primitive = require('regl-primitive')(regl, complex[, options])`

where `regl-primitive` expects the following arguments:

* `regl` - A handle to a regl instance
* `complex` - An object exposing at least `positions` (See [simplicial-complex](https://github.com/mikolalysenko/simplicial-complex))
* `[configuration]` - An optional object that extends the
  initial state used to create a regl draw command

## License

MIT
