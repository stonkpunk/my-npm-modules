var createCamera = require('../first-person-camera.js')

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
      this.down('W'), this.down('S'), this.down('A'), this.down('D'),
      this.down('space'), this.down('shift'),
    ], this.mouse, this.prevMouse)
  }
})
