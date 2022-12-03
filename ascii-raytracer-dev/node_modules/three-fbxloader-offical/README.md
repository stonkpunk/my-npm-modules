## three-fbxloader-offical

[THREE.FBXLoader](https://threejs.org/examples/js/loaders/FBXLoader.js) Threejs fbxload with offical apply 'inflate.min.js' its fluent

## install

`npm i --save three-fbxloader-offical`

## usage

```js

let THREE = require('three')
let FBXLoader = require('three-fbxloader-offical')

let scene = new THREE.Scene()

let loader = new FBXLoader();

loader.load(url, function (object) {
  scene.add(object)
})

```