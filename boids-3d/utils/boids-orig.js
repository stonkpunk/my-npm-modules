// this is based the boids example by takashi
// Copyright (c) 2023 by takashi (https://codepen.io/tksiiii/pen/jzBZdo)
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

let boid;
let creatureMeshGroup = new THREE.Group();
const creatureNum = 500;

const colorPalette = {
    screenBg: 0x041f60,
    containerBox: 0xffffff,
    containerBall: 0xffffff,
    ambientLight: 0x666666,
    directionalLight: 0xb4f5f0,
    spotLight: 0x2ceef0
}

const getRandomNum = (max = 0, min = 0) => Math.floor(Math.random() * (max + 1 - min)) + min;

const render = () => {
    orbitControls.update();
    boid.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}

const onResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

/* datGUI
-------------------------------------------------------------*/
let gui = new dat.GUI();
let guiControls = new function () {
    this.container = 'ball';
    this.diffuse = () => {
        boid.setBoost();
    }
    this.params = {
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
    }
}
gui.add(guiControls, 'container', ['ball', 'box']).onChange((e) => {

    if (guiControls.container === 'ball') {
        // for box
        scene.remove(spotLight1);
        scene.remove(boxContainer.mesh);
        // for ball
        scene.add(spotLight2);
        scene.add(ballContainer.mesh);
    } else if (guiControls.container === 'box') {
        // for ball
        scene.remove(spotLight2);
        scene.remove(ballContainer.mesh);
        // for box
        scene.add(spotLight1);
        scene.add(boxContainer.mesh);
    }

    generateBoid();
});

gui.add(guiControls, 'diffuse');

// gui.add(guiControls.params, 'maxSpeed', 5, 20);

// const folderAlign = gui.addFolder('align');
// folderAlign.add(guiControls.params.align, 'effectiveRange', 0, 200);
// folderAlign.add(guiControls.params.align, 'maxForce', 0, 0.3);
// folderAlign.open();

// const folderSeparate = gui.addFolder('separate');
// folderSeparate.add(guiControls.params.separate, 'effectiveRange', 0, 200);
// folderSeparate.add(guiControls.params.separate, 'maxForce', 0, 0.4);
// folderSeparate.open();

// const folderChoesin = gui.addFolder('choesin');
// folderChoesin.add(guiControls.params.choesin, 'effectiveRange', 0, 300);
// folderChoesin.add(guiControls.params.seek, 'maxForce', 0, 0.05);
// folderChoesin.open();

