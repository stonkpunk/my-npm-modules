// this is based the boids example by takashi
// Copyright (c) 2023 by takashi (https://codepen.io/tksiiii/pen/jzBZdo)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const THREE = require("./utils/three-vector-stuff.js");

const getRandomNum = (max = 0, min = 0) => Math.floor(Math.random() * (max + 1 - min)) + min;

class Creature {
    constructor() {
        this.color = [Math.random(),Math.random(),Math.random()];
        this.mesh = {position: new THREE.Vector3(0,0,0), radius: 1};//new THREE.Mesh(geometry, material);
        // const radius = getRandomNum(500, 1000);
        // const theta = THREE.Math.degToRad(getRandomNum(180));
        // const phi = THREE.Math.degToRad(getRandomNum(360));
        this.mesh.position.x = getRandomNum(-50, 50);//Math.sin(theta) * Math.cos(phi) * radius;
        this.mesh.position.y = getRandomNum(-50, 50);//Math.sin(theta) * Math.sin(phi) * radius;
        this.mesh.position.z = getRandomNum(-50, 50);//Math.cos(theta) * radius;
        this.velocity = new THREE.Vector3(getRandomNum(100, -100) * 0.1, getRandomNum(100, -100) * 0.1, getRandomNum(100, -100) * 0.1);
        this.acceleration = new THREE.Vector3();
        this.wonderTheta = 0;
        this.maxSpeed = 7;//guiControls.params.maxSpeed;
        this.boost = new THREE.Vector3();
    }

    applyForce(f) {
        this.acceleration.add(f.clone());
    }

    update() {
        const maxSpeed = this.maxSpeed;

        // boost
        this.applyForce(this.boost);
        this.boost.multiplyScalar(0.9);
        if (this.boost.length() < 0.01) {
            this.boost = new THREE.Vector3();
        }

        // update velocity
        this.velocity.add(this.acceleration);

        // limit velocity
        if (this.velocity.length() > maxSpeed) {
            this.velocity.clampLength(0, maxSpeed);
        }

        // update position
        this.mesh.position.add(this.velocity);

        // reset acc
        this.acceleration.multiplyScalar(0);

        // head
        const head = this.velocity.clone();
        head.multiplyScalar(10);
        head.add(this.mesh.position);
        // this.mesh.lookAt(head);
    }
}

module.exports = Creature;