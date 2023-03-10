// this is based the boids example by takashi
// Copyright (c) 2023 by takashi (https://codepen.io/tksiiii/pen/jzBZdo)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

const THREE = require("./utils/three-vector-stuff.js");

var _params = params = {
    maxSpeed: 7,
    seek: {
        maxForce: 0.04
    },
    align: {
        effectiveRange: 85,
        maxForce: 0.16
    },
    separate: {
        effectiveRange: 70,
        maxForce: 0.2
    },
    choesin: {
        effectiveRange: 200
    }
};

class BoidWorld {
    constructor(creatures = []) {
        this.creatures = creatures;
        this.params = _params;
    }

    update() {
        // console.log('update boids positions...');
        this.creatures.forEach((creature) => {
            // boid
            creature.applyForce(this.align(creature));
            creature.applyForce(this.separate(creature));
            creature.applyForce(this.choesin(creature));

            // aboid light ball
            creature.applyForce(this.avoidLightBall(creature, {x:0,y:0,z:0}, 10));

            // aboid container
            // if (guiControls.container === 'ball') {
            var ballContainerRadius = 500;
            creature.applyForce(this.avoidBallContainer(creature, ballContainerRadius));
            // } else if (guiControls.container === 'box') {
            //     creature.applyForce(this.avoidBoxContainer(creature, boxContainer.mesh.geometry.parameters.width / 2,
            //         boxContainer.mesh.geometry.parameters.height / 2,
            //         boxContainer.mesh.geometry.parameters.depth / 2
            //     ));
            // }

            creature.update();
        });
    }

    setBoost() {
        this.creatures.forEach((creature) => {
            if (creature.boost.length() === 0) {
                creature.boost.x = getRandomNum(10, -10) * 0.1;
                creature.boost.y = getRandomNum(10, -10) * 0.1;
                creature.boost.z = getRandomNum(10, -10) * 0.1;
                creature.boost.normalize();
                creature.boost.multiplyScalar(this.params.maxSpeed);
            }
        });
    }

    seek(currentCreature, target = new THREE.Vector3()) {
        const maxSpeed = this.params.maxSpeed;;
        const maxForce = this.params.seek.maxForce;
        const toGoalVector = new THREE.Vector3();
        toGoalVector.subVectors(target, currentCreature.mesh.position);
        const distance = toGoalVector.length();
        toGoalVector.normalize();
        toGoalVector.multiplyScalar(maxSpeed);
        const steerVector = new THREE.Vector3();
        steerVector.subVectors(toGoalVector, currentCreature.velocity);
        // limit force
        if (steerVector.length() > maxForce) {
            steerVector.clampLength(0, maxForce);
        }
        return steerVector;
    }

    align(currentCreature) {
        const sumVector = new THREE.Vector3();
        let cnt = 0;
        const maxSpeed = this.params.maxSpeed;;
        const maxForce = this.params.align.maxForce;
        const effectiveRange = this.params.align.effectiveRange;
        const steerVector = new THREE.Vector3();

        this.creatures.forEach((creature) => {
            const dist = currentCreature.mesh.position.distanceTo(creature.mesh.position);
            if (dist > 0 && dist < effectiveRange) {
                sumVector.add(creature.velocity);
                cnt++;
            }
        });

        if (cnt > 0) {
            sumVector.divideScalar(cnt);
            sumVector.normalize();
            sumVector.multiplyScalar(maxSpeed);

            steerVector.subVectors(sumVector, currentCreature.velocity);
            // limit force
            if (steerVector.length() > maxForce) {
                steerVector.clampLength(0, maxForce);
            }
        }

        return steerVector;
    }

    separate(currentCreature) {
        const sumVector = new THREE.Vector3();
        let cnt = 0;
        const maxSpeed = this.params.maxSpeed;
        const maxForce = this.params.separate.maxForce;
        const effectiveRange = this.params.separate.effectiveRange;
        const steerVector = new THREE.Vector3();

        this.creatures.forEach((creature) => {
            const dist = currentCreature.mesh.position.distanceTo(creature.mesh.position);
            if (dist > 0 && dist < effectiveRange) {
                let toMeVector = new THREE.Vector3();
                toMeVector.subVectors(currentCreature.mesh.position, creature.mesh.position);
                toMeVector.normalize();
                toMeVector.divideScalar(dist);
                sumVector.add(toMeVector);
                cnt++;
            }
        });

        if (cnt > 0) {
            sumVector.divideScalar(cnt);
            sumVector.normalize();
            sumVector.multiplyScalar(maxSpeed);

            steerVector.subVectors(sumVector, currentCreature.velocity);
            // limit force
            if (steerVector.length() > maxForce) {
                steerVector.clampLength(0, maxForce);
            }
        }

        return steerVector;
    }

