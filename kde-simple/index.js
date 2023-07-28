function getPeakValue(data, bandwidth, useTriangular, range){
    return data.map(function(row,i){
        var res = kernelDensityEstimate(data, row.x, bandwidth, useTriangular, range);
        return {x: row.x, val: res, sampleIndex: i};
    }).sort(function(a,b){return b.val-a.val})[0];
}

function kernelDensityEstimate(data, point, bandwidth, useTriangular, range){//, normalizedKernel=true) {
    var density = 0;
    var n = data.length;
    var kernel;

    // if(normalizedKernel){
    kernel = useTriangular ? triangularKernel : gaussianKernel;
    // }else{
    //     kernel = useTriangular ? triangularKernel1 : gaussianKernel1;
    // }
    var totalWeight = 0;
    for (var i = 0; i < n; i++) {
        var w = 1.0;
        if (typeof data[i].weight !== 'undefined') {
            w = data[i].weight;
        }
        density += w*kernel((point - data[i].x) / bandwidth);
        totalWeight+=bandwidth*w;
    }

    var v = density / totalWeight;

    if(range){
        return (v-range[0])/(range[1]-range[0]);
    }

    return v;
}

function getRange(data, bandwidth, useTriangular){
    var min = 0;
    var max = 0;
    data.forEach(function(p){
        var v = kernelDensityEstimate(data, p.x, bandwidth, useTriangular);
        min=Math.min(v,min);
        max=Math.max(v,max);
    });
    return [min,max];
}

function gaussianKernel(x) {
    return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * x * x);
}

function triangularKernel(x) {
    var _x = Math.max(Math.min(x,1.0),-1);
    return (1.0 - Math.abs(_x));
}

//generate sample via rejection sampling
function generateRandomFromKDE(samples, bandwidth, useTriangular) {
    var xmin = Math.min(...samples.map(s=>s.x-bandwidth*2));
    var xmax = Math.max(...samples.map(s=>s.x+bandwidth*2));
    var ymin = 0;
    var ymax = 1.0 / (bandwidth * samples.length); // Upper bound of the KDE.

    // Generate a random sample from the KDE using rejection sampling.
    while (true) {
        var x = xmin + Math.random() * (xmax - xmin);
        var y = Math.random() * ymax;
        var kde = kernelDensityEstimate(samples, x, bandwidth, useTriangular);
        if (y < kde) {
            return x;
        }
    }
}

function getKDEDerivatives(data, point, bandwidth, useTriangular, range, h=0.0001) {
    //var h = 0.0001; // small step size for numerical differentiation

    // Calculate the density at the given point
    var f0 = kernelDensityEstimate(data, point, bandwidth, useTriangular, range);

    // Calculate the first derivative using central difference
    var f1 = (kernelDensityEstimate(data, point + h, bandwidth, useTriangular, range) -
              kernelDensityEstimate(data, point - h, bandwidth, useTriangular, range)) / (2 * h);

    // Calculate the second derivative using central difference
    var f2 = (kernelDensityEstimate(data, point + h, bandwidth, useTriangular, range) -
              2 * f0 +
              kernelDensityEstimate(data, point - h, bandwidth, useTriangular, range)) / (h * h);

    return { firstDerivative: f1, secondDerivative: f2 };
}

function calculateBandwidth_scott(samples) { //bandwidth via Scott's rule
    // compute the sum of weights and sum of squared weights
    var sum_of_weights = 0;
    var sum_of_squared_weights = 0;
    for(var i = 0; i < samples.length; i++) {
        sum_of_weights += samples[i].weight;
        sum_of_squared_weights += Math.pow(samples[i].weight, 2);
    }

    // calculate equivalent sample size (ESS)
    var ESS = Math.pow(sum_of_weights, 2) / sum_of_squared_weights;

    // Scott's rule for 1D data
    var h = Math.pow(ESS, -1/5); // -1/(d+4) becomes -1/5 for 1D data

    return h;
}

// function to calculate standard deviation
function standardDeviation(values){
    const n = values.length
    const mean = values.reduce((a, b) => a + b) / n
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n)
}

// function to calculate interquartile range (IQR)
function iqr(values){
    values.sort((a, b) => a - b);
    const quartile1 = values[Math.floor((values.length / 4))];
    const quartile3 = values[Math.ceil((values.length * (3 / 4)))];
    return quartile3 - quartile1;
}

// function to calculate bandwidth using Silverman's Rule of Thumb
function calculateBandwidth_silverman(samples) {
    // extract the x values
    var x_values = samples.map(sample => sample.x);

    // calculate the standard deviation and IQR
    var std_dev = standardDeviation(x_values);
    var interquartile_range = iqr(x_values);

    // calculate the bandwidth using Silverman's Rule of Thumb
    var h = 0.9 * Math.min(std_dev, interquartile_range / 1.34) * Math.pow(samples.length, -1 / 5);

    return h;
}

module.exports = {getPeakValue, calculateBandwidth_silverman, calculateBandwidth_scott, getRange, gaussianKernel, triangularKernel, kernelDensityEstimate, generateRandomFromKDE, getKDEDerivatives}