

// const size = 10; // size of each dimension
// const radius = size / 2; // sphere radius
// const getVoxel = (x, y, z) => {
//     const dx = x - radius;
//     const dy = y - radius;
//     const dz = z - radius;
//     return dx * dx + dy * dy + dz * dz <= radius * radius ? 1 : 0;
// }

// function that generates isometric ascii art
// function generateIsometricAsciiArt() {
//     let result = '';
//
//     for (let y = size - 1; y >= 0; y--) {
//         let line = '';
//         // add padding at the beginning of the line
//         for (let i = 0; i < y; i++) {
//             line += ' ';
//         }
//
//         for (let z = 0; z < size; z++) {
//             for (let x = 0; x < size; x++) {
//                 if (getVoxel(x, y, z) === 1) {
//                     line += '111';
//                 } else {
//                     line += '   ';
//                 }
//             }
//
//             // add new line for each z layer
//             if (z !== size - 1) {
//                 line += '\n';
//                 // add padding at the beginning of the line
//                 for (let i = 0; i < y; i++) {
//                     line += ' ';
//                 }
//             }
//         }
//         result += line + '\n';
//     }
//
//     return result;
// }
//
// console.log(generateIsometricAsciiArt());

const size = 10; // size of each dimension
const radius = size / 2; // sphere radius
const brightnessLevels = '##########';//#-#-#-#-';//$@B%8&WM#*oahkbdpqwmZO0QLCJUYXzcvunxrjft/|()1{}[]?-_+~<>i!l'.split('');//[' ', '.', '*', '#', '@'];

const getVoxel = (x, y, z) => {
    const dx = x - radius;
    const dy = y - radius;
    const dz = z - radius;
    return dx * dx + dy * dy + dz * dz <= radius * radius ? 1 : 0;
}

function generateIsometricAsciiArt2() {
    let result = '';
    var pad = 5;

    for (let y = size - 1; y >= 0; y--) {
        let line = '';
        for (let i = 0; i < pad; i++) {
            line += ' ';
        }

        for (let z = 0; z < size; z++) {
            for (let x = 0; x < size; x++) {
                let voxel = getVoxel(x, y, z);
                if (voxel === 1) {
                    let brightnessIndex = Math.floor(y * brightnessLevels.length / size);
                    line += brightnessLevels[brightnessIndex];
                } else {
                    line += ' ';
                }
            }

            if (z !== size - 1) {
                line += '\n';
                for (let i = 0; i < pad; i++) {
                    line += ' ';
                }
            }
        }
        result += line + '\n';
    }

    return result;
}

function generateIsometricAsciiArt() {
    // Create buffers for each layer
    let layers = Array(size).fill().map(() => Array(size).fill(' '));

    for (let y = size - 1; y >= 0; y--) {
        for (let z = 0; z < size; z++) {
            for (let x = 0; x < size; x++) {
                let voxel = getVoxel(x, y, z);
                if (voxel === 1) {
                    let brightnessIndex = Math.floor(y * brightnessLevels.length / size);
                    layers[z][x] = brightnessLevels[brightnessIndex];
                }
            }
        }
    }

    // Combine layers
    let result = '';
    for (let i = 0; i < size; i++) {
        result += /*' '.repeat(size - i - 1) +*/ layers[i].join('') + '\n';
    }

    return result;
}

console.log(generateIsometricAsciiArt2());