class BoxContainer {
    constructor(width = 100, height = 100, depth = 100, color = 0xffffff) {
        const geometry = new THREE.BoxGeometry(width, height, depth, 10, 10, 10);
        const material = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            wireframe: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

class BallContainer {
    constructor(radius = 500, widthSegments = 10, heightSegments = 10, color = 0xffffff) {
        const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        // const material = new THREE.MeshPhongMaterial({
        //     color: color,
        //     transparent: true,
        //     opacity: 0.1,
        //     wireframe: false,
        //     depthWrite: true,
        //     blending: THREE.AdditiveBlending
        // });
        const material = new THREE.MeshLambertMaterial({
            color: color,
            transparent: true,
            opacity: 0.2,
            wireframe: false,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

class PointLightBall {
    constructor(radius = 500, widthSegments = 100, heightSegments = 100, color = 0xFFFFFF) {
        this.meshGroup = new THREE.Group();

        // ball1
        let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        let material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.6,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        });
        this.ball1 = new THREE.Mesh(geometry, material);
        this.ball1.position.set(0, 0, 0);

        // ball2
        geometry = new THREE.SphereGeometry(30, 30, 30);
        material = new THREE.MeshBasicMaterial({
            color: 0xffffff
        });
        this.ball2 = new THREE.Mesh(geometry, material);
        this.ball2.position.set(0, 0, 0);

        // point light
        this.pointLight = this.getPointLight(radius);

        this.meshGroup.add(this.ball1);
        this.meshGroup.add(this.ball2);
        this.meshGroup.add(this.pointLight);
    }
    getPointLight(distance) {
        const pointLight = new THREE.PointLight(0xffffff);
        pointLight.intensity = 10;
        pointLight.distance = distance * 6;
        pointLight.decay = 3.5;
        pointLight.position.set(0, 0, 0);
        return pointLight;
    }
}

class Boid {
    constructor(creatures = []) {
        this.creatures = creatures;
        this.params = guiControls.params;
    }

    update() {
        this.creatures.forEach((creature) => {
            // boid
            creature.applyForce(this.align(creature));
            creature.applyForce(this.separate(creature));
            creature.applyForce(this.choesin(creature));

            // aboid light ball
            creature.applyForce(this.avoidLightBall(creature, pointLightBall.ball1));

            // aboid container
            if (guiControls.container === 'ball') {
                creature.applyForce(this.avoidBallContainer(creature, ballContainer.mesh.geometry.parameters.radius));
            } else if (guiControls.container === 'box') {
                creature.applyForce(this.avoidBoxContainer(creature, boxContainer.mesh.geometry.parameters.width / 2,
                    boxContainer.mesh.geometry.parameters.height / 2,
                    boxContainer.mesh.geometry.parameters.depth / 2
                ));
            }

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
        currentCreature.mesh.geometry.computeBoundingSphere();
        const boundingSphere = currentCreature.mesh.geometry.boundingSphere;

        const toMeVector = new THREE.Vector3();
        toMeVector.subVectors(currentCreature.mesh.position, wall);

        const distance = toMeVector.length() - boundingSphere.radius * 2;
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
        currentCreature.mesh.geometry.computeBoundingSphere();
        const boundingSphere = currentCreature.mesh.geometry.boundingSphere;

        const distance = radius - currentCreature.mesh.position.length() - boundingSphere.radius;

        const steerVector = currentCreature.mesh.position.clone();
        steerVector.normalize();
        steerVector.multiplyScalar(-1 / (Math.pow(distance, 2)));
        steerVector.multiplyScalar(Math.pow(currentCreature.velocity.length(), 3));
        return steerVector;
    }

    avoidLightBall(currentCreature, ball) {

        currentCreature.mesh.geometry.computeBoundingSphere();
        const boundingSphere = currentCreature.mesh.geometry.boundingSphere;
        const toMeVector = new THREE.Vector3();
        toMeVector.subVectors(currentCreature.mesh.position, ball.position);
        const distance = toMeVector.length() - ball.geometry.parameters.radius - boundingSphere.radius;

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

class Creature {
    constructor() {
        const geometry = new THREE.CylinderGeometry(1, 8, 25, 12);
        geometry.rotateX(THREE.Math.degToRad(90));
        const color = new THREE.Color(`hsl(${getRandomNum(360)}, 100%, 50%)`);
        const material = new THREE.MeshLambertMaterial({
            wireframe: false,
            color: color
        });
        this.mesh = new THREE.Mesh(geometry, material);
        const radius = getRandomNum(500, 1000);
        const theta = THREE.Math.degToRad(getRandomNum(180));
        const phi = THREE.Math.degToRad(getRandomNum(360));
        this.mesh.position.x = Math.sin(theta) * Math.cos(phi) * radius;
        this.mesh.position.y = Math.sin(theta) * Math.sin(phi) * radius;
        this.mesh.position.z = Math.cos(theta) * radius;
        this.velocity = new THREE.Vector3(getRandomNum(100, -100) * 0.1, getRandomNum(100, -100) * 0.1, getRandomNum(100, -100) * 0.1);
        this.acceleration = new THREE.Vector3();
        this.wonderTheta = 0;
        this.maxSpeed = guiControls.params.maxSpeed;
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
        this.mesh.lookAt(head);

    }

}




/* scene
-------------------------------------------------------------*/
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(colorPalette.screenBg, 3000, 20000);

/* camera
-------------------------------------------------------------*/
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 1800;
camera.lookAt(scene.position);
scene.add(camera);

/* renderer
-------------------------------------------------------------*/
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(new THREE.Color(colorPalette.screenBg));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

/* AmbientLight
-------------------------------------------------------------*/
const ambientLight = new THREE.AmbientLight(colorPalette.ambientLight);
ambientLight.intensity = 0.3;
scene.add(ambientLight);

/* SpotLight
-------------------------------------------------------------*/
const spotLight1 = new THREE.SpotLight(colorPalette.spotLight);
spotLight1.angle = Math.PI / 4;
spotLight1.intensity = 9;
spotLight1.decay = 4;
spotLight1.distance = 9000;
spotLight1.penumbra = 1.0;
spotLight1.position.set(-3000, 3100, 2900);
//scene.add(spotLight1);

/* SpotLight
-------------------------------------------------------------*/
const spotLight2 = new THREE.SpotLight(colorPalette.spotLight);
spotLight2.angle = Math.PI / 4;
spotLight2.intensity = 8;
spotLight2.decay = 8.2;
spotLight2.distance = 7000;
spotLight2.penumbra = 1.0;
spotLight2.position.set(-1700, 2200, 2400);
scene.add(spotLight2);

/* PointLightBall
-------------------------------------------------------------*/
const pointLightBall = new PointLightBall(300, 50, 50);
scene.add(pointLightBall.meshGroup);
pointLightBall.ball1.geometry.computeBoundingSphere();

/* Container
-------------------------------------------------------------*/
// Box
const isLongSideWidth = window.innerWidth > window.innerHeight;
const boxContainer = new BoxContainer(2300, 2300, 2300, colorPalette.boxContainer);
if (guiControls.container === 'box') {
    scene.add(boxContainer.mesh);
}
// Ball
const ballContainer = new BallContainer(1500, 100, 100, colorPalette.ballContainer);
if (guiControls.container === 'ball') {
    scene.add(ballContainer.mesh);
}

/* creature
-------------------------------------------------------------*/
const generateBoid = () => {
    const creatures = [];
    scene.remove(creatureMeshGroup);
    creatureMeshGroup = new THREE.Group();
    for (let i = 0; i < creatureNum; i++) {
        const creature = new Creature();
        creatureMeshGroup.add(creature.mesh);
        creatures.push(creature);
    }
    boid = new Boid(creatures);
    scene.add(creatureMeshGroup);
}
generateBoid();

/* OrbitControls
-------------------------------------------------------------*/
const orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
orbitControls.autoRotate = false;
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.39;

/* resize
-------------------------------------------------------------*/
window.addEventListener('resize', onResize);

/* rendering start
-------------------------------------------------------------*/
document.getElementById('WebGL-output').appendChild(renderer.domElement);
render();
