function generateIcosphere(radius, subdivisions) {
    const t = (1 + Math.sqrt(5)) / 2; // Golden ratio

    // Define the 12 vertices of an icosahedron
    const vertices = [
        [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
        [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
        [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]
    ];

    // Normalize the vertices to have a radius of 1
    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        const length = Math.sqrt(vertex[0] ** 2 + vertex[1] ** 2 + vertex[2] ** 2);
        vertex[0] /= length;
        vertex[1] /= length;
        vertex[2] /= length;
    }

    // Create initial icosahedron faces
    var faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
    ];

    // Subdivide the faces
    for (let i = 0; i < subdivisions; i++) {
        const newFaces = [];
        for (const face of faces) {
            const v1 = getMiddlePoint(face[0], face[1], vertices);
            const v2 = getMiddlePoint(face[1], face[2], vertices);
            const v3 = getMiddlePoint(face[2], face[0], vertices);

            newFaces.push([face[0], v1, v3]);
            newFaces.push([face[1], v2, v1]);
            newFaces.push([face[2], v3, v2]);
            newFaces.push([v1, v2, v3]);
        }
        faces=newFaces;
    }

    // Scale the vertices by the desired radius
    for (let i = 0; i < vertices.length; i++) {
        const vertex = vertices[i];
        vertex[0] *= radius;
        vertex[1] *= radius;
        vertex[2] *= radius;
    }

    // Return the vertices and faces of the icosphere
    return { positions:vertices, cells:faces };
}

function getMiddlePoint(index1, index2, vertices) {
    const v1 = vertices[index1];
    const v2 = vertices[index2];
    const middle = [(v1[0] + v2[0]) / 2, (v1[1] + v2[1]) / 2, (v1[2] + v2[2]) / 2];

    // Normalize the middle point to have a radius of 1
    const length = Math.sqrt(middle[0] ** 2 + middle[1] ** 2 + middle[2] ** 2);
    middle[0] /= length;
    middle[1] /= length;
    middle[2] /= length;

    // Add the middle point to the vertices array and return its index
    vertices.push(middle);
    return vertices.length - 1;
}

function mergeVertices(mesh, precision = 6) {
    const { cells, positions } = mesh;
    const uniquePositions = new Map();
    const mergedPositions = [];
    const indexMapping = new Array(positions.length);

    // This assumes 3D positions, you may need to modify it if you have a different dimension
    const posToString = (x, y, z) => `${x.toFixed(precision)},${y.toFixed(precision)},${z.toFixed(precision)}`;

    for(let i = 0; i < positions.length; i++) {
        const [x, y, z] = positions[i];
        const key = posToString(x, y, z);

        if (!uniquePositions.has(key)) {
            uniquePositions.set(key, mergedPositions.length);
            mergedPositions.push(positions[i]);
        }

        // Map old index to new index
        indexMapping[i] = uniquePositions.get(key);
    }

    // Replace indices in cells using the mapping
    const mergedCells = new Array(cells.length);

    for (let i = 0; i < cells.length; i++) {
        mergedCells[i] = new Array(cells[i].length);
        for (let j = 0; j < cells[i].length; j++) {
            mergedCells[i][j] = indexMapping[cells[i][j]];
        }
    }

    return { cells: mergedCells, positions: mergedPositions };
}



module.exports = {generateIcosphere, mergeVertices}