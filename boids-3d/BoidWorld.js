function fNormalUnitLinePtTurbo_faster(f1,eps=0.1){

    //from https://github.com/nicoptere/raymarching-for-THREE/blob/master/glsl/fragment.glsl
    //in turn from https://github.com/stackgl/glsl-sdf-normal -- mit license

    // var v1 = [ 1.0,-1.0,-1.0];
    // var v2 = [-1.0,-1.0, 1.0];
    // var v3 = [-1.0, 1.0,-1.0];
    // var v4 = [1.0, 1.0, 1.0];
    //
    // return function(x,y,z){
    //     var dv1 = f1(x+v1[0]*eps,y+v1[1]*eps,z+v1[2]*eps);
    //     var dv2 = f1(x+v2[0]*eps,y+v2[1]*eps,z+v2[2]*eps);
    //     var dv3 = f1(x+v3[0]*eps,y+v3[1]*eps,z+v3[2]*eps);
    //     var dv4 = f1(x+v4[0]*eps,y+v4[1]*eps,z+v4[2]*eps);
    //     var vecSum = [
    //         dv1*v1[0]+dv2*v2[0]+dv3*v3[0]+dv4*v4[0],
    //         dv1*v1[1]+dv2*v2[1]+dv3*v3[1]+dv4*v4[1],
    //         dv1*v1[2]+dv2*v2[2]+dv3*v3[2]+dv4*v4[2]];
    //     var dlen = Math.sqrt(vecSum[0]*vecSum[0]+vecSum[1]*vecSum[1]+vecSum[2]*vecSum[2]);
    //
    //     return [vecSum[0]/dlen,vecSum[1]/dlen,vecSum[2]/dlen];
    // };

    return function(x,y,z){
        var dv1 = f1(x+eps,y-eps,z-eps);
        var dv2 = f1(x-eps,y-eps,z+eps);
        var dv3 = f1(x-eps,y+eps,z-eps);
        var dv4 = f1(x+eps,y+eps,z+eps);
        var vecSum = [
            dv1-dv2-dv3+dv4,
            -dv1-dv2+dv3+dv4,
            -dv1+dv2-dv3+dv4];
        var dlen = Math.sqrt(vecSum[0]*vecSum[0]+vecSum[1]*vecSum[1]+vecSum[2]*vecSum[2]);

        return [vecSum[0]/dlen,vecSum[1]/dlen,vecSum[2]/dlen];
    };
}

function dfNormDirect(f1, x,y,z, eps=0.1){
    var dv1 = f1(x+eps,y-eps,z-eps);
    var dv2 = f1(x-eps,y-eps,z+eps);
    var dv3 = f1(x-eps,y+eps,z-eps);
    var dv4 = f1(x+eps,y+eps,z+eps);
    var vecSum = [
        dv1-dv2-dv3+dv4,
        -dv1-dv2+dv3+dv4,
        -dv1+dv2-dv3+dv4];
    var dlen = Math.sqrt(vecSum[0]*vecSum[0]+vecSum[1]*vecSum[1]+vecSum[2]*vecSum[2]);

    return [vecSum[0]/dlen,vecSum[1]/dlen,vecSum[2]/dlen];
};

