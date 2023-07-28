function distanceSquared(point1, point2) {
    // if (point1.length !== point2.length) {
    //     throw new Error('Points must have the same number of dimensions');
    // }

    let sum = 0;
    for (let i = 0; i < point1.length; i++) {
        const diff = point1[i] - point2[i];
        sum += diff * diff;
    }
    return sum;
}

function kNearestNeighbors(data, queryPoint, k) {
    if (k <= 0 || k > data.length) {
        throw new Error('k must be a positive integer smaller or equal to the number of data points');
    }

    const distances = [];
    for (const point of data) {
        const distSq = distanceSquared(point, queryPoint);
        distances.push({ point, distSq });
    }

    distances.sort((a, b) => a.distSq - b.distSq);

    const neighbors = [];
    for (let i = 0; i < k; i++) {
        neighbors.push(distances[i].point);
    }

    return neighbors;
}

module.exports = {kNearestNeighbors};