    choesin(currentCreature) {
        const sumVector = new THREE.Vector3();
        let cnt = 0;
        const effectiveRange = this.params.choesin.effectiveRange;
        const steerVector = new THREE.Vector3();

        this.creatures.forEach((creature) => {
            const dist = currentCreature.mesh.position.distanceTo(creature.mesh.position);
            if (dist > 0 && dist < effectiveRange) {
                sumVector.add(creature.mesh.position);
                cnt++;
            }
        })

        if (cnt > 0) {
            sumVector.divideScalar(cnt);
            steerVector.add(this.seek(currentCreature, sumVector));
        }

        return steerVector;
    }

    avoid(currentCreature, wall = new THREE.Vector3()) {
        // currentCreature.mesh.geometry.computeBoundingSphere();
        // const boundingSphere = currentCreature.mesh.geometry.boundingSphere;

        const toMeVector = new THREE.Vector3();
        toMeVector.subVectors(currentCreature.mesh.position, wall);

        const distance = toMeVector.length() - currentCreature.mesh.radius * 2;
        const steerVector = toMeVector.clone();
        steerVector.normalize();
        steerVector.multiplyScalar(1 / (Math.pow(distance, 2)));
        return steerVector;
    }

    avoidBoxContainer(currentCreature, rangeWidth = 80, rangeHeight = 80, rangeDepth = 80) {
        const sumVector = new THREE.Vector3();
        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(rangeWidth, currentCreature.mesh.position.y, currentCreature.mesh.position.z)));
        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(-rangeWidth, currentCreature.mesh.position.y, currentCreature.mesh.position.z)));
        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(currentCreature.mesh.position.x, rangeHeight, currentCreature.mesh.position.z)));
        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(currentCreature.mesh.position.x, -rangeHeight, currentCreature.mesh.position.z)));
        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(currentCreature.mesh.position.x, currentCreature.mesh.position.y, rangeDepth)));
        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(currentCreature.mesh.position.x, currentCreature.mesh.position.y, -rangeDepth)));
        sumVector.multiplyScalar(Math.pow(currentCreature.velocity.length(), 3));
        return sumVector;
    }

    avoidBallContainer(currentCreature, radius = 500) {
        // currentCreature.mesh.geometry.computeBoundingSphere();
        // const boundingSphere = currentCreature.mesh.geometry.boundingSphere;

        const distance = radius - currentCreature.mesh.position.length() - currentCreature.mesh.radius;

        const steerVector = currentCreature.mesh.position.clone();
        steerVector.normalize();
        steerVector.multiplyScalar(-1 / (Math.pow(distance, 2)));
        steerVector.multiplyScalar(Math.pow(currentCreature.velocity.length(), 3));
        return steerVector;
    }

    avoidLightBall(currentCreature, ballPosition, ballRadius) {

        // currentCreature.mesh.geometry.computeBoundingSphere();
        // const boundingSphere = currentCreature.mesh.geometry.boundingSphere;
        const toMeVector = new THREE.Vector3();
        toMeVector.subVectors(currentCreature.mesh.position, ballPosition);
        const distance = toMeVector.length() - ballRadius - currentCreature.mesh.radius;

        const steerVector = currentCreature.mesh.position.clone();

        if (distance < 100) {

            const axis = new THREE.Vector3();
            axis.crossVectors(toMeVector, currentCreature.velocity);
            axis.normalize();

            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(axis, THREE.Math.degToRad(90));

            steerVector.applyQuaternion(quaternion);
            steerVector.normalize();

            steerVector.multiplyScalar(1 / distance);
            steerVector.multiplyScalar(currentCreature.velocity.length() * 10);

        } else {
            steerVector.multiplyScalar(0);
        }

        return steerVector;
    }
}

module.exports = BoidWorld;