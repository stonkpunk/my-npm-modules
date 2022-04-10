function defaultChartOptions() {
    return {
        fixWinding: false,
        maxBoundaryLength: 0,
        maxChartArea: 0,
        maxCost: 2,
        maxIterations: 1,
        normalDeviationWeight: 2,
        normalSeamWeight: 4,
        roundnessWeight: 0.009999999776482582,
        straightnessWeight: 6,
        textureSeamWeight: 0.5,
        useInputMeshUvs: false,
    };
}

function defaultPackOptions() {
    return {
        bilinear: true,
        blockAlign: false,
        bruteForce: false,
        createImage: false,
        maxChartSize: 0,
        padding: 0,
        resolution: 0,
        rotateCharts: true,
        rotateChartsToAxis: true,
        texelsPerUnit: 0
    };
}

module.exports = {
    defaultPackOptions,
    defaultChartOptions
}