function getPointAlongLine(line, _t){
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

function lineLength(line){
    var a = line[1][0]-line[0][0];
    var b = line[1][1]-line[0][1];
    var c = line[1][2]-line[0][2];
    return Math.sqrt(a*a+b*b+c*c);
};

function getPointAlongLine_dist(line, dist){
    var _t = dist/lineLength(line);
    var arr = [
        line[0][0] + (line[1][0]-line[0][0])*_t,
        line[0][1] + (line[1][1]-line[0][1])*_t,
        line[0][2] + (line[1][2]-line[0][2])*_t,
    ];
    return arr;
};

function addPts(p0, p1){
    return [p0[0]+p1[0],p0[1]+p1[1],p0[2]+p1[2]];
};

function ptDiff(pt, pt1){
    return [pt[0]-pt1[0],pt[1]-pt1[1],pt[2]-pt1[2]];
}

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
    constructor(creatures = [], nearbyCreaturesFunction = null) {
        this.creatures = creatures;
        this.params = _params;
        this.nearbyCreaturesFunction = nearbyCreaturesFunction || function(x,y,z){return creatures;};
    }

    update(dfContainer=null) {
        // console.log('update boids positions...');
        this.creatures.forEach((creature) => {

            var pos = creature.mesh.position;
            var creaturesNearby = this.nearbyCreaturesFunction(pos.x,pos.y,pos.z);

            // boid
            creature.applyForce(this.align(creature, creaturesNearby));
            creature.applyForce(this.separate(creature, creaturesNearby));
            creature.applyForce(this.choesin(creature, creaturesNearby));

            // aboid light ball
            // creature.applyForce(this.avoidLightBall(creature, {x:0,y:0,z:0}, 10));

            // aboid container
            // if (guiControls.container === 'ball') {

            if(dfContainer){
                creature.applyForce(this.avoidDistanceFunctionContainer(creature, dfContainer));
            }else{
                var ballContainerRadius = 500;
                creature.applyForce(this.avoidBallContainer(creature, ballContainerRadius));
            }


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

    align(currentCreature, creaturesNearby) {
        const sumVector = new THREE.Vector3();
        let cnt = 0;
        const maxSpeed = this.params.maxSpeed;;
        const maxForce = this.params.align.maxForce;
        const effectiveRange = this.params.align.effectiveRange;
        const steerVector = new THREE.Vector3();

        creaturesNearby.forEach((creature) => {
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

    separate(currentCreature, creaturesNearby) {
        const sumVector = new THREE.Vector3();
        let cnt = 0;
        const maxSpeed = this.params.maxSpeed;
        const maxForce = this.params.separate.maxForce;
        const effectiveRange = this.params.separate.effectiveRange;
        const steerVector = new THREE.Vector3();

        creaturesNearby.forEach((creature) => {
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

    choesin(currentCreature, creaturesNearby) {
        const sumVector = new THREE.Vector3();
        let cnt = 0;
        const effectiveRange = this.params.choesin.effectiveRange;
        const steerVector = new THREE.Vector3();

        creaturesNearby.forEach((creature) => {
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

    avoidDistanceFunctionContainer(currentCreature, df) { //df(x,y,z) = distance to surface
        const sumVector = new THREE.Vector3();

        var eps = 0.05;
        var x = currentCreature.mesh.position.x;
        var y = currentCreature.mesh.position.y;
        var z = currentCreature.mesh.position.z;

        var dfvHere = -df(x,y,z);

        var normalDir = dfNormDirect(df, x,y,z, eps); //[x,y,z] norm dir
        var normalLine = [[x,y,z],addPts([x,y,z],normalDir)];
        var nearbySurfacePt = getPointAlongLine_dist(normalLine, dfvHere);

        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(nearbySurfacePt[0],nearbySurfacePt[1],nearbySurfacePt[2])));
        sumVector.multiplyScalar(Math.pow(currentCreature.velocity.length(), 3));
        return sumVector;
    }

    approachDistanceFunctionContainer(currentCreature, df) { //df(x,y,z) = distance to surface
        const sumVector = new THREE.Vector3();

        var eps = 0.05;
        var x = currentCreature.mesh.position.x;
        var y = currentCreature.mesh.position.y;
        var z = currentCreature.mesh.position.z;

        var dfvHere = df(x,y,z);

        var normalDir = dfNormDirect(df, x,y,z, eps); //[x,y,z] norm dir
        var normalLine = [[x,y,z],addPts([x,y,z],normalDir)];
        var nearbySurfacePt = getPointAlongLine_dist(normalLine, dfvHere);

        sumVector.add(this.avoid(currentCreature, new THREE.Vector3(nearbySurfacePt[0],nearbySurfacePt[1],nearbySurfacePt[2])));
        sumVector.multiplyScalar(Math.pow(currentCreature.velocity.length(), 3));
        return sumVector;
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