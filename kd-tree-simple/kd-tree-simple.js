const PriorityQueue = require('js-priority-queue');

class Node {
    constructor(object, depth = 0, left = null, right = null) {
        this.object = object;
        this.depth = depth;
        this.left = left;
        this.right = right;
    }
}

class KDTree {
    constructor() {
        this.root = null;
    }

    add(object) {
        this.root = this.insert(this.root, object);
    }

    insert(node, object, depth = 0) {
        if (node === null) {
            return new Node(object, depth);
        }
        const keys = Object.keys(object);
        const axis = keys[depth % keys.length];
        if (object[axis] < node.object[axis]) {
            node.left = this.insert(node.left, object, depth + 1);
        } else {
            node.right = this.insert(node.right, object, depth + 1);
        }
        return node;
    }

    kNearestNeighbors(k, object, distanceFunc = this.distanceEuclidean, addDistanceField=true) {
        const queue = new PriorityQueue({comparator: (a, b) => b.distance - a.distance});
        this.kNearestNeighborsHelper(this.root, k, object, queue, distanceFunc);

        const neighbors = [];
        while (queue.length) {
            var n = queue.dequeue();
            var o = n.object;
            if(addDistanceField){
                o.distance = n.distance;
            }
            neighbors.push(o);
        }

        return neighbors.reverse();
    }

    kNearestNeighborsHelper(node, k, object, queue, distanceFunc) {
        if (node === null) {
            return;
        }

        const distance = distanceFunc(object, node.object);

        if (queue.length < k || distance < queue.peek().distance) {
            if (queue.length === k) {
                queue.dequeue();
            }
            queue.queue({distance, object: node.object});
        }

        const keys = Object.keys(object);
        const axis = keys[node.depth % keys.length];

        let near, far;
        if (object[axis] < node.object[axis]) {
            near = node.left;
            far = node.right;
        } else {
            near = node.right;
            far = node.left;
        }

        this.kNearestNeighborsHelper(near, k, object, queue, distanceFunc);

        if (queue.length < k || Math.abs(node.object[axis] - object[axis]) < queue.peek().distance) {
            this.kNearestNeighborsHelper(far, k, object, queue, distanceFunc);
        }
    }

    distanceEuclidean(object1, object2,  indexField='index') { //indexField is field to be ignored
        let sum = 0;

        for (let key in object1) {
            if (key !== indexField && object2.hasOwnProperty(key)) {
                sum += Math.pow(object1[key] - object2[key], 2);
            }
        }

        return Math.sqrt(sum);
    }

    distanceMSE(a, b, indexField='index') {  //indexField is field to be ignored
        let totalError = 0;
        let n = 0;
        const errorPow = 2; //2 = normal mse

        for (let key in a) {
            if (key !== indexField && b.hasOwnProperty(key)) {
                let error = a[key] - b[key];
                totalError += Math.abs(Math.pow(error,errorPow));
                n++;
            }
        }

        var mse = n === 0 ? Infinity : totalError / n;
        return mse;
    }
}

module.exports = {KDTree};