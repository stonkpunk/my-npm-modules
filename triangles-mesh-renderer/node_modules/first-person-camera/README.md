# first-person-camera

A generic first person camera for WebGL.

[![first-person-camera](https://nodei.co/npm/first-person-camera.png?mini=true)](https://nodei.co/npm/first-person-camera)

## example

```js
var createCamera = require('first-person-camera')

var viewer = require('mesh-viewer')({
  clearColor: [0.2, 0.3, 0.8, 1],
  pointerLock: true,
})

var bunny

viewer.on('viewer-init', function() {
  this.camera = createCamera()
  bunny = this.createMesh(require('bunny'))
})

viewer.on('gl-render', function() {
  bunny.draw()
})

viewer.on('tick', function() {
  if (this.pointerLock) {
    this.camera.control(this.frameTime, [
      this.down('W'), this.down('S'),
      this.down('A'), this.down('D'),
      this.down('space'), this.down('shift'),
    ], this.mouse, this.prevMouse)
  }
})
```

## install

```shell
npm install first-person-camera
```

## api

```js
var createCamera = require('first-person-camera')
```

### `var camera = createCamera(opts)`
Create a first person style camera. Each of the following options are optional:

* `position` {vec3} Initial position of the camera.
* `rotation` {vec3} Initial rotation of the camera.
* `positionSpeed` {float} The speed in which the position moves.
* `rotationSpeed` {float} The speed in which the camera rotates.

### `camera.position`
A `vec3` or `[x,y,z]` of the position of the camera. The position can be obtained or set manually through this property.

### `camera.rotation`
A `vec3` or `[x,y,z]` of the rotation of the camera in radians. The rotation can be obtained or set manually through this property.

### `camera.control(frameTime, direction, mouse, prevMouse)`
A convenience method for connecting controls to the camera.

* `frameTime` The delta time that has changed in milliseconds.
* `direction` Array of booleans in which direction to move: `[forward, backward, left, right, up, down]`
* `mouse` Array of `[x,y]` coordinates of the current mouse position.
* `prevMouse` Array of `[x,y]` coordinates of the mouse position from the previous frame.

### `camera.move(direction)`
Moves the camera by the direction `[x,y,z]`.

### `camera.pointer(mouse, prevMouse)`
Rotates the camera based on the mouse vector. Both `mouse` and `prevMouse` are `[x,y]` coordinates.

### `camera.view([out])`
Retrieve the view matrix for the camera.

## license
(c) 2015 Kyle Robinson Young. MIT License
